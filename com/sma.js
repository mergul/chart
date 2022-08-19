var smaSeries = function () {
  var xScale = d3.scaleTime(),
    yScale = d3.scaleLinear(),
    yValue = 0,
    movingAverage = 0,
    css = "";

  var tracker = function (selection) {
    var line = d3.line(),
      path;
    line.x(function (d) {
      return xScale(d.date);
    });

    selection.each(function (data) {
      if (!isNaN(parseFloat(yValue))) {
        line.y(yScale(yValue));
      } else {
        if (movingAverage === 0) {
          line.y(function (d) {
            return yScale(d[yValue]);
          });
        } else {
          line.y(function (d, i) {
            var count = Math.min(movingAverage, i + 1),
              first = i + 1 - count;

            var sum = 0;
            for (var index = first; index <= i; ++index) {
              sum += data[index][yValue];
            }
            var mean = sum / count;

            return yScale(mean);
          });
        }
      }

      path = d3.select(this).selectAll(".tracker").data([data]);

      var pathEnter = path.enter().append("path").merge(path);

      pathEnter.attr("d", line).classed("tracker", true).classed(css, true);

      path.exit().remove();
    });
  };

  tracker.xScale = function (value) {
    if (!arguments.length) {
      return xScale;
    }
    xScale = value;
    return tracker;
  };

  tracker.yScale = function (value) {
    if (!arguments.length) {
      return yScale;
    }
    yScale = value;
    return tracker;
  };

  tracker.yValue = function (value) {
    if (!arguments.length) {
      return yValue;
    }
    yValue = value;
    return tracker;
  };

  tracker.movingAverage = function (value) {
    if (!arguments.length) {
      return movingAverage;
    }
    movingAverage = value;
    return tracker;
  };

  tracker.css = function (value) {
    if (!arguments.length) {
      return css;
    }
    css = value;
    return tracker;
  };

  return tracker;
};
