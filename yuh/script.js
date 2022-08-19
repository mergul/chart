var data = [
  {
    letter: "A",
    frequency: "Z",
  },
  {
    letter: "B",
    frequency: "Y",
  },
  {
    letter: "C",
    frequency: "X",
  },
  {
    letter: "D",
    frequency: "W",
  },
  {
    letter: "E",
    frequency: "V",
  },
  {
    letter: "F",
    frequency: "U",
  },
  {
    letter: "G",
    frequency: "T",
  },
  {
    letter: "H",
    frequency: "S",
  },
  {
    letter: "I",
    frequency: "R",
  },
  {
    letter: "J",
    frequency: "Q",
  },
  {
    letter: "K",
    frequency: "P",
  },
  {
    letter: "L",
    frequency: "O",
  },
  {
    letter: "M",
    frequency: "N",
  },
  {
    letter: "N",
    frequency: "M",
  },
  {
    letter: "O",
    frequency: "L",
  },
  {
    letter: "P",
    frequency: "K",
  },
  {
    letter: "Q",
    frequency: "J",
  },
  {
    letter: "R",
    frequency: "I",
  },
  {
    letter: "S",
    frequency: "H",
  },
  {
    letter: "T",
    frequency: "G",
  },
  {
    letter: "U",
    frequency: "F",
  },
  {
    letter: "V",
    frequency: "E",
  },
  {
    letter: "W",
    frequency: "D",
  },
  {
    letter: "X",
    frequency: "C",
  },
  {
    letter: "Y",
    frequency: "B",
  },
  {
    letter: "Z",
    frequency: "A",
  },
];

var svg = d3.select("svg"),
  margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 40,
  },
  width = +svg.attr("width") - margin.left - margin.right,
  height = +svg.attr("height") - margin.top - margin.bottom;

var zoom = d3
  .zoom()
  .scaleExtent([1, Infinity])
  .translateExtent([
    [0, 0],
    [width, height],
  ])
  .extent([
    [0, 0],
    [width, height],
  ])
  .on("zoom", zoom);

svg.call(zoom);

var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
  y = d3.scaleBand().rangeRound([height, 0]).padding(0.1);

var g = svg
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var defs = g.append("defs");

defs
  .append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("x", 0)
  .attr("y", 0)
  .attr("width", width)
  .attr("height", height);

defs
  .append("clipPath")
  .attr("id", "clipx")
  .append("rect")
  .attr("x", 0)
  .attr("y", height)
  .attr("width", width)
  .attr("height", margin.bottom);

defs
  .append("clipPath")
  .attr("id", "clipy")
  .append("rect")
  .attr("x", -margin.left)
  .attr("y", -10)
  .attr("width", margin.left + 1)
  .attr("height", height + 15);

x.domain(
  data.map(function (d) {
    return d.letter;
  })
);
y.domain(
  data.map(function (d) {
    return d.frequency;
  })
);

var xAxis = g
  .append("g")
  .attr("clip-path", "url(#clipx)")
  .append("g")
  .attr("class", "axis axis--x")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

var yAxis = g
  .append("g")
  .attr("clip-path", "url(#clipy)")
  .append("g")
  .attr("class", "axis axis--y")
  .call(d3.axisLeft(y));

yAxis
  .append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("Letters Too");

var bars = g
  .append("g")
  .attr("clip-path", "url(#clip)")
  .selectAll(".bar")
  .data(data)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", function (d) {
    return x(d.letter);
  })
  .attr("y", function (d) {
    return y(d.frequency) + y.bandwidth() / 2;
  })
  .attr("width", x.bandwidth())
  .attr("height", function (d) {
    return height - y(d.frequency);
  });

function zoom(event) {
  var t = event.transform;
  bars.attr("transform", t);

  xAxis.attr("transform", d3.zoomIdentity.translate(t.x, height).scale(t.k));
  xAxis.selectAll("text").attr("transform", d3.zoomIdentity.scale(1 / t.k));
  xAxis.selectAll("line").attr("transform", d3.zoomIdentity.scale(1 / t.k));

  yAxis.attr("transform", d3.zoomIdentity.translate(0, t.y).scale(t.k));
  yAxis.selectAll("text").attr("transform", d3.zoomIdentity.scale(1 / t.k));
  yAxis.selectAll("line").attr("transform", d3.zoomIdentity.scale(1 / t.k));
}
// function zoomed() {
//         // Rescale the range of x using the reference range of x2.
//         x.range(x2.range().map(function (d) {
//             return d3.event.transform.applyX(d);
//         }))
//         axisG.call(axis);
//     }
