define([
  "d3",
  "components/sl",
  "MockData",
  "utils/tickWidth",
  "moment",
  "moment-range",
  "components/ohlcBarSeries",
  "components/tracker",
  "components/annotation",
  "components/bollingerSeries",
  "components/crosshairs",
  "components/fibonacci",
], function (d3, sl, MockData, tickWidth, moment) {
  "use strict";

  var mockData = new MockData(0, 0.1, 100, 50, function (moment) {
    return !(moment.day() === 0 || moment.day() === 6);
  });

  var fromDate = new Date(2012, 9, 1),
    toDate = new Date(2013, 1, 1);

  var data = mockData.generateOHLC(fromDate, toDate);

  var margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 50,
    },
    width = 1200 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  var xScale = d3.time.scale(),
    yScale = d3.scale.linear();

  var oldScale;

  var xAxis = d3.svg.axis().scale(xScale).orient("bottom").ticks(5);

  var yAxis = d3.svg.axis().scale(yScale).orient("left");

  var series = sl.series
    .ohlcBar()
    .xScale(xScale)
    .yScale(yScale)
    .tickWidth(tickWidth(xScale, fromDate, toDate));

  var zoom = d3.behavior
    .zoom()
    .x(xScale)
    .scaleExtent([0.5, 50])
    .on("zoom", zoomed)
    .on("zoomend", zoomend);

  function zoomed() {
    var yTransformTranslate = 0,
      yTransformScale,
      xTransformTranslate = d3.event.translate[0],
      xTransformScale = d3.event.scale;

    var xDomain = xScale.domain();
    var range = moment().range(xDomain[0], xDomain[1]);
    var rangeData = [];

    var oldDomain = oldScale.domain();

    var g = d3.selectAll("svg").select("g");
    var seriesDiv = d3.selectAll("#series-container");
    var transform;

    for (var i = 0; i < data.length; i += 1) {
      if (range.contains(data[i].date)) {
        rangeData.push(data[i]);
      }
    }

    yScale.domain([
      d3.min(rangeData, function (d) {
        return d.low;
      }),
      d3.max(rangeData, function (d) {
        return d.high;
      }),
    ]);

    g.select(".x.axis").call(xAxis);

    g.select(".y.axis").call(yAxis);

    yTransformScale =
      (oldDomain[1] - oldDomain[0]) / (yScale.domain()[1] - yScale.domain()[0]);

    if (yScale.domain()[1] !== oldDomain[1]) {
      yTransformTranslate =
        oldScale(oldDomain[1]) - oldScale(yScale.domain()[1]);
      yTransformTranslate *= yTransformScale;
    }

    seriesDiv = document.getElementById("series-container");

    transform =
      "translate3d(" +
      xTransformTranslate +
      "px," +
      yTransformTranslate +
      "px, 0px) scale3d(" +
      xTransformScale +
      "," +
      yTransformScale +
      ", 1)";
    seriesDiv.style.webkitTransform = transform;
    seriesDiv.style.webkitTransformOrigin = "0 0";
    seriesDiv.style.MozTransform = transform;
    seriesDiv.style.MozTransformOrigin = "0 0";
    crosshairs.update();
  }

  function zoomend() {
    var xDomain = xScale.domain();
    var seriesDiv = d3.select("#series-container");
    var nullTransform = "translate3d(0,0,0) scale3d(1,1,1)";

    oldScale = yScale.copy();

    zoom.x(xScale);
    series.tickWidth(tickWidth(xScale, xDomain[0], xDomain[1]));

    seriesDiv.select(".series").call(series);

    seriesDiv = document.getElementById("series-container");
    seriesDiv.style.webkitTransform = nullTransform;
    seriesDiv.style.MozTransform = nullTransform;
  }

  // Create svg element

  var clipDiv = d3
    .select("#chart")
    .classed("chart", true)
    .append("div")
    .attr("id", "series-clip")
    .style("position", "absolute")
    .style("overflow", "hidden")
    .style("top", margin.top + "px")
    .style("left", margin.left + "px");

  var seriesDiv = clipDiv.append("div").attr("id", "series-container");

  var svg = d3
    .select("#chart")
    .append("svg")
    .style("position", "absolute")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  var seriesSvg = seriesDiv
    .append("svg") //.attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height);

  // Create chart
  var g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create plot area
  var plotArea = g.append("g").attr("class", "plotArea");
  plotArea.append("clipPath").attr("id", "plotAreaClip").append("rect").attr({
    width: width,
    height: height,
  });
  plotArea.attr("clip-path", "url(#plotAreaClip)");

  var overlay = d3.svg
    .area()
    .x(function (d) {
      return xScale(d.date);
    })
    .y0(0)
    .y1(height);

  var crosshairs = sl.series
    .crosshairs()
    .target(plotArea)
    .series(data)
    .xScale(xScale)
    .yScale(yScale)
    .yValue("close")
    .formatV(function (data) {
      return d3.format(".1f")(data.close);
    })
    .formatH(function (data) {
      return d3.time.format("%b %e")(data.date);
    });

  plotArea.append("path").attr("class", "overlay").attr("d", overlay(data));

  plotArea
    .append("rect")
    .attr("class", "zoom-pane")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")
    .style("opacity", 0)
    .style("pointer-events", "all")
    .call(zoom);

  // Set scale domains
  xScale.domain(
    d3.extent(data, function (d) {
      return d.date;
    })
  );

  yScale.domain([
    d3.min(data, function (d) {
      return d.low;
    }),
    d3.max(data, function (d) {
      return d.high;
    }),
  ]);

  // Set scale ranges
  xScale.range([0, width]);
  yScale.range([height, 0]);

  zoom.x(xScale);
  oldScale = yScale.copy();

  //set tracker/annotations

  var tracker = sl.series
    .tracker()
    .xScale(xScale)
    .yScale(yScale)
    .yValue("close")
    .movingAverage(5)
    .css("tracker-close-avg");
  // var bollinger = sl.series
  //   .bollinger()
  //   .xScale(xScale)
  //   .yScale(yScale)
  //   .yValue("close")
  //   .movingAverage(20)
  //   .standardDeviations(2);
  //   var annotationValue = 100;
  //   var yMin = d3.min(data, function (d) {
  //     return d.low;
  //   });
  //   var yMax = d3.max(data, function (d) {
  //     return d.high;
  //   });
  //   yMin = yMin < annotationValue ? yMin : annotationValue;
  //   yMax = yMax > annotationValue ? yMax : annotationValue;
  //   yScale.domain([yMin, yMax]).nice();

  //   var annotation = sl.series
  //     .annotation()
  //     .xScale(xScale)
  //     .yScale(yScale)
  //     .yValue(annotationValue);
  // var fibonacci = sl.series
  //   .fibonacciFan()
  //   .target(plotArea)
  //   .series(data)
  //   .xScale(xScale)
  //   .yScale(yScale);
  // Draw axes
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

  g.append("g").attr("class", "y axis").call(yAxis);

  // Draw series.
  seriesSvg.append("g").attr("class", "series").datum(data).call(series);
  // plotArea.call(fibonacci);
  plotArea.call(crosshairs);
  // plotArea.append("path")
  //   .attr("class", "overlay")
  //   .attr("d", overlay(data))
  //   .call(crosshairs);

  // plotArea.append("g").attr("class", "bollinger").datum(data).call(bollinger);

  plotArea.append("g").attr("class", "tracker").datum(data).call(tracker);

  //   plotArea.append("g").attr("class", "annotation").datum(data).call(annotation);
});
