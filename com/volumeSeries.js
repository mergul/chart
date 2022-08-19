var volumeSeries = function () {
  var xScale = d3.scaleLinear(),
    yScale = d3.scaleLinear();
  var graphHeight = 385;
  var tickWidth = 1.5;
  var yValue = "volume";

  var isUpDay = function (d) {
      return d.close > d.open;
    },
    isDownDay = function (d) {
      return !isUpDay(d);
    };
  var ohlc = function (selection) {
    var series, rects;

    selection.each(function (data) {
      series = d3.select(this).selectAll(".bar_series").data([data]);
      var seriesEnter = series
        .enter()
        .append("g")
        .attr("class", "bar_series")
        .merge(series);

      rects = seriesEnter.selectAll("rect").data(data, (d) => d.date);

      var rectsEnter = rects
        .enter()
        .append("rect")
        .attr("class", "bary")
        .merge(rects);

      rectsEnter
        .attr("x", function (d) {
          return xScale(d.date) - tickWidth;
        })
        .attr("y", function (d) {
          return yScale(d[yValue]);
        })
        .attr("width", tickWidth * 2)
        .attr("height", function (d) {
          return graphHeight / 6 - yScale(d[yValue]);
        })
        .attr("stroke", function (d) {
          d.close > d.open ? "#92d2cc" : "#f7a8a7";
        })
        .attr("fill", function (d) {
          return d.close > d.open ? "#92d2cc" : "#f7a8a7";
        });
      rects.exit().remove();
      series.exit().remove();
    });
  };
  ohlc.xScale = function (value) {
    if (!arguments.length) {
      return xScale;
    }
    xScale = value;
    return ohlc;
  };

  ohlc.yScale = function (value) {
    if (!arguments.length) {
      return yScale;
    }
    yScale = value;
    return ohlc;
  };
  ohlc.yValue = function (value) {
    if (!arguments.length) {
      return yValue;
    }
    yValue = value;
    return ohlc;
  };
  ohlc.tickWidth = function (value) {
    if (!arguments.length) {
      return tickWidth;
    }
    tickWidth = value;
    return ohlc;
  };
  ohlc.graphHeight = function (value) {
    if (!arguments.length) {
      return graphHeight;
    }
    graphHeight = value;
    return ohlc;
  };

  return ohlc;
};
