var cciSeries = function () {
  var xScale = d3.scaleTime();
  var yScale = d3.scaleLinear();
  var graphHeight = 80;
  var cci = function (selection) {
    var line = d3.line(),
      paths;
    line.x(function (d) {
      return xScale(d.date);
    });
    selection.each(function (data) {
      paths = d3.select(this).selectAll(".cci_line").data([data]);
      var pathsEnter = paths
        .enter()
        .append("path")
        .attr("class", "cci_line")
        .merge(paths);
      pathsEnter
        .attr(
          "d",
          line.y(function (d) {
            return yScale(d.cci || 0);
          })
        )
        .attr("stroke-width", "1.5")
        .attr("stroke", "#92d2cc");
      paths.exit().remove();
    });
  };
  cci.xScale = function (value) {
    if (!arguments.length) {
      return xScale;
    }
    xScale = value;
    return cci;
  };
  cci.yScale = function (value) {
    if (!arguments.length) {
      return yScale;
    }
    yScale = value;
    return cci;
  };
  cci.graphHeight = function (value) {
    if (!arguments.length) {
      return graphHeight;
    }
    graphHeight = value;
    return cci;
  };
  return cci;
};
