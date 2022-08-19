const parseDate = d3.timeParse("%Y-%m-%d");
var t,
  zoomChart,
  myData,
  seriesMap = {},
  seriesProps = {},
  series_ohlc,
  series_volume,
  series_bollinger,
  series_trendline,
  series_trendlines,
  series_sma,
  series_ema,
  series_macd,
  series_rsi,
  series_cci,
  series_paths,
  crosshairs,
  isCandle = true,
  myIntervalIn,
  myIntervalOut,
  isLiveIn,
  isLiveOut,
  graphHeight = 385,
  xScale = d3.scaleTime(),
  yScale = d3.scaleLinear(),
  yVolumeScale = d3.scaleLinear(),
  yMacdScale = d3.scaleLinear(),
  yCciScale = d3.scaleLinear(),
  indicatorsCount = 0,
  trendlinesCount = 0,
  trends = [],
  cci,
  macd,
  xScaleZ;

d3.csv("aapl-2.csv")
  .then((d) =>
    d
      .map((d) => ({
        date: parseDate(d["Date"]),
        high: +d["High"],
        low: +d["Low"],
        open: +d["Open"],
        close: +d["Close"],
        volume: +d["Volume"],
      }))
      .slice(-100)
  )
  .then((data) => {
    myData = data;
    setUp(data);
    setDropdown();
  });
function updateAOhlc(g, last) {
  var xScaleR = t ? t.rescaleX(xScale) : xScale;
  g.select("path")
    .attr("d", function (last) {
      var moveToLow = "M" + xScaleR(last.date) + "," + yScale(last.low),
        verticalToHigh = "V" + yScale(last.high),
        openTick =
          "M" +
          xScaleR(last.date) +
          "," +
          yScale(last.open) +
          "h" +
          -2.5 * ((t && t.k) || 1),
        closeTick =
          "M" +
          xScaleR(last.date) +
          "," +
          yScale(last.close) +
          "h" +
          2.5 * ((t && t.k) || 1);

      return moveToLow + verticalToHigh + openTick + closeTick;
    })
    .attr("stroke", last.close > last.open ? "green" : "red")
    .attr("fill", last.close > last.open ? "green" : "red")
    .attr("stroke-width", "2");
}
function updateACandle(g, last) {
  g.classed("up-day", false);
  g.classed("down-day", false);
  var xScaleR = t ? t.rescaleX(xScale) : xScale;
  var line = d3
    .line()
    .x(function (d) {
      return d.x;
    })
    .y(function (d) {
      return d.y;
    });
  g.select("path")
    .attr(
      "d",
      line([
        { x: xScaleR(last.date), y: yScale(last.high) },
        { x: xScaleR(last.date), y: yScale(last.low) },
      ])
    )
    .attr("stroke", last.close > last.open ? "green" : "red")
    .attr("fill", last.close > last.open ? "green" : "red")
    .attr("stroke-width", "1.5");

  g.select("rect")
    .attr("y", last.close > last.open ? yScale(last.close) : yScale(last.open))
    .attr(
      "height",
      last.close > last.open
        ? yScale(last.open) - yScale(last.close)
        : yScale(last.close) - yScale(last.open)
    )
    .attr("fill", last.close > last.open ? "green" : "red");
}
function updateInn(data) {
  if (data.length > 0) {
    const last = data[data.length - 1];
    const random = Math.random();
    if (last.open > last.close) {
      last.high += (Math.sign(random - 0.5) * random) / 5;
      last.close += (Math.sign(random - 0.5) * random) / 5;
    } else {
      last.low += (Math.sign(random - 0.5) * random) / 5;
      last.open += (Math.sign(random - 0.5) * random) / 5;
    }

    let gg = d3.select(
      d3.select(".ohlc_series").selectAll(".bar").nodes()[data.length - 1]
    );
    isCandle ? updateACandle(gg, last) : updateAOhlc(gg, last);
    if (last.high > yScale.domain()[1]) {
      zoomEnd(null, t, undefined);
    }
    let vg = d3.select(
      d3.select(".volume_series").selectAll("rect").nodes()[data.length - 1]
    );
    vg.attr("stroke", function (d) {
      d.close > d.open ? "#92d2cc" : "#f7a8a7";
    }).attr("fill", function (d) {
      return d.close > d.open ? "#92d2cc" : "#f7a8a7";
    });
  }
  myData = data;
  // let mx = d3.select(".crosshairs").select(".vertical")?.attr("x1");
  //setUp(myData);

  // if (t) {
  //   zoomed(null, t);
  //   zoomEnd(null, t, mx);
  // }
  // else if (crosshairs) {
  //   console.log(mx);
  //   crosshairs.update(null, mx);
  // }
}
function updateOut(data) {
  if (data.length > 0) {
    const first = data.shift();
    let firstDate = new Date(data[data.length - 1].date);
    data.push({
      date: new Date(firstDate.setDate(firstDate.getDate() + 1)),
      open: first.open,
      high: first.high,
      low: first.low,
      close: first.close,
      volume:
        first.volume + (Math.sign(Math.random() - 0.5) * first.volume) / 4,
      cci: cci ? cci.nextValue(first.high, first.low, first.close) : cci,
      macd: macd ? macd.nextValue(first.close) : macd,
    });
  }
  myData = data;
  let mx = d3.select(".crosshairs").select(".vertical")?.attr("x1");
  setUp(myData);

  if (t) {
    zoomed(null, t);
    zoomEnd(null, t, mx);
  } else if (crosshairs) {
    crosshairs.update(null, mx);
  }
}

function setUp(data) {
  // xScale = xScaleZ || xScale;
  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisRight(yScale);
  // console.log("xScale ", xScale.domain(), "yScale ", yScale.domain());
  var entries = Object.entries(seriesMap);
  if (entries.length == 0) {
    ohlc_series();
    volume_series();
    // macd_series();
    Object.assign(seriesMap, {
      ohlc_series: series_ohlc,
      volume_series: series_volume,
      // macd_series: series_macd,
    });
    // Object.assign(seriesProps, {
    //   volume_series: { transform: `translate(0, ${(7 * graphHeight) / 8})` },
    //   // macd_series: { transform: `translate(0, ${(5 * graphHeight) / 6})` },
    // });
  } else {
    for (const [key, value] of entries) {
      // dispatchEvent(key)();
      // if (key == "macd_series") eval(key + "_data")(myData);
    }
  }
  crosshairs = crosshairsSeries()
    .series(data)
    .xScale(xScale)
    .yScale(yScale)
    .yValue("close")
    .formatV(function (data) {
      return d3.format(".1f")(data.close);
    })
    .formatH(function (data) {
      return d3.timeFormat("%b %e")(data.date);
    })
    .indicatorsCount(indicatorsCount);

  var zoom = d3
    .zoom()
    .scaleExtent([1, 16])
    .on("zoom", zoomed)
    .on("zoom.end", zoomEnd);

  zoomChart = zoomChartExample(
    zoom,
    myData,
    crosshairs,
    xScale,
    yScale,
    yVolumeScale,
    yMacdScale,
    yCciScale,
    xAxis,
    yAxis,
    seriesMap,
    seriesProps,
    indicatorsCount
  );
  zoomChart();
}
function zoomed(event, tx) {
  t = event !== null ? event.transform : tx;
  xScaleZ = t.rescaleX(xScale);
  var g = d3.selectAll("svg").select("g");
  g.select(".x-axis").call(d3.axisBottom(xScaleZ).tickSize(-385));
  crosshairs.xScale(xScaleZ);

  for (const [key, value] of Object.entries(seriesMap)) {
    if (
      key === "ohlc_series" ||
      key === "volume_series" ||
      key === "macd_series"
    )
      isCandle || key === "volume_series" || key === "macd_series"
        ? value.tickWidth(1.25 * t.k)
        : value.tickWidth(2.5 * t.k);
    if (Array.isArray(value)) {
      var gs = g.selectAll(`.${key}`).nodes();
      value.forEach((d, i) => {
        d.xScale(xScaleZ);
        d3.select(gs[i]).call(d);
      });
    } else {
      value.xScale(xScaleZ);
      g.select(`.${key}`).call(value);
    }
  }
}
function zoomEnd(event, tx, mx) {
  t = event !== null ? event.transform : tx;
  xScaleZ = t ? t.rescaleX(xScale) : xScale;
  var filtered = myData.filter(
      (d) => d.date >= xScaleZ.domain()[0] && d.date <= xScaleZ.domain()[1]
    ),
    minP = +d3.min(filtered, (d) => d.low),
    maxP = +d3.max(filtered, (d) => d.high),
    buffer = Math.floor((maxP - minP) * 0.1);

  yScale.domain([minP - buffer, maxP + buffer]);

  crosshairs.yScale(yScale);
  var g = d3.selectAll("svg").select("g");
  g.select(".y-axis").call(d3.axisLeft(yScale).tickSize(-835));
  for (const [key, value] of Object.entries(seriesMap)) {
    if (
      key !== "volume_series" &&
      key !== "macd_series" &&
      key !== "cci_series"
    ) {
      if (Array.isArray(value)) {
        var gs = g.selectAll(`.${key}`).nodes();
        value.forEach((d, i) => {
          d.yScale(yScale);
          d3.select(gs[i]).call(d);
        });
      } else {
        value.yScale(yScale);
        g.select(`.${key}`).call(value);
      }
    }
  }
  mx = mx ? mx : d3.select(".crosshairs").select(".vertical")?.attr("x1");
  crosshairs.update(null, mx);
}
function setDropdown() {
  d3.select("body")
    .selectAll("button")
    .on("click", function (event) {
      event.preventDefault();
      var opt = d3.select(this).attr("value");
      switch (opt) {
        case "candle":
          isCandle = true;
          if (!seriesMap.ohlc_series) {
            delete seriesMap.paths_series;
            d3.selectAll(".paths_series").remove();
            ohlc_series();
            Object.assign(seriesMap, {
              ohlc_series: series_ohlc,
            });
            d3.select(".chartBody")
              .insert("g", ".volume_series")
              .datum(myData)
              .attr("class", "ohlc_series")
              .call(series_ohlc);
          }
          series_ohlc.isCandle(isCandle).tickWidth(1.25 * ((t && t.k) || 1));
          d3.select(".ohlc_series").datum(myData).call(series_ohlc);
          break;
        case "bar":
          isCandle = false;
          if (!seriesMap.ohlc_series) {
            delete seriesMap.paths_series;
            d3.selectAll(".paths_series").remove();
            ohlc_series();
            Object.assign(seriesMap, {
              ohlc_series: series_ohlc,
            });
            d3.select(".chartBody")
              .insert("g", ".volume_series")
              .datum(myData)
              .attr("class", "ohlc_series")
              .call(series_ohlc);
          }
          series_ohlc.isCandle(isCandle).tickWidth(2.5 * ((t && t.k) || 1));
          d3.select(".ohlc_series").datum(myData).call(series_ohlc);
          break;
        case "lines":
          d3.selectAll(".ohlc_series").remove();
          delete seriesMap.ohlc_series;
          paths_series();
          break;
        case "alive":
          if (!isLiveIn) myIntervalIn = setLiveIn(isLiveIn);
          isLiveIn = true;
          if (!isLiveOut) myIntervalOut = setLiveOut(isLiveOut);
          isLiveOut = true;
          break;
        case "dead":
          if (isLiveIn) clearInterval(myIntervalIn);
          isLiveIn = false;
          if (isLiveOut) clearInterval(myIntervalOut);
          isLiveOut = false;
          break;
        case "liveIn":
          if (!isLiveIn) myIntervalIn = setLiveIn(isLiveIn);
          isLiveIn = true;
          break;
        case "liveOut":
          if (!isLiveOut) myIntervalOut = setLiveOut(isLiveOut);
          isLiveOut = true;
          break;
        case "clearInn":
          if (isLiveIn) clearInterval(myIntervalIn);
          isLiveIn = false;
          break;
        case "clearOut":
          if (isLiveOut) clearInterval(myIntervalOut);
          isLiveOut = false;
          break;
        case "updateInn":
          updateInn(myData);
          break;
        case "updateOut":
          updateOut(myData);
          break;
        case "addBollinger":
          bollinger_series();
          break;
        case "clearBollinger":
          delete seriesMap.bollinger_series;
          d3.selectAll(".bollinger_series").remove();
          break;
        case "addTrendline":
          trendlinesCount++;
          trendline_series();
          break;
        case "clearTrendline":
          trendlinesCount--;
          delete seriesMap.trendline_series;
          d3.selectAll(".trendline_series").remove();
          break;
        case "addTrendlines":
          trendlinesCount++;
          // trendlines_series();
          series_data(
            "trendlines_series",
            myData,
            new TrendlinesIndicator(),
            (args = { 0: "open", 1: "close" })
          );
          break;
        case "clearTrendlines":
          trendlinesCount--;
          delete seriesMap.trendlines_series;
          d3.selectAll(".trendlines_series").remove();
          break;
        case "addAverages":
          sma_series();
          break;
        case "clearAverages":
          delete seriesMap.sma_series;
          d3.selectAll(".sma_series").remove();
          break;
        case "addMacd":
          macd_series();
          macd_series_data(myData);
          setUp(myData);
          break;
        case "clearMacd":
          indicatorsCount--;
          delete seriesMap.macd_series;
          delete seriesProps.macd_series;
          myData.forEach((d) => {
            delete d.macd;
          });
          d3.selectAll(".macd_series").remove();
          d3.selectAll(".yMacd-axis").remove();
          series_volume.graphHeight(graphHeight);
          setUp(myData);
          break;
        case "addCci":
          cci_series();
          cci_series_data(myData);
          setUp(myData);
          break;
        case "clearCci":
          indicatorsCount--;
          delete seriesMap.cci_series;
          delete seriesProps.cci_series;
          myData.forEach((d) => {
            delete d.cci;
          });
          d3.selectAll(".cci_series").remove();
          d3.selectAll(".yCci-axis").remove();
          series_volume.graphHeight(graphHeight);
          setUp(myData);
          break;
        default:
          console.log("default");
          break;
      }
    });
}
function setLiveIn() {
  let timeIn = setInterval(() => {
    updateInn(myData);
  }, 1000);
  return timeIn;
}
function setLiveOut() {
  let timeOut = setInterval(() => {
    updateOut(myData);
  }, 3000);
  return timeOut;
}
var ohlc_series = function () {
  series_ohlc = ohlcSeries().xScale(xScale).yScale(yScale).isCandle(isCandle);
  isCandle ? series_ohlc.tickWidth(1.25) : series_ohlc.tickWidth(2.5);
  return series_ohlc;
};
var volume_series = function () {
  series_volume = volumeSeries()
    .xScale(xScale)
    .yScale(yVolumeScale)
    .yValue("volume")
    .graphHeight(graphHeight)
    .tickWidth(1.25);
  return series_volume;
};
var bollinger_series = function () {
  series_bollinger = bollingerSeries()
    .xScale(xScale)
    .yScale(yScale)
    .yValue("close")
    .movingAverage(20)
    .standardDeviations(2);

  Object.assign(seriesMap, { bollinger_series: series_bollinger });
  d3.select(".chartBody")
    .append("g")
    .attr("class", "bollinger_series")
    .datum(myData)
    .call(series_bollinger);
  // setUp(myData);
};
var trendline_series = async function () {
  let list = await awaitClicks();
  series_trendline = trendlineSeries()
    .xScale(xScaleZ || xScale)
    .yScale(yScale)
    .yValue("close")
    .start(list[0])
    .end(list[1]);
  trends.push(series_trendline);
  Object.assign(seriesMap, { trendline_series: trends });
  d3.select(".chartBody")
    .append("g")
    .attr("class", "trendline_series")
    .datum(myData)
    .call(series_trendline);
  // setUp(myData);
};
var trendlines_series = async function () {
  let list = await awaitClicks();
  series_trendlines = trendlinesSeries()
    .xScale(xScaleZ || xScale)
    .yScale(yScale)
    .start(list[0])
    .end(list[1]);
  trendings.push(series_trendlines);
  Object.assign(seriesMap, { trendlines_series: trendings });
  d3.select(".chartBody")
    .append("g")
    .attr("class", "trendlines_series")
    .datum(myData)
    .call(series_trendlines);
};
var macd_series = function () {
  indicatorsCount++;
  series_macd = macdSeries().xScale(xScale).yScale(yMacdScale).tickWidth(1.25);

  Object.assign(seriesMap, { macd_series: series_macd });
  // Object.assign(seriesProps, {
  //   macd_series: { transform: `translate(0, ${graphHeight})` },
  // });
  d3.select(".view").insert("g", ".overlay").attr("class", "macd_series");
  d3.select(".view").append("g").attr("class", "axis yMacd-axis");
};
var rsi_series = function () {
  series_rsi = rsiSeries()
    .xScale(xScale)
    .yScale(yRsiScale)
    .yValue("volume")
    .tickWidth(1.25);

  Object.assign(seriesMap, { rsi_series: series_rsi });
  d3.select(".chartBody").append("g").attr("class", "rsi_series");
};
var cci_series = function () {
  indicatorsCount++;
  // cci_series_data(myData);
  series_cci = cciSeries().xScale(xScale).yScale(yCciScale);

  Object.assign(seriesMap, { cci_series: series_cci });
  d3.select(".view").insert("g", ".overlay").attr("class", "cci_series");
  d3.select(".view").append("g").attr("class", "axis yCci-axis");
};
var sma_series = function () {
  series_sma = smaSeries()
    .xScale(xScale)
    .yScale(yScale)
    .yValue("close")
    .movingAverage(5)
    .css("tracker-close-avg");

  Object.assign(seriesMap, { sma_series: series_sma });
  d3.select(".chartBody")
    .append("g")
    .attr("class", "sma_series")
    .datum(myData)
    .call(series_sma);
  // setUp(myData);
};
var paths_series = function () {
  series_paths = pathsSeries().xScale(xScale).yScale(yScale).yValue("close");

  Object.assign(seriesMap, { paths_series: series_paths });
  d3.select(".chartBody")
    .insert("g", ".volume_series")
    .datum(myData)
    .attr("class", "paths_series")
    .call(series_paths);
};

function waitListener(element, listenerName) {
  return new Promise(function (resolve, reject) {
    var listener = (event) => {
      element.removeEventListener(listenerName, listener);
      resolve(event);
    };
    element.addEventListener(listenerName, listener);
  });
}
async function awaitClicks() {
  var element = d3.select(".view").node(),
    start,
    end;

  await waitListener(element, "click");
  start = crosshairs.highlight();
  // console.log("start ", start);
  await waitListener(element, "click");
  end = crosshairs.highlight();
  // console.log("end ", end);
  return [start, end];
}
function macd_series_data(data) {
  // const macdAlgorithm = macd()
  //   .fastPeriod(4)
  //   .slowPeriod(10)
  //   .signalPeriod(5)
  //   .value((d) => d.close);
  // // compute the MACD
  // const macdData = macdAlgorithm(data);
  macd = new MACD();
  // merge into a single series
  const mergedData = data.map((d, i) => {
    const macdValue = macd.nextValue(d.close);
    return Object.assign({}, d, {
      macd: macdValue,
    });
  });
  myData = mergedData;
  series_volume.graphHeight(graphHeight - indicatorsCount * 80);
}
function cci_series_data(data) {
  cci = new CCI(20);
  const mergedData = data.map((d, i) => {
    const cciValue = cci.nextValue(d.high, d.low, d.close);
    return Object.assign({}, d, {
      cci: cciValue,
    });
  });
  myData = mergedData;
  series_volume.graphHeight(graphHeight - indicatorsCount * 80);
}
function series_data(name, data, osc, ...args) {
  const mergedData = data.map((d, i) => {
    const value = osc.nextValue(d.open, d.close, d.high, d.low);
    return Object.assign({}, d, {
      trend: value,
    });
  });
  myData = mergedData;
  // series_volume.graphHeight(graphHeight - indicatorsCount * 80);
}
/**
 * // Handler for dropdown value change
  // var dropdownChange = function () {
  //   var opt = d3.select(this).property("value");

  //   // setUp(myData);
  //   // d3.select(".label").attr("display", "none");
  // };
  // var options = ["ali", "veli", "heri", "veri"];
  // var dropdown = d3
  //   .select("body")
  //   .insert("select", "#container")
  //   .attr("x", 100)
  //   .attr("y", 10)
  //   .attr("class", "dropdown")
  //   .on("change", dropdownChange);
  // dropdown
  //   .selectAll("option")
  //   .data(options)
  //   .enter()
  //   .append("option")
  //   .attr("value", function (d) {
  //     return d;
  //   })
  //   .text(function (d) {
  //     return d[0].toUpperCase() + d.slice(1, d.length); // capitalize 1st letter
  //   });
 */
