const BOTTOM_PADDING = 50;
const LEFT_PADDING = 25;
const RIGHT_PADDING = 10;
const TOP_PADDING = 10;

const HEIGHT = 350;
const WIDTH = 900;

const usableHeight = HEIGHT - TOP_PADDING - BOTTOM_PADDING;
const usableWidth = WIDTH - LEFT_PADDING - RIGHT_PADDING;

const allData = [
  { name: "apple", colorIndex: 1 },
  { name: "banana", colorIndex: 2 },
  { name: "cherry", colorIndex: 3 },
  { name: "date", colorIndex: 4 },
  { name: "grape", colorIndex: 5 },
  { name: "mango", colorIndex: 6 },
  { name: "peach", colorIndex: 7 },
  { name: "raspberry", colorIndex: 8 },
  { name: "strawberry", colorIndex: 9 },
  { name: "tangerine", colorIndex: 10 },
  { name: "watermelon", colorIndex: 11 },
];

let barPadding, barWidth, xScale, yScale, yAxisGroup, xAxisGroup;

const random = (max) => Math.floor(Math.random() * max + 1);
const getDataset = () =>
  allData.map((d) => {
    return {
      name: d.name,
      colorIndex: d.colorIndex,
      score: random(10),
    };
  });

const colorScale = d3.scaleOrdinal(d3.schemePaired); // 12 colors

function updateYAxis(svg, data, max) {
  if (!yAxisGroup) {
    yAxisGroup = svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${LEFT_PADDING}, ${TOP_PADDING})`);
  }
  const tickValues = Array.from(Array(max + 1).keys());
  const yAxis = d3
    .axisLeft(yScale)
    .tickValues(tickValues)
    .tickFormat((n) => n.toFixed(0));
  yAxis(yAxisGroup);
}
function updateXAxis(svg, data) {
  if (!xAxisGroup) {
    xAxisGroup = svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0, ${TOP_PADDING + usableHeight})`);
  }
  const xAxisScale = d3
    .scaleBand()
    .domain(data.map((item) => item.name)) // fruit names
    .range([LEFT_PADDING, LEFT_PADDING + usableWidth]);
  const xAxis = d3.axisBottom(xAxisScale).ticks(data.length);
  xAxis(xAxisGroup);
}
function updateRect(rect) {
  rect
    .attr("fill", (d) => colorScale(d.colorIndex))
    .attr("width", barWidth - barPadding * 2)
    .attr("height", (d) => usableHeight - yScale(d.score))
    .attr("x", barPadding)
    .attr("y", (d) => TOP_PADDING + yScale(d.score));
}

function updateData() {
  const data = getDataset(); //getRandomData();

  barPadding = Math.ceil(30 / data.length);

  barWidth = usableWidth / data.length;

  xScale = d3
    .scaleLinear()
    .domain([0, data.length])
    .range([LEFT_PADDING, LEFT_PADDING + usableWidth]);

  const max = d3.max(data, (d) => d.score);
  yScale = d3.scaleLinear().domain([0, max]).range([usableHeight, 0]);

  const svg = d3.select("#chart").attr("width", WIDTH).attr("height", HEIGHT);

  const groups = svg
    .selectAll(".bar")
    .data(data, (d) => d.name)
    .join((enter) => {
      const groups = enter.append("g").attr("class", "bar");

      groups
        .append("rect")
        .attr("height", 0)
        .attr("y", TOP_PADDING + usableHeight);

      return groups;
    });

  groups.call((group) =>
    group.attr("transform", (_, i) => `translate(${xScale(i)}, 0)`)
  );

  groups.select("rect").call(updateRect);
  updateYAxis(svg, data, max);
  updateXAxis(svg, data);
}

updateData();
