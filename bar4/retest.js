function ZoomableBarChart() {
  let width = 960,
    height = 500,
    margin = { top: 20, right: 20, bottom: 40, left: 40 },
    graphWidth = width - margin.left - margin.right,
    graphHeight = height - margin.top - margin.bottom,
    yValue = function (d) {
      return d[1];
    },
    t,
    xScale = d3.scaleTime().range([margin.left, graphWidth - margin.right]),
    yScale = d3.scaleLinear().range([graphHeight - margin.bottom, margin.top]);

  const xAxis = (g) =>
    g
      .attr("transform", `translate(0,${graphHeight - margin.bottom})`) // This controls the vertical position of the Axis
      .call(d3.axisBottom(xScale).tickSizeOuter(0))
      .call((g) => g.select(".domain").remove()); //Creates bottom horizontal axis with an  outer tick size equal to 0

  const yAxis = (g) =>
    g
      .attr("transform", `translate(${margin.left},0)`) // This controls the horizontal position of the Axis
      .call(d3.axisLeft(yScale)) //Creates left vertical axis
      .call((g) => g.select(".domain").remove()); //This removes the domain from the DOM API.

  function chart(selection) {
    selection.each(function (data) {
      xScale
        .range([margin.left, graphWidth - margin.right])
        .domain(d3.extent(data, (d) => d.date));

      yScale
        .range([graphHeight - margin.bottom, margin.top])
        .domain([0, d3.max(data, (d) => d.value)]);

      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var svgEnter = svg
        .enter()
        .append("svg")
        .attr("viewBox", [0, 0, width, height]);

      var gView = svgEnter
        .append("g")
        .attr("class", "view")
        .attr("transform", `translate(${margin.left}, ${margin.top})`);

      gView
        .append("g")
        .attr("clip-path", "url(#clipx)")
        .append("g")
        .attr("class", "x-axis")
        .merge(svg.select(".x-axis"))
        .call(xAxis);
      gView
        .append("g")
        .attr("clip-path", "url(#clipy)")
        .append("g")
        .attr("class", "y-axis")
        .merge(svg.select(".y-axis"))
        .call(yAxis);

      const gBars = gView
        .append("g")
        .attr("clip-path", "url(#clip)")
        .attr("fill", "steelblue")
        .append("g")
        .attr("class", "bars")
        .merge(svg.select("g.bars"));

      const bars = gBars.selectAll(".bar").data(data);
      bars
        .enter()
        .append("rect")
        .attr("class", "bar")
        .merge(bars)
        .attr("x", (d) => xScale(d.date))
        .attr("y", (d) => yScale(d.value))
        .attr("height", (d) => graphHeight - yScale(d.value))
        .attr("width", (graphWidth - margin.left) / data.length - 1);

      const defs = gView.append("defs");

      defs
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", graphWidth - margin.left)
        .attr("height", graphHeight - margin.top - margin.bottom)
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("fill", "none")
        .style("opacity", 0);
      defs
        .append("clipPath")
        .attr("id", "clipx")
        .append("rect")
        .attr("width", graphWidth - margin.left)
        .attr("height", margin.bottom)
        .attr("x", margin.left)
        .attr("y", graphHeight - margin.bottom);
      defs
        .append("clipPath")
        .attr("id", "clipy")
        .append("rect")
        .attr("width", margin.left)
        .attr("height", graphHeight - margin.top)
        .attr("x", 0)
        .attr("y", 0);
      let tooltip = d3.select("#tooltip");

      let showTooltip = function (e, d) {
        let ex = xScale.invert(e.x);
        let ey = yScale.invert(e.y);
        let i = d3.bisectRight(data, ex);
        console.log("ex ", ex, " ey ", ey, " i ", i);
      };
      let moveTooltip = function () {
        tooltip
          .style("left", d3.mouse(this)[0] + 30 + "px")
          .style("top", d3.mouse(this)[1] + 30 + "px");
      };
      let hideTooltip = function (e) {
        console.log("hide");
      };
      rectZoom = gView
        .append("rect")
        .attr("class", "zoom")
        .style("fill", "none")
        .style("pointer-events", "all")
        .style("opacity", 0)
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("width", graphWidth - margin.left - margin.right)
        .attr("height", graphHeight - margin.top - margin.bottom)
        .on("mouseleave", hideTooltip)
        .on("mousemove", showTooltip);
      bars.exit().remove();
      gView.select(".y-axis").selectAll(".tick text").style("font-size", "8px");
      gView.select(".x-axis").selectAll(".tick text").style("font-size", "8px");

      rectZoom.call(zoom);

      if (t) {
        updateToZoom();
      }
      // console.log("xScale domain", ...xScale.domain());
      // console.log("yScale domain", ...yScale.domain());
      // console.log("xScale range", ...xScale.range());
      // console.log("yScale range", ...yScale.range());
      // console.log("graphWidth", graphWidth);
      // console.log("graphHeight", graphHeight);
    });
  }
  const zoom = (rectZoom) => {
    const extent = [
      [margin.left, margin.top],
      [graphWidth - margin.right, graphHeight - margin.bottom],
    ];

    rectZoom.call(
      d3
        .zoom()
        .scaleExtent([1, Infinity])
        .translateExtent(extent)
        .extent(extent)
        .on("zoom", zoomed)
    );
    function zoomed(event) {
      t = event.transform;
      updateToZoom();
    }
  };
  function updateToZoom() {
    let xScaleZ = t.rescaleX(xScale);
    let yScaleZ = t.rescaleY(yScale);
    let newXAxis = d3.axisBottom().scale(xScaleZ);
    let newYAxis = d3.axisLeft().scale(yScaleZ);
    d3.select(".x-axis").call(newXAxis);
    d3.select(".y-axis").call(newYAxis);

    d3.select(".view g.bars")
      .selectAll("rect")
      .attr("x", (d) => xScaleZ(d.date))
      .attr("width", 5)
      .attr("y", (d) => yScaleZ(d.value))
      .attr("height", (d) => yScaleZ(0) - yScaleZ(d.value));
  }
  function resetted() {
    d3.select("svg")
      .transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);
  }
  // The x-accessor for the path generator; xScale ∘ xValue.
  function X(d) {
    return xScale(xValue(d));
  }

  // The y-accessor for the path generator; yScale ∘ yValue.
  function Y(d) {
    return yScale(yValue(d));
  }
  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };

  chart.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.x = function (_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function (_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };
  return chart;
}
// gView
//   .append("rect")
//   .attr("width", graphWidth)
//   .attr("height", graphHeight)
//   .attr("fill", "url(#gradient)");
// const maGrad = defs
//   .append("linearGradient")
//   .attr("id", "gradient")
//   .attr("x1", "0%")
//   .attr("y1", "0%")
//   .attr("x2", "100%")
//   .attr("y2", "0%");
// maGrad.append("stop").attr("offset", "0%").attr("stop-color", "red");
// maGrad.append("stop").attr("offset", "25%").attr("stop-color", "orange");
// maGrad.append("stop").attr("offset", "50%").attr("stop-color", "yellow");
// maGrad.append("stop").attr("offset", "75%").attr("stop-color", "green");
// maGrad.append("stop").attr("offset", "100%").attr("stop-color", "blue");
