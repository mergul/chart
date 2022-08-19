function initChart() {
  var lineData = [
    {
      x: 1,
      y: 5,
    },
    {
      x: 20,
      y: 20,
    },
    {
      x: 40,
      y: 10,
    },
    {
      x: 60,
      y: 40,
    },
    {
      x: 80,
      y: 5,
    },
    {
      x: 100,
      y: 60,
    },
  ];

  var WIDTH = 1000,
    HEIGHT = 500,
    MARGINS = {
      top: 20,
      right: 20,
      bottom: 20,
      left: 50,
    },
    graph = d3
      .select("#visualisation")
      .attr("width", WIDTH)
      .attr("height", HEIGHT),
    gXAxis = graph
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${HEIGHT - MARGINS.bottom})`),
    gYAxis = graph
      .append("g")
      .attr("transform", "translate(" + MARGINS.left + ",0)")
      .attr("class", "y axis"),
    xRange = d3
      .scaleLinear()
      .domain([
        d3.min(lineData, function (d) {
          return d.x;
        }),
        d3.max(lineData, function (d) {
          return d.x;
        }),
      ])
      .range([MARGINS.left, WIDTH - MARGINS.right]),
    yRange = d3
      .scaleLinear()
      .domain([
        d3.min(lineData, function (d) {
          return d.y;
        }),
        d3.max(lineData, function (d) {
          return d.y;
        }),
      ])
      .range([HEIGHT - MARGINS.top, MARGINS.bottom]),
    xAxis = d3.axisBottom(xRange).tickSize(5),
    yAxis = d3.axisLeft(yRange).tickSize(5);
  gXAxis.call(xAxis);
  gYAxis.call(yAxis);
  //   vis
  //     .append("svg:g")
  //     .attr("class", "x axis")
  //     .attr("transform", "translate(0," + (HEIGHT - MARGINS.bottom) + ")")
  //     .call(xAxis);

  //   vis
  //     .append("svg:g")
  //     .attr("class", "y axis")
  //     .attr("transform", "translate(" + MARGINS.left + ",0)")
  //     .call(yAxis);
}
initChart();
