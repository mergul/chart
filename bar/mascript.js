var data = [
  {
    State: "CA",
    "Under 5 Years": 2704659,
    "5 to 13 Years": 4499890,
    "14 to 17 Years": 2159981,
    "18 to 24 Years": 3853788,
    "25 to 44 Years": 10604510,
    "45 to 64 Years": 8819342,
    "65 Years and Over": 4114496,
  },
  {
    State: "TX",
    "Under 5 Years": 2027307,
    "5 to 13 Years": 3277946,
    "14 to 17 Years": 1420518,
    "18 to 24 Years": 2454721,
    "25 to 44 Years": 7017731,
    "45 to 64 Years": 5656528,
    "65 Years and Over": 2472223,
  },
  {
    State: "NY",
    "Under 5 Years": 1208495,
    "5 to 13 Years": 2141490,
    "14 to 17 Years": 1058031,
    "18 to 24 Years": 1999120,
    "25 to 44 Years": 5355235,
    "45 to 64 Years": 5120254,
    "65 Years and Over": 2607672,
  },
  {
    State: "FL",
    "Under 5 Years": 1140516,
    "5 to 13 Years": 1938695,
    "14 to 17 Years": 925060,
    "18 to 24 Years": 1607297,
    "25 to 44 Years": 4782119,
    "45 to 64 Years": 4746856,
    "65 Years and Over": 3187797,
  },
  {
    State: "IL",
    "Under 5 Years": 894368,
    "5 to 13 Years": 1558919,
    "14 to 17 Years": 725973,
    "18 to 24 Years": 1311479,
    "25 to 44 Years": 3596343,
    "45 to 64 Years": 3239173,
    "65 Years and Over": 1575308,
  },
  {
    State: "PA",
    "Under 5 Years": 737462,
    "5 to 13 Years": 1345341,
    "14 to 17 Years": 679201,
    "18 to 24 Years": 1203944,
    "25 to 44 Years": 3157759,
    "45 to 64 Years": 3414001,
    "65 Years and Over": 1910571,
  },
];

var keys = [
  "Under 5 Years",
  "5 to 13 Years",
  "14 to 17 Years",
  "18 to 24 Years",
  "25 to 44 Years",
  "45 to 64 Years",
  "65 Years and Over",
];

var svg = d3.select("#container"),
  margin = { top: 20, right: 20, bottom: 30, left: 60 },
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom,
  g = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseDate = d3.timeParse("%Y-%m-%d"),
  formatDate = d3.timeFormat("%Y");

var x = d3
  .scaleTime()
  .domain([new Date(2006, 12, 1), new Date(2007, 1, 1)])
  .range([0, width]);

var y = d3.scaleLinear().range([height, 0]);

var xAxis = d3.axisBottom(x);

var yAxis = d3.axisLeft(y);

var area = d3
  .area()
  .curve(d3.curveStepAfter)
  .y0(y(0))
  .y1(function (d) {
    return y(d.value);
  });

var areaPath = g
  .append("path")
  .attr("clip-path", "url(#clip)")
  .attr("fill", "steelblue");

var yGroup = g.append("g");

var xGroup = g.append("g").attr("transform", "translate(0," + height + ")");

var zoom = d3
  .zoom()
  .scaleExtent([1 / 4, 8])
  .translateExtent([
    [-width, -Infinity],
    [2 * width, Infinity],
  ])
  .on("zoom", zoomed);

var zoomRect = svg
  .append("rect")
  .attr("width", width)
  .attr("height", height)
  .attr("fill", "none")
  .attr("pointer-events", "all")
  .call(zoom);

g.append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", width)
  .attr("height", height);

d3.json("test.json", function (data) {
  data.forEach((e) => {
    e.date = parseDate(e.date);
    e.value = +e.close;
  });
  var xExtent = d3.extent(data, function (d) {
    return d.date;
  });
  x.domain(xExtent);
  zoom.translateExtent([
    [x(xExtent[0]), -Infinity],
    [x(xExtent[1]), Infinity],
  ]);
  y.domain([
    0,
    d3.max(data, function (d) {
      return d.value;
    }),
  ]);
  yGroup.call(yAxis).select(".domain").remove();
  areaPath.datum(data);
  zoomRect.call(zoom.transform, d3.zoomIdentity);
});

function zoomed() {
  var xz = d3.event.transform.rescaleX(x);
  xGroup.call(xAxis.scale(xz));
  areaPath.attr(
    "d",
    area.x(function (d) {
      return xz(d.date);
    })
  );
}

// var svg = d3.select("svg"),
//   margin = { top: 20, right: 20, bottom: 30, left: 40 },
//   width = 960 - margin.left - margin.right,
//   height = 500 - margin.top - margin.bottom,
//   g = svg
//     .append("g")
//     .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// this.svg
//   .append("defs")
//   .append("clipPath")
//   .attr("id", "clip")
//   .append("rect")
//   .attr("width", width)
//   .attr("height", 500);

// var x0 = d3.scaleBand().rangeRound([0, width]).paddingInner(0.1);

// var x1 = d3.scaleBand().padding(0.05);

// var y = d3.scaleLinear().rangeRound([height, 0]);

// var z = d3
//   .scaleOrdinal()
//   .range([
//     "#98abc5",
//     "#8a89a6",
//     "#7b6888",
//     "#6b486b",
//     "#a05d56",
//     "#d0743c",
//     "#ff8c00",
//   ]);

// var zoom = d3
//   .zoom()
//   .scaleExtent([1, 8])
//   .translateExtent([
//     [0, 0],
//     [width, height],
//   ])
//   .extent([
//     [0, 0],
//     [width, height],
//   ])
//   .on("zoom", () => {
//     zoomed();
//   });

// x0.domain(
//   data.map(function (d) {
//     return d.State;
//   })
// );
// x1.domain(keys).rangeRound([0, x0.bandwidth()]);
// y.domain([
//   0,
//   d3.max(data, function (d) {
//     return d3.max(keys, function (key) {
//       return d[key];
//     });
//   }),
// ]).nice();

// g.append("g")
//   .style("clip-path", "url(#clip)")
//   .selectAll("g")
//   .data(data)
//   .enter()
//   .append("g")
//   .attr("class", "barGroup")
//   .attr("transform", function (d) {
//     return "translate(" + x0(d.State) + ",0)";
//   })
//   .selectAll("rect")
//   .data(function (d) {
//     return keys.map(function (key) {
//       return { key: key, value: d[key] };
//     });
//   })
//   .enter()
//   .append("rect")
//   .attr("class", "bar")
//   .attr("x", function (d) {
//     return x1(d.key);
//   })
//   .attr("y", function (d) {
//     return y(d.value);
//   })
//   .attr("width", x1.bandwidth())
//   .attr("height", function (d) {
//     return height - y(d.value);
//   })
//   .attr("fill", function (d) {
//     return z(d.key);
//   });

// var xAxis = d3.axisBottom(x0);

// g.append("g")
//   .style("clip-path", "url(#clip)")
//   .append("g")
//   .attr("class", "axis--x")
//   .attr("transform", "translate(0," + height + ")")
//   .call(xAxis);

// g.append("g")
//   .attr("class", "axis--y")
//   .call(d3.axisLeft(y).ticks(null, "s"))
//   .append("text")
//   .attr("x", 2)
//   .attr("y", y(y.ticks().pop()) + 0.5)
//   .attr("dy", "0.32em")
//   .attr("fill", "#000")
//   .attr("font-weight", "bold")
//   .attr("text-anchor", "start")
//   .text("Population");

// svg.call(zoom);

// function zoomed() {
//   x0.range([0, width].map((d) => d3.event.transform.applyX(d)));
//   x1.rangeRound([0, x0.bandwidth()]);

//   g.selectAll(".barGroup").attr("transform", function (d) {
//     return "translate(" + x0(d.State) + ",0)";
//   });
//   g.selectAll(".bar")
//     .attr("x", function (d) {
//       return x1(d.key);
//     })
//     .attr("width", x1.bandwidth());

//   g.select(".axis--x").call(xAxis);
// }
