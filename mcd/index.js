var margin2 = {
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
};
var height2 = 400 - margin2.top - margin2.bottom;
var width2 = 500 - margin2.left - margin2.right;

// Add svg to
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width2 + margin2.left + margin2.right)
  .attr("height", height2 + margin2.top + margin2.bottom)
  .append("g")
  .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

//title
svg
  .append("text")
  .attr("x", width2 / 2)
  .attr("y", 0 - margin2.top / 3)
  .attr("text-anchor", "middle")
  .style("font-size", "16px")
  .style("text-decoration", "underline")
  .text("Title");

// X scale
var xScale = d3.scaleBand().range([width2, 0]).padding(0.1);

//y scale
var yScale = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(xScale);

var yAxis = d3.axisLeft(yScale).tickSize(6, 0);

// text label for the x axis
svg
  .append("text")
  .attr(
    "transform",
    "translate(" + width2 / 2 + " ," + (height2 + margin2.top + 20) + ")"
  )
  .style("text-anchor", "middle")
  .text("X Label");

function render(data) {
  xScale.domain(
    data.map(function (d) {
      return d["date"];
    })
  );
  yScale
    .domain(
      d3.extent(data, function (d) {
        return d["MacdHistogram"];
      })
    )
    .nice();

  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", function (d) {
      return "bar bar--" + (d["MacdHistogram"] < 0 ? "negative" : "positive");
    })
    .attr("x", function (d) {
      return xScale(d["date"]);
    })
    .attr("y", function (d) {
      return yScale(Math.max(0, d["MacdHistogram"]));
    })
    .attr("height", function (d) {
      return Math.abs(yScale(d["MacdHistogram"]) - yScale(0));
    })
    .attr("width", xScale.bandwidth());

  svg
    .append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + width2 + ",0)")
    .call(yAxis);
}

var data = [
  {
    date: 1,
    MacdHistogram: 1,
  },
  {
    date: 2,
    MacdHistogram: -2,
  },
  {
    date: 3,
    MacdHistogram: 8,
  },
  {
    date: 4,
    MacdHistogram: 3,
  },
  {
    date: 5,
    MacdHistogram: 12,
  },
  {
    date: 6,
    MacdHistogram: -5,
  },
  {
    date: 7,
    MacdHistogram: 1,
  },
  {
    date: 8,
    MacdHistogram: 9,
  },
  {
    date: 9,
    MacdHistogram: -1,
  },
  {
    date: 10,
    MacdHistogram: 10,
  },
  {
    date: 11,
    MacdHistogram: 7,
  },
  {
    date: 12,
    MacdHistogram: -8,
  },
  {
    date: 13,
    MacdHistogram: 7,
  },
  {
    date: 14,
    MacdHistogram: -4,
  },
  {
    date: 15,
    MacdHistogram: 1,
  },
];

render(data);
