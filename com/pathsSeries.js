var pathsSeries = function () {
  var xScale = d3.scaleTime(),
    yScale = d3.scaleLinear(),
    yValue;

  var maPaths = function (selection) {
    var line = d3.line(),
      paths;
    line.x(function (d) {
      return xScale(d.date);
    });
    selection.each(function (data) {
      paths = d3.select(this).selectAll(".ma-path").data([data]);
      var pathsEnter = paths
        .enter()
        .append("path")
        .attr("class", "ma-path")
        .merge(paths);
      pathsEnter.attr(
        "d",
        line.y(function (d) {
          return yScale(d[yValue]);
        })
      );
      paths.exit().remove();
    });
  };

  maPaths.xScale = function (value) {
    if (!arguments.length) {
      return xScale;
    }
    xScale = value;
    return maPaths;
  };
  maPaths.yScale = function (value) {
    if (!arguments.length) {
      return yScale;
    }
    yScale = value;
    return maPaths;
  };
  maPaths.yValue = function (value) {
    if (!arguments.length) {
      return yValue;
    }
    yValue = value;
    return maPaths;
  };
  return maPaths;
};
