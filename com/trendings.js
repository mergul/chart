/**
 * Trend state Model
 * The trendModel object use Lines and lineDirectives to estimate current trend state
 */
class TrendStateModel {
  constructor(lines, env) {
    this.env = env;
    this.lines = lines;
    this.in = {
      state: null,
      lineIndex: null,
      line: null,
    };
    this.is = {
      state: null,
      lineIndex: null,
      line: null,
      start: null,
      size: 0,
    };
    this.was = {
      state: null,
      lineIndex: null,
      line: null,
      size: null,
    };
    this.width = 0;
    this.speed = 0;
    this.at = 0;
  }

  update(hLinesIDs, lLinesIDs) {
    //Wait for the first turn
    //Init
    // Search of the longest line begun from this.is
    // TODO longest is just the first in array of forked lines
    if (hLinesIDs.length > 1)
      this.hlMaxDuration = hLinesIDs
        .map((lineID) => this.lines.id[lineID])
        .filter((line) =>
          this.is.line
            ? line.forkedAt
              ? line.forkedAt > this.is.line.startPoint.x
              : line.rollback
              ? line.rollback.lastForkTime > this.is.line.startPoint.x
              : false
            : true
        )
        .reduce((prev, current) => {
          return prev.length > current.length ? prev : current;
        }, this.lines.id[hLinesIDs[0]]);
    else this.hlMaxDuration = this.lines.id[hLinesIDs[0]];
    if (lLinesIDs.length > 1)
      this.llMaxDuration = lLinesIDs
        .map((lineID) => this.lines.id[lineID])
        .filter((line) =>
          this.is.line
            ? line.forkedAt
              ? line.forkedAt > this.is.line.startPoint.x
              : line.rollback
              ? line.rollback.lastForkTime > this.is.line.startPoint.x
              : false
            : true
        )
        .reduce((prev, current) => {
          return prev.length > current.length ? prev : current;
        }, this.lines.id[lLinesIDs[0]]);
    else this.llMaxDuration = this.lines.id[lLinesIDs[0]];

    if (this.is.state == null && this.was.state == null) {
      // Take the minimum trend duration = 5 candles
      this.is.line =
        this.llMaxDuration &&
        this.llMaxDuration.length > this.env.minLength &&
        this.hlMaxDuration.length < this.env.minLength
          ? this.llMaxDuration //hLines
          : this.hlMaxDuration &&
            this.hlMaxDuration.length > this.env.minLength &&
            this.llMaxDuration.length < this.env.minLength
          ? this.hlMaxDuration
          : null;
      if (this.is.line) {
        this.is.lineIndex = this.is.line.index;
        this.is.state = this.is.line.type == "h" ? "fall" : "rise";
        this.is.start = this.is.line.candlePoint;
      }
    }

    if (this.is.state) {
      // Wait for any line good break
      this.is.size = Math.max(
        this.is.size,
        Math.abs(this.is.start.y - this.is.line.candlePoint.y)
      );
      let selectedLine =
        this.lines.id[this.is.lineIndex] ||
        this.lines.id[this.is.line.type == "h" ? 0 : 1];
      let foundBreak = null;
      let delta = null;
      let prevLineID = undefined;
      let oppositeLines = this.lines.list[
        selectedLine.type == "h" ? 1 : 0
      ].filter(
        (id) =>
          this.lines.id[id].forked &&
          this.lines.id[id].thisPoint.x - this.lines.id[id].forkedAt > 12
      );
      let oppositeLineID =
        oppositeLines.length > 1
          ? oppositeLines[1]
          : oppositeLines.length > 0
          ? oppositeLines[0]
          : null;
      let oppositeLinesInsideTrend = oppositeLines.filter(
        (id) => this.lines.id[id].forkedAt > this.is.start.x
      );
      if (selectedLine)
        this.lines.list[selectedLine.type == "h" ? 0 : 1].forEach(
          (lineID, index) => {
            let theLine = this.lines.id[lineID];
            // Trend change conditions
            if (lineID >= selectedLine.index && theLine.rollback != null) {
              // when break on inner lines
              // Get distance from the last fork on previous or current line
              prevLineID =
                this.lines.list[selectedLine.type == "h" ? 0 : 1][index - 1];
              const cond =
                this.env.deltaModel == 1 &&
                index > 1 &&
                prevLineID &&
                this.lines.id[prevLineID]
                  ? index > 1 &&
                    prevLineID &&
                    this.lines.id[prevLineID].lastForkY
                  : this.lines.id[lineID > 0 ? lineID - 1 : 0];
              if (cond)
                delta =
                  this.lines.id[
                    lineID > 1 ? prevLineID : selectedLine.type == "h" ? 0 : 1
                  ].lastForkY - theLine.candlePoint.y;
              else if (theLine.rollback)
                delta = theLine.rollback.lastForkValue - theLine.candlePoint.y;
              else delta = 0;
              if (
                theLine.rollback.lastForkValue > 0 && // Only if break of forked line
                // The line lasts more then this.env.minRightLeg
                theLine.thisPoint.x - theLine.rollback.lastForkTime >
                  this.env.minRightLeg &&
                // TODO Maybe we should choose shortest and bounced line instead longest
                (this.is.state == "fall"
                  ? this.llMaxDuration.length > 1
                  : this.hlMaxDuration.length > 1) && // Превышены граничные параметры
                // - По предыдущему экстремуму. Пробита величина прошлого экстремума
                ((selectedLine.type == "h" ? delta < 0 : delta > 0) ||
                  // - По времени. текущая лития столкнулась с длительным пробоем
                  theLine.rollback.length > this.env.rollbackLength ||
                  //  - По амплитуде. Откат до установленной доли между ценой начала тренда и ценой от начала обратной линии
                  ((this.is.size * 2) / 3 >
                    Math.abs(this.is.start.y - this.is.line.candlePoint.y) &&
                    this.is.size >
                      this.is.line.candlePoint.y *
                        this.env.minIsSizeOnRollback &&
                    oppositeLinesInsideTrend.length > 1) ||
                  (selectedLine.type == "h"
                    ? theLine.candlePoint.y > this.is.start.y &&
                      this.lines.list[0].length == 1
                    : theLine.candlePoint.y < this.is.start.y &&
                      this.lines.list[1].length == 1)) && // сохраняются разрешенные диапазоны
                // - предыдущее ветвление (экстремум) был в заданном диапазоне
                ((theLine.candlePoint.x - theLine.rollback.lastForkTime >
                  this.env.forkDurationMin &&
                  theLine.candlePoint.x - theLine.rollback.lastForkTime <
                    this.env.forkDurationMax) ||
                  // - текущая цена вышла из тренда
                  (selectedLine.type == "h"
                    ? theLine.candlePoint.y > theLine.startPoint.y
                    : theLine.candlePoint.y < theLine.startPoint.y) ||
                  (selectedLine.type == "h"
                    ? theLine.candlePoint.y > this.is.start.y &&
                      this.lines.list[0].length == 1
                    : theLine.candlePoint.y < this.is.start.y &&
                      this.lines.list[1].length == 1))
              )
                foundBreak = lineID + 1;
            }
          }
        );
      if (foundBreak) {
        // Calculate and compare was and is
        this.in.size = (this.was.size || 0) + this.is.size;
        // Estimate in state
        const dif = this.lines.id[0].candlePoint.y - this.is.start.y;
        const isSuccess = this.is.state == "rise" ? dif >= 0 : dif < 0;
        if (this.was.size)
          this.in.state =
            this.was.size > this.is.size ? this.was.state : this.is.state;
        // Copy is to was
        this.was = { ...this.is };
        this.was.success = isSuccess;
        // Update is
        // if exists opposite line with length > ?5 && length < thisLine.length then createOrder
        this.is.line =
          this.is.state == "fall" ? this.llMaxDuration : this.hlMaxDuration;
        this.is.state = this.is.line.type == "h" ? "fall" : "rise";
        this.is.lineIndex = this.is.line.index;
        this.is.start = this.lines.id[0].candlePoint;
        this.is.size = 0;
      }
      //
    }

    return;
  }
}

/**
 * Lines Model class.
 * this.index - index in lineDirectives array
 */
class LinesModel {
  constructor(step) {
    this.step = step;
    this.list = [[], []];
    this.id = {};
  }

  add(h, l, i, prevPoint = null, lineID = null) {
    // Если lineID определена - это экстремум
    let curIndex,
      holdLastForkY = null;
    if (lineID == null) {
      curIndex = this.lineIndex;
      this.lineIndex++;
      if (h != null) this.list[0].push(curIndex);
      else this.list[1].push(curIndex);
    } else {
      curIndex = lineID;
      // Сохраняем прежнюю точку ветвления или берем предыдущую
      holdLastForkY =
        this.id[curIndex].lastForkY || (h != null ? prevPoint.h : prevPoint.l);
    }
    this.id[curIndex] = new LineModel(h, l, i, this.step, curIndex, prevPoint);
    // Restore lastForkY from previous state
    if (holdLastForkY) {
      this.id[curIndex].lastForkY = holdLastForkY;
    }

    /**
     * Метод 3. Ищем последовательность: fork, rollback, fork, trade, wait same on opposite side
     */

    /**
     * Метод 2. Для линии в начале ее ветвления сохраняем y и сравниваем. Сигнализируем, когда разница больше или меньше нуля
     * Метод дает слишком много сигналов из которых сложно выделить значимые. Стоит поискать более эффективный метод поиска разворота
     */
    let sourceLineID, preSourceLineID;
    if (curIndex > 1 || (lineID != null && this.id[lineID] != null)) {
      sourceLineID =
        lineID != null
          ? lineID
          : this.list[this.id[curIndex].type == "h" ? 0 : 1][
              this.list[this.id[curIndex].type == "h" ? 0 : 1].indexOf(
                curIndex
              ) - 1
            ];
      preSourceLineID =
        lineID != null
          ? lineID
          : this.list[this.id[curIndex].type == "h" ? 0 : 1][
              this.list[this.id[curIndex].type == "h" ? 0 : 1].indexOf(
                curIndex
              ) - 2
            ];
      let lastForkVal = this.id[sourceLineID].lastForkY;
      // Если линия только создана, то берем экстремум у предыдущей в массиве линии preSourceLineID
      if (preSourceLineID && !lastForkVal)
        lastForkVal = this.id[preSourceLineID].lastForkY;
      let prevForkValue = h != null ? prevPoint.h : prevPoint.l;
      if (lastForkVal) {
        if (h)
          this.forkDiffH =
            lastForkVal >= prevForkValue ? -sourceLineID - 1 : sourceLineID + 1;
        else
          this.forkDiffL =
            lastForkVal >= prevForkValue ? -sourceLineID - 1 : sourceLineID + 1;
      }
      this.id[sourceLineID].lastForkY = prevForkValue;
    }

    return curIndex;
  }

  update(lineID, h, l, t) {
    return this.id[lineID].update(h, l, t);
  }

  delete(lineID) {
    if (!this.id[lineID]) return;
    if (this.id[lineID].type == "h")
      this.list[0].splice(this.list[0].indexOf(lineID), 1);
    else this.list[1].splice(this.list[1].indexOf(lineID), 1);
    delete this.id[lineID];
  }
}

/**
 * Line Model class.
 * this.index - index in lineDirectives array
 */
class LineModel {
  constructor(h, l, i, step, index, prevPoint = null) {
    this.step = step;
    this.index = index;
    this.length = 0;
    // TODO On fork startPoint is the fork point not the candle point
    this.startPoint = prevPoint
      ? {
          y: h ? prevPoint.h : prevPoint.l,
          x: prevPoint.x,
        }
      : {
          y: h || l,
          x: i,
        };
    this.init(h, l, i);
    this.thisPoint = this.startPoint;
  }

  init(h, l, i) {
    if (!this.type) this.type = h ? "h" : "l";
    this.candlePoint = {
      y: this.type == "h" ? h : l,
      x: i,
    };
    // Shift window if data exists
    if (this.thisPoint) {
      this.prevPoint = this.thisPoint;
      if (this.nextPoint) this.thisPoint = this.nextPoint;
      this.nextPoint = {
        y: this.k * (this.candlePoint.x + this.step) + this.b,
        x: this.candlePoint.x + this.step,
      };
    }
  }

  /**
   * Update line object. Returns LineDirectives - actions list for the next candle based on prediction
   * @param h
   * @param l
   * @param i
   */
  update(h, l, i) {
    let result = null;
    this.length++;
    this.init(h, l, i);
    // Init К b
    if (!this.k || isNaN(this.k)) {
      this.k =
        (this.candlePoint.y - this.startPoint.y) /
        (this.candlePoint.x - this.startPoint.x);
      this.b = this.candlePoint.y - this.k * this.candlePoint.x;
      this.prevPoint = this.startPoint;
      this.thisPoint = this.candlePoint;
      this.nextPoint = {
        y: this.k * (this.candlePoint.x + this.step) + this.b,
        x: this.candlePoint.x + this.step,
      };
      result = {
        condition: this.type == "h" ? "lt" : "gt",
        value: this.nextPoint.y,
        action: "fork",
        lineIndex: this.index,
      };
    }
    // Update incline
    if (
      (this.type == "h" && this.thisPoint.y <= this.candlePoint.y) ||
      (this.type == "l" && this.thisPoint.y >= this.candlePoint.y)
    ) {
      this.k =
        (this.candlePoint.y - this.startPoint.y) /
        (this.candlePoint.x - this.startPoint.x);
      this.b = this.candlePoint.y - this.k * this.candlePoint.x;
      this.thisPoint = this.candlePoint;
      this.length = 0;
      this.nextPoint = {
        y: this.k * (this.candlePoint.x + this.step) + this.b,
        x: this.candlePoint.x + this.step,
      };
      let rollbackTime = this.rollback ? this.rollback.length : 0;
      let rollbackIncline = this.candlePoint.y - this.prevPoint.y; // Take only one candle
      // Set rollback flag if moving away from the middle of price
      if (this.type == "h" ? rollbackIncline > 0 : rollbackIncline < 0) {
        this.rollback = {
          k: rollbackIncline,
          b: this.candlePoint.y - rollbackIncline * this.candlePoint.x,
          length: rollbackTime + 1,
          lastForkTime:
            this.forkedAt || (this.rollback ? this.rollback.lastForkTime : 0),
          lastForkValue:
            this.forkedValue ||
            (this.rollback ? this.rollback.lastForkValue : 0),
        };
        // If rollback then the line lost the fork point
        // TODO Use accuracy to reset the forked value
        this.forked = false;
        this.forkedAt = null;
        this.forkedValue = null;
      } else {
        this.forkedAt = this.candlePoint.x;
        this.forkedValue = this.candlePoint.y;
        this.forked = true;
        this.rollback = null;
      }
      // Wait for bounce
      result = {
        condition: this.type == "h" ? "lt" : "gt",
        value: this.nextPoint.y,
        action: "fork",
        lineIndex: this.index,
      };
    } else {
      this.rollback = null;
    }
    return result;
  }

  /**
   * Update timescale
   * TODO operate in different time scale
   * @param step
   */
  updateStep(step) {
    this.step = step;
  }
}

class TrendlinesIndicator {
  constructor(pars) {
    // Assign defaults
    this.env = Object.assign(
      {
        step: 1, // time step in minutes
        minLength: 5,
        minRightLeg: 3,
        maxForks: 500,
        minLog: 0,
        maxLog: 0,
        rollbackLength: 3, // Устойчивый откат после пробоя линии тренда
        deltaModel: 1,
        minIsSizeOnRollback: 0.05,
      },
      pars
    );
    this.env.minLength = Math.round(this.env.minLength / this.env.step) || 1;
    this.env.minRightLeg =
      Math.round(this.env.minRightLeg / this.env.step) || 1;
    this.env.rollbackLength =
      Math.round(this.env.rollbackLength / this.env.step) || 1;
    this.env.forkDurationMin =
      Math.round(this.env.forkDurationMin / this.env.step) || 1;
    this.env.forkDurationMax =
      Math.round(this.env.forkDurationMax / this.env.step) || 1;
    this.step = 1;
    this.lines = new LinesModel(this.step);
    this.trend = new TrendStateModel(this.lines, this.env);
    this.i = 0;
    this.lLineDirectives = [];
    this.hLineDirectives = [];
    this.localCounter = 0;
  }

  log(title, ...data) {
    this.consoleWindow =
      this.env.minLog < this.localCounter &&
      this.localCounter < this.env.maxLog;
    if (this.consoleWindow) console.log(title, ...data);
  }

  /**
   * Operate next candle method
   * @param o
   * @param c
   * @param h
   * @param l
   * @returns - arrow of 6 lines points
   */
  nextValue(o, c, h, l) {
    this.localCounter++;

    // Apply line directives got on prevues step
    if (this.lLineDirectives.length > 0) {
      // TODO Fork only last line in Array
      this.lLineDirectives.forEach((d, i) => {
        let theLine = this.lines.id[d.lineIndex];
        if (d.condition == "gt" && l > d.value && d.action == "fork") {
          if (theLine) {
            if (
              d.lineIndex != undefined &&
              theLine != undefined &&
              theLine.k < 0
            )
              this.lines.add(null, l, this.i - 1, this.prevPoint, d.lineIndex);
            // New extremum found
            else {
              theLine.forked = true;
              theLine.forkedAt = theLine.thisPoint.x;
              theLine.forkedValue = theLine.thisPoint.y;
              this.lines.add(null, l, this.i - 1, this.prevPoint);
            }
          }
        }
      });
    }
    if (this.hLineDirectives.length > 0) {
      this.hLineDirectives.forEach((d, i) => {
        let theLine = this.lines.id[d.lineIndex];
        if (d.condition == "lt" && h < d.value && d.action == "fork") {
          if (theLine) {
            if (theLine.k > 0)
              // New extremum found
              this.lines.add(h, null, this.i - 1, this.prevPoint, d.lineIndex);
            else {
              theLine.forked = true;
              theLine.forkedAt = theLine.thisPoint.x;
              theLine.forkedValue = theLine.thisPoint.y;
              this.lines.add(h, null, this.i - 1, this.prevPoint);
            }
          }
        }
      });
    }
    // Update lines and get future directives
    this.hLineDirectives.length = 0;
    this.lLineDirectives.length = 0;
    if (this.lines.list[0].length < 1) {
      this.lines.add(h, null, this.i);
      this.lines.add(null, l, this.i);
    } else {
      let updated;
      this.lines.list.forEach((ofLines) =>
        ofLines.forEach((lineID) => {
          let theLine = this.lines.id[lineID];
          if (theLine && theLine.type) {
            updated = null;
            if (theLine && theLine.startPoint.x < this.i)
              // Skip the case if line was just created. TODO make it gracefully
              updated = this.lines.update(lineID, h, l, this.i);
            let type = theLine.type;
            if (updated)
              type == "h"
                ? this.hLineDirectives.push(updated)
                : this.lLineDirectives.push(updated);
          }
        })
      );
    }

    //Delete passed lines
    let toDelete = [];
    this.lines.list.forEach((ofLines) => {
      if (ofLines) {
        toDelete = [];
        ofLines.forEach((lineID, i) => {
          let thisLine = this.lines.id[ofLines[i]];
          let prevLine = this.lines.id[ofLines[i - 1]];
          if (
            (i > 0 &&
              thisLine &&
              prevLine &&
              thisLine.type == "h" &&
              thisLine.thisPoint &&
              prevLine.thisPoint.y <= thisLine.thisPoint.y) ||
            i > this.env.maxForks ||
            (i > 0 &&
              thisLine &&
              prevLine &&
              thisLine.type == "l" &&
              thisLine.thisPoint &&
              prevLine.thisPoint.y >= thisLine.thisPoint.y) ||
            i > this.env.maxForks
          ) {
            toDelete.push(lineID);
          }
        });
        toDelete.forEach((lineID) => this.lines.delete(lineID));
      }
    });
    this.prevPoint = {
      x: this.i,
      h: h,
      l: l,
    };
    // Estimate trend
    this.trend.update(this.lines.list[0], this.lines.list[1]);
    this.i++;

    // Return result
    return this.lines;
  }
}
