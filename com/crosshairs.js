var crosshairsSeries = function () {
  var target = null,
    series = null,
    xScale = d3.scaleTime(),
    yScale = d3.scaleLinear(),
    yValue = "y",
    formatH = null,
    formatV = null,
    indicatorsCount = 0;

  var lineH = null,
    lineV = null,
    circle = null,
    calloutH = null,
    calloutV = null;

  var highlight = null;

  var crosshairs = function (selection) {
    var root = (target || selection)
      .insert("g", "rect.zoom")
      .attr("class", "crosshairs");

    lineH = root
      .append("line")
      .attr("class", "crosshairs horizontal")
      .attr("x1", xScale.range()[0])
      .attr("x2", xScale.range()[1])
      .attr("display", "none");

    lineV = root
      .append("line")
      .attr("class", "crosshairs vertical")
      .attr("y1", yScale.range()[0] + indicatorsCount * 80)
      .attr("y2", yScale.range()[1])
      .attr("display", "none");

    circle = root
      .append("circle")
      .attr("class", "crosshairs circle")
      .attr("r", 6)
      .attr("display", "none");

    calloutH = root
      .append("text")
      .attr("class", "crosshairs callout horizontal")
      .attr("x", xScale.range()[1])
      .attr("y", yScale.range()[0] + 10 + indicatorsCount * 80)
      .attr("style", "text-anchor: middle")
      .attr("display", "none");

    calloutV = root
      .append("text")
      .attr("class", "crosshairs callout vertical")
      .attr("y", "0")
      .attr("x", xScale.range()[1] + 26)
      .attr("style", "text-anchor: end")
      .attr("display", "none");
  };

  function findNearest(xMouse) {
    const dd = xMouse.toDateString();
    const parseDate = d3.timeParse("%a %b %d %Y");
    const tim = parseDate(dd);

    var nearest = null,
      dx = Number.MAX_VALUE;

    series.some(function (data, ind) {
      var xData = data.date,
        xDiff = Math.abs(tim.getTime() - xData.getTime());
      // console.log("index: ", ind);
      if (xDiff < dx) {
        dx = xDiff;
        nearest = data;
        index = ind;
      } else {
        return true;
      }
    });
    /**
 * 
    if (highlight) {
      maser =
        highlight.date.getTime() > tim.getTime()
          ? series.slice(0, index).reverse()
          : series.slice(index);
    } else maser = series;
    let ind;
    let diff;
    const ex = maser.some((d, i) => {
      console.log("index ", i, " date ", d.date, " tim ", tim);
      ind = i;
      if (!diff || diff > Math.abs(d.date.getTime() - tim.getTime())) {
        diff = Math.abs(d.date.getTime() - tim.getTime());
      } else {
        ind--;
        return true;
      }
      return diff === 0;
    });
    if (ex) {
      nearest = series[ind];
      index = ind;
    } else nearest = highlight;
 */
    return nearest;
  }
  let showLabel = (d) => {
    const maj = (d.close - d.open).toFixed(2);
    const yaj = maj < 0 ? "#bf4a48" : "#1d7e75";
    const label = d3.select(".label");
    label.select("#date").text("Date: " + `${d.date.toDateString()}`);
    label.select("#open").text("Open: " + `${d.open.toFixed(2)}`);
    label.select("#close").text("Close: " + `${d.close.toFixed(2)}`);
    label.select("#high").text("High: " + `${d.high.toFixed(2)}`);
    label.select("#low").text("Low: " + `${d.low.toFixed(2)}`);
    label.select("#volume").text("Volume: " + `${d.volume.toFixed(2)}`);
    label.select("#diff").text("Diff: " + `${maj}`);
    label.style("fill", yaj);
  };
  crosshairs.update = function (event, xPos) {
    var xMouse =
        (event == null && xScale.invert(xPos)) ||
        xScale.invert(d3.pointer(event)[0]),
      nearest = findNearest(xMouse);

    if (event === null || (nearest !== null && nearest !== highlight)) {
      highlight = nearest;
      this.highlight;

      var x = xScale(highlight.date),
        y = yScale(highlight[yValue]);

      lineH.attr("y1", y).attr("y2", y);
      lineV.attr("x1", x).attr("x2", x);
      circle.attr("cx", x).attr("cy", y);
      calloutH.attr("x", x).text(formatH(highlight));
      calloutV.attr("y", y).text(formatV(highlight));

      lineH.attr("display", "inherit");
      lineV.attr("display", "inherit");
      circle.attr("display", "inherit");
      calloutH.attr("display", "inherit");
      calloutV.attr("display", "inherit");
      showLabel(highlight);
    }
  };
  crosshairs.reset = function () {
    highlight = null;
    lineH.attr("display", "none");
    lineV.attr("display", "none");
    circle.attr("display", "none");
    calloutH.attr("display", "none");
    calloutV.attr("display", "none");
  };
  crosshairs.target = function (value) {
    if (!arguments.length) {
      return target;
    }

    if (target) {
      target.on("mousemove.crosshairs", null);
      target.on("mouseout.crosshairs", null);
    }

    target = value;

    target.on("mousemove.crosshairs", this.update);
    target.on("mouseout.crosshairs", this.reset);

    return crosshairs;
  };

  crosshairs.series = function (value) {
    if (!arguments.length) {
      return series;
    }

    series = value;
    return crosshairs;
  };

  crosshairs.xScale = function (value) {
    if (!arguments.length) {
      return xScale;
    }

    xScale = value;
    return crosshairs;
  };

  crosshairs.yScale = function (value) {
    if (!arguments.length) {
      return yScale;
    }

    yScale = value;
    return crosshairs;
  };

  crosshairs.yValue = function (value) {
    if (!arguments.length) {
      return yValue;
    }

    yValue = value;
    return crosshairs;
  };

  crosshairs.formatH = function (value) {
    if (!arguments.length) {
      return formatH;
    }

    formatH = value;
    return crosshairs;
  };

  crosshairs.formatV = function (value) {
    if (!arguments.length) {
      return formatV;
    }

    formatV = value;
    return crosshairs;
  };
  crosshairs.highlight = function (value) {
    if (!arguments.length) {
      return highlight;
    }
    highlight = value;
    return crosshairs;
  };
  crosshairs.indicatorsCount = function (value) {
    if (!arguments.length) {
      return indicatorsCount;
    }
    indicatorsCount = value;
    return crosshairs;
  };

  return crosshairs;
};
