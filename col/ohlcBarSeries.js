var ohlcSeries = function () {
  var xScale = d3.scaleTime(),
    yScale = d3.scaleLinear();

  var tickWidth = 5;

  var isUpDay = function (d) {
    return d.close > d.open;
  };
  var isDownDay = function (d) {
    return !isUpDay(d);
  };

  var ohlcBar = ohlcBarSvg()
    .open(function (d) {
      return yScale(d.open);
    })
    .high(function (d) {
      return yScale(d.high);
    })
    .low(function (d) {
      return yScale(d.low);
    })
    .close(function (d) {
      return yScale(d.close);
    })
    .date(function (d) {
      return xScale(d.date);
    });
  var ohlc = function (selection) {
    var series, bars;

    selection.each(function (data) {
      series = d3.select(this).selectAll(".ohlc-series").data([data]);
      var seriesEnter = series
        .enter()
        .append("g")
        .attr("class", "ohlc-series")
        .merge(series);

      bars = seriesEnter.selectAll(".bar").data(data, (d) => d.date);

      var barsEnter = bars
        .enter()
        .append("path")
        .attr("class", "bar")
        .merge(bars);

      barsEnter.classed("up-day", isUpDay);
      barsEnter.classed("down-day", isDownDay);
      ohlcBar.tickWidth(tickWidth);

      barsEnter.attr("d", function (d) {
        return ohlcBar(d);
      });

      barsEnter.exit().remove();
      seriesEnter.exit().remove();
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

  ohlc.tickWidth = function (value) {
    if (!arguments.length) {
      return tickWidth;
    }
    tickWidth = value;
    return ohlc;
  };

  return ohlc;
};
