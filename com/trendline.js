var trendlineSeries = function () {
  var xScale = d3.scaleTime(),
    yScale = d3.scaleLinear(),
    yValue = 0,
    start,
    end;
  function linearRegression(data) {
    var lr = {};
    var n = data.length;
    var sum_x = 0,
      sum_y = 0,
      sum_xy = 0,
      sum_xx = 0,
      sum_yy = 0;

    data.forEach(function (d) {
      sum_x += d.date.getTime();
      sum_y += d[yValue];

      sum_xx += d.date.getTime() * d.date.getTime();
      sum_yy += d[yValue] * d[yValue];

      sum_xy += d.date.getTime() * d[yValue];
    });

    lr["slope"] = (n * sum_xy - sum_x * sum_y) / (n * sum_xx - sum_x * sum_x);
    lr["intercept"] = (sum_y - lr.slope * sum_x) / n;
    lr["r2"] = Math.pow(
      (n * sum_xy - sum_x * sum_y) /
        Math.sqrt((n * sum_xx - sum_x * sum_x) * (n * sum_yy - sum_y * sum_y)),
      2
    );

    return lr;
  }
  var trendline = function (selection) {
    var line, midata;
    selection.each(function (data) {
      midata = data.filter(
        (d) =>
          d.date.getTime() >= start?.date.getTime() &&
          d.date.getTime() <= end?.date.getTime()
      );
      line = d3.select(this).selectAll(".trendline").data([midata]);
      var lineEnter = line
        .enter()
        .append("path")
        .attr("class", "trendline")
        .merge(line);

      lr = linearRegression(midata);

      var regression_line = d3
        .line()
        .x(function (d) {
          return xScale(d.date);
        })
        .y(function (d) {
          var tmp = lr.intercept + lr.slope * d.date;
          return yScale(tmp);
        });

      lineEnter.attr("d", regression_line);
      line.exit().remove();
    });
  };
  trendline.xScale = function (value) {
    if (!arguments.length) {
      return xScale;
    }
    xScale = value;
    return trendline;
  };
  trendline.yScale = function (value) {
    if (!arguments.length) {
      return yScale;
    }
    yScale = value;
    return trendline;
  };
  trendline.yValue = function (value) {
    if (!arguments.length) {
      return yValue;
    }
    yValue = value;
    return trendline;
  };
  trendline.start = function (value) {
    if (!arguments.length) {
      return start;
    }
    start = value;
    return trendline;
  };
  trendline.end = function (value) {
    if (!arguments.length) {
      return end;
    }
    end = value;
    return trendline;
  };

  return trendline;
};
