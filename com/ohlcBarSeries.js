var ohlcSeries = function () {
  var xScale = d3.scaleLinear(),
    yScale = d3.scaleLinear();
  var rects, paths, bars;
  var tickWidth = 1.25,
    isCandle = false;

  var isUpDay = function (d) {
      return d.close > d.open;
    },
    isDownDay = function (d) {
      return !isUpDay(d);
    },
    line = d3
      .line()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      });

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
    var series;

    selection.each(function (data) {
      series = d3.select(this).selectAll(".ohlc-series").data([data]);
      var seriesEnter = series
        .enter()
        .append("g")
        .attr("class", "ohlc-series")
        .merge(series);

      bars = seriesEnter.selectAll(".bar").data(data, (d) => [d]);

      var barsEnter = bars.enter().append("g").attr("class", "bar").merge(bars);
      barsEnter.classed("up-day", isUpDay);
      barsEnter.classed("down-day", isDownDay);
      // barsEnter.attr("class", (d) =>
      //   d.close > d.open ? "bar up-day" : "bar down-day"
      // );
      ohlcBar.tickWidth(tickWidth);
      bars.selectAll("rect").remove();
      bars.selectAll("path").remove();
      if (isCandle) {
        //  series.selectAll(".low-line").remove();
        paths = barsEnter.selectAll(".high-low-line").data(function (d) {
          return [d];
        });

        var pathsEnter = paths.enter().append("path").merge(paths);

        pathsEnter
          .classed("high-low-line", true)
          .attr("d", function (d) {
            return line([
              { x: xScale(d.date), y: yScale(d.high) },
              { x: xScale(d.date), y: yScale(d.low) },
            ]);
          })
          .attr("stroke-width", "1.5");
        // rectangles(barsEnter);
        rects = barsEnter.selectAll(".candle").data(function (d) {
          return [d];
        });

        var rectsEnter = rects
          .enter()
          .append("rect")
          .attr("class", "candle")
          .merge(rects);

        rectsEnter
          .attr("x", function (d) {
            return xScale(d.date) - tickWidth;
          })
          .attr("y", function (d) {
            return isUpDay(d) ? yScale(d.close) : yScale(d.open);
          })
          .attr("width", tickWidth * 2)
          .attr("height", function (d) {
            return isUpDay(d)
              ? yScale(d.open) - yScale(d.close)
              : yScale(d.close) - yScale(d.open);
          })
          .attr("fill", function (d) {
            return isUpDay(d) ? "green" : "red";
          });
      } else {
        paths = barsEnter.selectAll(".low-line").data(function (d) {
          return [d];
        });
        var pathsEnter = paths
          .enter()
          .append("path")
          .attr("class", "low-line")
          .merge(paths);
        pathsEnter
          .attr("d", function (d) {
            return ohlcBar(d);
          })
          .attr("stroke-width", "2");
      }

      rects?.exit().remove();
      paths?.exit().remove();
      bars?.exit().remove();
      series?.exit().remove();
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
  ohlc.isCandle = function (value) {
    if (!arguments.length) {
      return isCandle;
    }
    isCandle = value;
    return ohlc;
  };

  return ohlc;
};

/*
var highLowLines = function (barsEnter) {
    paths = barsEnter.selectAll(".high-low-line").data(function (d) {
      return [d];
    });

    var pathsEnter = paths.enter().append("path");

    pathsEnter.classed("high-low-line", true).attr("d", function (d) {
      return line([
        { x: xScale(d.date), y: yScale(d.high) },
        { x: xScale(d.date), y: yScale(d.low) },
      ]);
    });
    paths?.exit().remove();
    bars?.exit().remove();
  };
  var openCloseTicks = function (barsEnter) {
    var open, close;

    open = barsEnter.selectAll(".open-tick").data(function (d) {
      return [d];
    });

    close = barsEnter.selectAll(".close-tick").data(function (d) {
      return [d];
    });

    var openEnter = open.enter().append("path").merge(open);
    var closeEnter = close.enter().append("path").merge(close);

    openEnter.classed("open-tick", true).attr("d", function (d) {
      return line([
        { x: xScale(d.date) - tickWidth, y: yScale(d.open) },
        { x: xScale(d.date), y: yScale(d.open) },
      ]);
    });

    closeEnter.classed("close-tick", true).attr("d", function (d) {
      return line([
        { x: xScale(d.date), y: yScale(d.close) },
        { x: xScale(d.date) + tickWidth, y: yScale(d.close) },
      ]);
    });

    open.exit().remove();
    close.exit().remove();
  };
  var rectangles = function (barsEnter) {
    rects = barsEnter.selectAll(".candle").data(function (d) {
      return [d];
    });

    var rectsEnter = rects.enter().append("rect").attr("class", "candle");

    rectsEnter
      .attr("x", function (d) {
        return xScale(d.date) - tickWidth;
      })
      .attr("y", function (d) {
        return isUpDay(d) ? yScale(d.close) : yScale(d.open);
      })
      .attr("width", tickWidth * 2)
      .attr("height", function (d) {
        return isUpDay(d)
          ? yScale(d.open) - yScale(d.close)
          : yScale(d.close) - yScale(d.open);
      })
      .attr("fill", function (d) {
        return isUpDay(d) ? "green" : "red";
      });
    rects?.exit().remove();
    bars?.exit().remove();
  };
*/
