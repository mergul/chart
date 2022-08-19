var macdSeries = function () {
  var xScale = d3.scaleTime(),
    yScale = d3.scaleLinear();
  var graphHeight = 80;
  var tickWidth = 1.5;

  var ohlc = function (selection) {
    var series, rects, mpaths, spaths;

    selection.each(function (data) {
      // const macdAlgorithm = macd()
      //   .fastPeriod(4)
      //   .slowPeriod(10)
      //   .signalPeriod(5)
      //   .value((d) => d.close);
      // // compute the MACD
      // const macdData = macdAlgorithm(data);

      // // merge into a single series
      // const mergedData = data.map((d, i) =>
      //   Object.assign({}, d, {
      //     macd: macdData[i],
      //   })
      // );
      // yScale
      //   .domain(d3.extent(mergedData, (d) => +d.macd.macd))
      //   .range([graphHeight / 6, 0]);

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
        .attr("class", "barys")
        .merge(rects);

      rectsEnter
        .attr("x", function (d) {
          return xScale(d.date) - tickWidth;
        })
        .attr("y", function (d) {
          return yScale(Math.max(0, d.macd?.histogram));
        })
        .attr("width", tickWidth * 2)
        .attr("height", function (d) {
          return d.macd?.histogram
            ? Math.abs(yScale(d.macd?.histogram) - yScale(0))
            : 0;
        })
        .attr("stroke", function (d) {
          d.close > d.open ? "#92d2cc" : "#f7a8a7";
        })
        .attr("fill", function (d) {
          return d.close > d.open ? "#92d2cc" : "#f7a8a7";
        });
      mpaths = seriesEnter.selectAll(".macd_line").data([data]);
      var pathsEnter = mpaths
        .enter()
        .append("path")
        .attr("class", "macd_line")
        .merge(mpaths);
      pathsEnter
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return xScale(d.date);
            })
            .y(function (d) {
              return d.macd?.macd ? yScale(d.macd?.macd) : 0;
            })
        )
        .attr("stroke-width", "1.5")
        .attr("stroke", "#f7a8a7");
      spaths = seriesEnter.selectAll(".signal_line").data([data]);
      var spathsEnter = spaths
        .enter()
        .append("path")
        .attr("class", "signal_line")
        .merge(spaths);
      spathsEnter
        .attr(
          "d",
          d3
            .line()
            .x(function (d) {
              return xScale(d.date);
            })
            .y(function (d) {
              return d.macd?.signal ? yScale(d.macd?.signal) : 0;
            })
        )
        .attr("stroke-width", "1.5")
        .attr("stroke", "#92d2cc");

      spaths.exit().remove();
      mpaths.exit().remove();
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
  ohlc.tickWidth = function (value) {
    if (!arguments.length) {
      return tickWidth;
    }
    tickWidth = value;
    return ohlc;
  };

  return ohlc;
};
