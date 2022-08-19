var zoomChartExample = function (
  zoom,
  data,
  series,
  crosshairs,
  xScale,
  yScale,
  xAxis,
  yAxis
) {
  var initialScale = d3.scaleLinear();

  var zoomChart = function () {
    var margin = { top: 20, right: 20, bottom: 30, left: 50 },
      width = 1200 - margin.left - margin.right,
      height = 650 - margin.top - margin.bottom;

    // Create svg element
    var svg = d3
      .select("#chart")
      .classed("chart", true)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    // Ceate chart
    var g = svg
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create plot area
    var plotArea = g.append("g");

    plotArea
      .append("clipPath")
      .attr("id", "plotAreaClip")
      .append("rect")
      .attr({ width: width, height: height });
    plotArea.attr("clip-path", "url(#plotAreaClip)");

    var overlay = d3
      .area()
      .x(function (d) {
        return xScale(d.date);
      })
      .y0(0)
      .y1(height);
    crosshairs.target(g);

    g.append("path").attr("class", "overlay").attr("d", overlay(data));

    // Create zoom pane
    g.append("rect")
      .attr("class", "zoom-pane")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "none")
      .style("opacity", 0)
      .style("pointer-events", "all")
      .call(zoom);

    // Set scale domains
    xScale.domain(
      d3.extent(data, function (d) {
        return d.date;
      })
    );

    yScale.domain([
      d3.min(data, function (d) {
        return d.low;
      }),
      d3.max(data, function (d) {
        return d.high;
      }),
    ]);

    // Set scale ranges
    xScale.range([0, width]);
    yScale.range([height, 0]);

    // Reset zoom.
    //zoom.x(xScale);

    // series.tickWidth(tickWidth(xScale, fromDate, toDate));

    // Draw axes
    g.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    g.append("g").attr("class", "y axis").call(yAxis);

    // Draw series.
    g.append("g").attr("class", "series").datum(data).call(series);
    g.call(crosshairs);

    initialScale = yScale.copy();
  };

  zoomChart.initialScale = function () {
    return initialScale;
  };

  return zoomChart;
};
