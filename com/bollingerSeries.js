var bollingerSeries = function () {
  var xScale = d3.scaleTime(),
    yScale = d3.scaleLinear();

  var yValue = 0,
    movingAverage = 20,
    standardDeviations = 2;

  var cssBandArea = "bollingerBandArea",
    cssBandUpper = "bollingerBandUpper",
    cssBandLower = "bollingerBandLower",
    cssAverage = "bollingerAverage";

  var bollinger = function (selection) {
    var areaBands = d3.area(),
      lineUpper = d3.line(),
      lineLower = d3.line(),
      lineAverage = d3.line();

    areaBands.x(function (d) {
      return xScale(d.date);
    });
    lineUpper.x(function (d) {
      return xScale(d.date);
    });
    lineLower.x(function (d) {
      return xScale(d.date);
    });
    lineAverage.x(function (d) {
      return xScale(d.date);
    });

    var calculateMovingAverage = function (data, i) {
      if (movingAverage === 0) {
        return data[i][yValue];
      }

      var count = Math.min(movingAverage, i + 1),
        first = i + 1 - count;

      var sum = 0;
      for (var index = first; index <= i; ++index) {
        var x = data[index][yValue];
        sum += x;
      }

      return sum / count;
    };

    var calculateMovingStandardDeviation = function (data, i, avg) {
      if (movingAverage === 0) {
        return 0;
      }

      var count = Math.min(movingAverage, i + 1),
        first = i + 1 - count;

      var sum = 0;
      for (var index = first; index <= i; ++index) {
        var x = data[index][yValue];
        var dx = x - avg;
        sum += dx * dx;
      }

      var variance = sum / count;
      return Math.sqrt(variance);
    };

    selection.each(function (data) {
      var bollingerData = {};
      for (var index = 0; index < data.length; ++index) {
        var date = data[index].date;

        var avg = calculateMovingAverage(data, index);
        var sd = calculateMovingStandardDeviation(data, index, avg);

        bollingerData[date] = { avg: avg, sd: sd };
      }

      areaBands.y0(function (d) {
        var avg = bollingerData[d.date].avg;
        var sd = bollingerData[d.date].sd;

        return yScale(avg + sd * standardDeviations);
      });

      areaBands.y1(function (d) {
        var avg = bollingerData[d.date].avg;
        var sd = bollingerData[d.date].sd;

        return yScale(avg - sd * standardDeviations);
      });

      lineUpper.y(function (d) {
        var avg = bollingerData[d.date].avg;
        var sd = bollingerData[d.date].sd;

        return yScale(avg + sd * standardDeviations);
      });

      lineLower.y(function (d) {
        var avg = bollingerData[d.date].avg;
        var sd = bollingerData[d.date].sd;

        return yScale(avg - sd * standardDeviations);
      });

      lineAverage.y(function (d) {
        var avg = bollingerData[d.date].avg;

        return yScale(avg);
      });
      // movingAverage
      var prunedData = [];
      for (var index = 0; index < data.length; ++index) {
        prunedData.push(data[index]);
      }

      var pathArea = d3.select(this).selectAll(".area").data([prunedData]);
      var pathUpper = d3.select(this).selectAll(".upper").data([prunedData]);
      var pathLower = d3.select(this).selectAll(".lower").data([prunedData]);
      var pathAverage = d3
        .select(this)
        .selectAll(".average")
        .data([prunedData]);

      var pathAreaEnter = pathArea.enter().append("path");
      var pathUpperEnter = pathUpper.enter().append("path");
      var pathLowerEnter = pathLower.enter().append("path");
      var pathAverageEnter = pathAverage.enter().append("path");

      pathAreaEnter
        .merge(pathArea)
        .attr("d", areaBands)
        .classed("area", true)
        .classed(cssBandArea, true);
      pathUpperEnter
        .merge(pathUpper)
        .attr("d", lineUpper)
        .classed("upper", true)
        .classed(cssBandUpper, true);
      pathLowerEnter
        .merge(pathLower)
        .attr("d", lineLower)
        .classed("lower", true)
        .classed(cssBandLower, true);
      pathAverageEnter
        .merge(pathAverage)
        .attr("d", lineAverage)
        .classed("average", true)
        .classed(cssAverage, true);

      pathArea.exit().remove();
      pathUpper.exit().remove();
      pathLower.exit().remove();
      pathAverage.exit().remove();
    });
  };
  function calculateBollingerBands(data, numberOfPricePoints) {
    let sumSquaredDifference = 0;
    return data.map((row, index, total) => {
      const start = Math.max(0, index - numberOfPricePoints);
      const end = index;
      const subset = total.slice(start, end + 1);
      const sum = subset.reduce((a, b) => {
        return a + b["close"];
      }, 0);

      const sumSquaredDifference = subset.reduce((a, b) => {
        const average = sum / subset.length;
        const dfferenceFromMean = b["close"] - average;
        const squaredDifferenceFromMean = Math.pow(dfferenceFromMean, 2);
        return a + squaredDifferenceFromMean;
      }, 0);
      const variance = sumSquaredDifference / subset.length;

      return {
        date: row["date"],
        average: sum / subset.length,
        standardDeviation: Math.sqrt(variance),
        upperBand: sum / subset.length + Math.sqrt(variance) * 2,
        lowerBand: sum / subset.length - Math.sqrt(variance) * 2,
      };
    });
  }
  bollinger.xScale = function (value) {
    if (!arguments.length) {
      return xScale;
    }
    xScale = value;
    return bollinger;
  };

  bollinger.yScale = function (value) {
    if (!arguments.length) {
      return yScale;
    }
    yScale = value;
    return bollinger;
  };

  bollinger.yValue = function (value) {
    if (!arguments.length) {
      return yValue;
    }
    yValue = value;
    return bollinger;
  };

  bollinger.movingAverage = function (value) {
    if (!arguments.length) {
      return movingAverage;
    }
    movingAverage = value;
    return bollinger;
  };

  bollinger.standardDeviations = function (value) {
    if (!arguments.length) {
      return standardDeviations;
    }
    standardDeviations = value;
    return bollinger;
  };

  return bollinger;
};
