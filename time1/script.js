// set the dimensions and margins of the graph
var margin = { top: 30, right: 20, bottom: 30, left: 40 },
  width = 1260 - margin.left - margin.right,
  height = 680 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3
  .select("body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//set title
svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", 0 - margin.top / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .text("Lego Sets by Year from Rebrickable");

//set title
svg
  .append("text")
  .attr("x", width / 2)
  .attr("y", 0 - margin.top / 2)
  .attr("text-anchor", "middle")
  .style("font-size", "18px")
  .text("Lego Sets by Year from Rebrickable");

//set bottom-right text

svg
  .append("text")
  .attr("x", 960 - 80)
  .attr("y", 500 - 30)
  .attr("text-anchor", "middle")
  .style("font-size", "14px")
  .text("testing123");

// Loading  data from q3.csv using  d3.dsv()
d3.dsv(",", "data.csv").then(function (data) {
  data.forEach(function (d) {
    d.year = d3.timeParse("%Y")(d.year);
  });

  // Scale the range of the data in the domains
  x.domain(
    d3.extent(data, function (d) {
      return d.year;
    })
  );
  y.domain([
    0,
    d3.max(data, function (d) {
      return d.running_total;
    }),
  ]);

  // append the rectangles for the bar chart
  svg
    .selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("x", function (d) {
      return x(d.year);
    })
    .attr("width", 10)
    .attr("y", function (d) {
      return y(d.running_total);
    })
    .attr("height", function (d) {
      return height - y(d.running_total);
    });

  // add the x Axis
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(d3.timeYear.every(10)));

  // add the y Axis
  svg.append("g").call(d3.axisLeft(y));
});
