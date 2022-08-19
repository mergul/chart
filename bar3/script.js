const MARGIN = {
  LEFT: 60,
  RIGHT: 60,
  TOP: 60,
  BOTTOM: 60,
};
// total width incl margin
const VIEWPORT_WIDTH = 1140;
// total height incl margin
const VIEWPORT_HEIGHT = 400;

const WIDTH = VIEWPORT_WIDTH - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = VIEWPORT_HEIGHT - MARGIN.TOP - MARGIN.BOTTOM;

const svg = d3
  .select(".chart-container")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g = svg.append("g");

g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 70)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month");

g.append("text")
  .attr("class", "y axis-label")
  .attr("x", -(HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("");

const zoom = d3.zoom().scaleExtent([0.5, 10]).on("zoom", zoomed);
svg.call(zoom);
function zoomed(event) {
  x.range(
    [MARGIN.LEFT, VIEWPORT_WIDTH - MARGIN.RIGHT].map((d) =>
      event.transform.applyX(d)
    )
  );
  barsGroup
    .selectAll("rect.profit")
    .attr("x", (d) => x(d.month))
    .attr("width", 0.5 * x.bandwidth());
  barsGroup
    .selectAll("rect.revenue")
    .attr("x", (d) => x(d.month) + 0.5 * x.bandwidth())
    .attr("width", 0.5 * x.bandwidth());
  xAxisGroup.call(xAxisCall);
}

const x = d3
  .scaleBand()
  .range([MARGIN.LEFT, VIEWPORT_WIDTH - MARGIN.RIGHT])
  .paddingInner(0.3)
  .paddingOuter(0.2);

const y = d3.scaleLinear().range([HEIGHT, MARGIN.TOP]);

const xAxisGroup = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`);

const yAxisGroup = g
  .append("g")
  .attr("class", "y axis")
  .attr("transform", `translate(${MARGIN.LEFT},0)`);

const xAxisCall = d3.axisBottom(x);

const yAxisCall = d3
  .axisLeft(y)
  .ticks(3)
  .tickFormat((d) => "$" + d);

const defs = svg.append("defs");
const barsClipPath = defs
  .append("clipPath")
  .attr("id", "bars-clip-path")
  .append("rect")
  .attr("x", MARGIN.LEFT)
  .attr("y", 0)
  .attr("width", WIDTH)
  .attr("height", 400);

const barsGroup = g.append("g");
const zoomGroup = barsGroup.append("g");

barsGroup.attr("class", "bars");
zoomGroup.attr("class", "zoom");

barsGroup.attr("clip-path", "url(#bars-clip-path)");
xAxisGroup.attr("clip-path", "url(#bars-clip-path)");

d3.csv("data.csv").then((data) => {
  data.forEach((d) => {
    d.profit = Number(d.profit);
    d.revenue = Number(d.revenue);
    d.month = d.month;
  });

  var y0 = d3.max(data, (d) => d.profit);
  var y1 = d3.max(data, (d) => d.revenue);

  var maxdomain = y1;

  if (y0 > y1) var maxdomain = y0;

  x.domain(data.map((d) => d.month));
  y.domain([0, maxdomain]);

  xAxisGroup
    .call(xAxisCall)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)");

  yAxisGroup.call(yAxisCall);

  const rects = zoomGroup.selectAll("rect").data(data);

  rects.exit().remove();

  rects
    .attr("y", (d) => y(d.profit))
    .attr("x", (d) => x(d.month))
    .attr("width", 0.5 * x.bandwidth())
    .attr("height", (d) => HEIGHT - y(d.profit));

  rects
    .enter()
    .append("rect")
    .attr("class", "profit")
    .attr("y", (d) => y(d.profit))
    .attr("x", (d) => x(d.month))
    .attr("width", 0.5 * x.bandwidth())
    .attr("height", (d) => HEIGHT - y(d.profit))
    .attr("fill", "grey");

  const rects_revenue = zoomGroup.selectAll("rect.revenue").data(data);

  rects_revenue.exit().remove();

  rects_revenue
    .attr("y", (d) => y(d.revenue))
    .attr("x", (d) => x(d.month))
    .attr("width", 0.5 * x.bandwidth())
    .attr("height", (d) => HEIGHT - y(d.revenue));

  rects_revenue
    .enter()
    .append("rect")
    .attr("class", "revenue")
    .style("fill", "red")
    .attr("y", (d) => y(d.revenue))
    .attr("x", (d) => x(d.month) + 0.5 * x.bandwidth())
    .attr("width", 0.5 * x.bandwidth())
    .attr("height", (d) => HEIGHT - y(d.revenue))
    .attr("fill", "grey");
});
