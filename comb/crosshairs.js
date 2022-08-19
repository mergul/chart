const ccrosshairs = function () {
  var target = null,
    series = null,
    xScale = d3.scaleTime(),
    yScale = d3.scaleLinear(),
    yValue = "y",
    formatH = null,
    formatV = null;
  xDateScale = d3.scaleQuantize();

  var lineH = null,
    lineV = null,
    circle = null,
    calloutH = null,
    calloutV = null;

  var highlight = null;

  var crosshairs = function (selection) {
    var root = target.append("g").attr("class", "crosshairs");

    lineH = root
      .append("line")
      .attr("class", "crosshairs horizontal")
      .attr("x1", xScale.range()[0])
      .attr("x2", xScale.range()[1])
      .attr("display", "none");

    lineV = root
      .append("line")
      .attr("class", "crosshairs vertical")
      .attr("y1", yScale.range()[0])
      .attr("y2", yScale.range()[1])
      .attr("display", "none");

    circle = root
      .append("circle")
      .attr("class", "crosshairs circle")
      .attr("r", 6)
      .attr("display", "none");

    calloutH = root
      .append("text")
      .attr("class", "crosshairs callout horizontal")
      .attr("x", xScale.range()[1])
      .attr("style", "text-anchor: end")
      .attr("display", "none");

    calloutV = root
      .append("text")
      .attr("class", "crosshairs callout vertical")
      .attr("y", "1em")
      .attr("style", "text-anchor: end")
      .attr("display", "none");
  };

  function mouseout() {
    highlight = null;

    lineH.attr("display", "none");
    lineV.attr("display", "none");
    circle.attr("display", "none");
    calloutH.attr("display", "none");
    calloutV.attr("display", "none");
  }

  function findNearest(xMouse, data) {
    if (data.length > 1) {
      data = data.find((d) => d.Date === xDateScale(xMouse));
    }
    return data;
  }
  crosshairs.update = function (event, data) {
    var xMouse = xScale.invert(d3.pointer(event)[0]),
      nearest = findNearest(xMouse, data);

    if (nearest !== null && nearest !== highlight) {
      highlight = nearest;

      var x = xScale(highlight.Date),
        y = yScale(highlight[yValue]);

      lineH.attr("y1", y).attr("y2", y);
      lineV.attr("x1", x).attr("x2", x);
      circle.attr("cx", x).attr("cy", y);
      calloutH.attr("y", y).text(formatH(highlight));
      calloutV.attr("x", x).text(formatV(highlight));

      lineH.attr("display", "inherit");
      lineV.attr("display", "inherit");
      circle.attr("display", "inherit");
      calloutH.attr("display", "inherit");
      calloutV.attr("display", "inherit");
    }
  };

  crosshairs.target = function (value) {
    if (!arguments.length) {
      return target;
    }

    if (target) {
      target.on("mousemove.crosshairs", null);
      target.on("mouseout.crosshairs", null);
    }

    target = value;

    target.on("mousemove.crosshairs", this.update);
    target.on("mouseout.crosshairs", mouseout);

    return crosshairs;
  };

  crosshairs.series = function (value) {
    if (!arguments.length) {
      return series;
    }

    series = value;
    return crosshairs;
  };

  crosshairs.xScale = function (value) {
    if (!arguments.length) {
      return xScale;
    }

    xScale = value;
    return crosshairs;
  };

  crosshairs.yScale = function (value) {
    if (!arguments.length) {
      return yScale;
    }

    yScale = value;
    return crosshairs;
  };

  crosshairs.yValue = function (value) {
    if (!arguments.length) {
      return yValue;
    }

    yValue = value;
    return crosshairs;
  };

  crosshairs.formatH = function (value) {
    if (!arguments.length) {
      return formatH;
    }

    formatH = value;
    return crosshairs;
  };

  crosshairs.formatV = function (value) {
    if (!arguments.length) {
      return formatV;
    }

    formatV = value;
    return crosshairs;
  };
  crosshairs.xDateScale = function (value) {
    if (!arguments.length) {
      return xDateScale;
    }

    xDateScale = value;
    return crosshairs;
  };

  return crosshairs;
};
