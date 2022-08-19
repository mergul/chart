const width = 1200;
const height = 650;
const margin = { top: 20, right: 120, bottom: 50, left: 20 };
const graphWidth = width - margin.left - margin.right;
const graphHeight = height - margin.top - margin.bottom;

const svg = d3
  .select(".canvas")
  .append("svg")
  .attr("width", width)
  .attr("height", height);
const graph = svg
  .append("g")
  .attr("width", graphWidth)
  .attr("height", graphHeight)
  .attr("transform", `translate(${margin.left}, ${margin.top})`);
const gXAxis = graph
  .append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${graphHeight})`);
const gYAxis = graph
  .append("g")
  .attr("class", "y axis")
  .attr("transform", `translate(${graphWidth}, 0)`);

d3.json("sales.json").then((data) => {
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => +d.Amount)])
    .range([graphHeight, 0]);
  const xScale = d3
    .scaleBand()
    .domain(data.map((item) => item.Period))
    .range([0, graphWidth])
    .paddingInner(0.2)
    .paddingOuter(0.2);

  const rects = graph.selectAll("rect").data(data);

  rects
    .enter()
    .append("rect")
    .attr("class", "bar-rect")
    .attr("width", xScale.bandwidth)
    .attr("height", (d) => graphHeight - yScale(d.Amount))
    .attr("x", (d) => xScale(d.Period))
    .attr("y", (d) => yScale(d.Amount));

  const xAxis = d3.axisBottom(xScale).tickFormat((d) => d);

  const yAxis = d3.axisRight(yScale).tickFormat((d) => `${d / 1000}`);

  gXAxis.call(xAxis);

  gYAxis.call(yAxis);

  gXAxis.selectAll("text").style("font-size", 14);

  gYAxis.selectAll("text").style("font-size", 14);

  graph
    .append("rect")
    .attr("class", "zoom")
    .attr("id", "rect")
    .attr("width", graphWidth)
    .attr("height", graphHeight)
    .style("fill", "none")
    .style("pointer-events", "all");

  let z = d3.zoomIdentity;

  const extent = [
    [0, 0],
    [graphWidth, graphHeight],
  ];

  var resizeTimer;
  var zoom = d3
    .zoom()
    .scaleExtent([1, 2])
    .translateExtent(extent)
    .extent(extent)
    .on("zoom", zoomed);
  // .on("zoom.end", zoomend);

  svg.call(zoom);
  function zoomed(event) {
    var t = event.transform;
    graph.attr("transform", t);

    //graph.attr("transform", t);
    let yScaleZ = t.rescaleY(yScale);
    gYAxis.call(yAxis.scale(yScaleZ));
  }
});
