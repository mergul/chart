const width = 960,
  height = 500,
  margin = { top: 20, right: 20, bottom: 40, left: 50 },
  graphWidth = width - margin.left - margin.right,
  graphHeight = height - margin.top - margin.bottom;

const xScale = d3.scaleTime().range([margin.left, graphWidth - margin.right]);

const yScale = d3
  .scaleLinear()
  .nice()
  .range([graphHeight - margin.bottom, margin.top]);

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

const ZoomableBarChart = (data) => {
  const svg = d3
    .select("#app")
    .append("svg")
    .attr("viewBox", [
      0,
      0,
      graphWidth - margin.left,
      graphHeight - margin.top,
    ]);
  // .call(zoom); //calls the zoom function
  const gView = svg
    .append("g")
    .attr("class", "view")
    .attr("width", graphWidth - margin.left - margin.right)
    .attr("height", graphHeight - margin.top - margin.bottom);
  // .attr("transform", `translate(${margin.left}, ${margin.top})`);

  gView
    .append("g")
    .attr("clip-path", "url(#clipx)")
    .append("g")
    .attr("class", "x-axis")
    .call(xAxis);

  gView
    .append("g")
    .attr("clip-path", "url(#clipy)")
    .append("g")
    .attr("class", "y-axis")
    .call(yAxis);

  gView
    .append("g")
    .attr("clip-path", "url(#clip)")
    .attr("class", "bars")
    .attr("fill", "steelblue")
    .attr("width", graphWidth)
    .attr("height", graphHeight)
    .selectAll("rect")
    .data(data)
    .join("rect")
    .attr("x", (d) => xScale(d.date))
    .attr("y", (d) => yScale(d.value))
    .attr("height", (d) => graphHeight - yScale(d.value))
    .attr("width", 5);

  const defs = gView.append("defs");
  defs
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", graphWidth)
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
  rectZoom = gView
    .append("rect")
    .attr("class", "zoom")
    .style("fill", "none")
    .style("pointer-events", "all")
    .style("opacity", 0)
    .attr("x", margin.left)
    .attr("y", margin.top)
    .attr("width", graphWidth - margin.left - margin.right)
    .attr("height", graphHeight - margin.top - margin.bottom);
  // .attr("transform", `translate(${margin.left}, ${margin.top})`);

  rectZoom.call(zoom);
};

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
    var t = event.transform;
    let xScaleZ = t.rescaleX(xScale);
    let yScaleZ = t.rescaleY(yScale);
    let nXAxis = d3.axisBottom().scale(xScaleZ);
    let nYAxis = d3.axisLeft().scale(yScaleZ);
    d3.select(".x-axis").call(nXAxis);
    d3.select(".y-axis").call(nYAxis);

    d3.select(".view g.bars")
      .selectAll("rect")
      .attr("x", (d) => xScaleZ(d.date))
      .attr("width", 5)
      .attr("y", (d) => yScaleZ(d.value))
      .attr("height", (d) => yScaleZ(0) - yScaleZ(d.value));

    // d3.select(".bars")
    //   .selectAll("rect")
    //   .attr("transform", "translate(" + 0 + "," + t.y + ")");
  }
};
d3.csv("data.csv")
  .then((d) =>
    d.map((d) => ({
      date: new Date(d.Date),
      value: +d.Volume,
    }))
  )
  .then((data) => {
    let extent = d3.extent(data, (d) => d.date);
    xScale.domain(extent);
    yScale.domain([0, d3.max(data, (d) => d.value)]);
    ZoomableBarChart(data);
  });
