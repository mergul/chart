define(["d3", "components/sl"], function (d3, sl) {
  "use strict";

  sl.series.crosshairs = function () {
    var target = null,
      series = null,
      xScale = d3.time.scale(),
      yScale = d3.scale.linear(),
      yValue = "y",
      formatH = null,
      formatV = null;

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
        .attr("y", yScale.range()[0])
        .attr("style", "text-anchor: end")
        .attr("display", "none");

      calloutV = root
        .append("text")
        .attr("class", "crosshairs callout vertical")
        .attr("y", "1em")
        .attr("x", 30)
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

    function findNearest(xMouse) {
      var nearest = null,
        dx = Number.MAX_VALUE;

      series.forEach(function (data) {
        var xData = data.date,
          xDiff = Math.abs(xMouse.getTime() - xData.getTime());

        if (xDiff < dx) {
          dx = xDiff;
          nearest = data;
        }
      });

      return nearest;
    }
    crosshairs.update = function () {
      var xMouse = xScale.invert(d3.mouse(d3.select(".plotArea").node())[0]),
        nearest = findNearest(xMouse);

      if (nearest !== null && nearest !== highlight) {
        highlight = nearest;

        var x = xScale(highlight.date),
          y = yScale(highlight[yValue]);

        lineH.attr("y1", y).attr("y2", y);
        lineV.attr("x1", x).attr("x2", x);
        circle.attr("cx", x).attr("cy", y);
        calloutH.attr("x", x).text(formatH(highlight));
        calloutV.attr("y", y).text(formatV(highlight));

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

    return crosshairs;
  };
});
