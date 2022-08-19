let history = [
  { date: "2015-01-01", volume: 120453518 },
  { date: "2015-02-01", volume: 137503440 },
  { date: "2015-03-01", volume: 158757311 },
  { date: "2015-04-01", volume: 130552492 },
  { date: "2015-05-01", volume: 182752154 },
  { date: "2015-06-01", volume: 144304088 },
  { date: "2015-07-01", volume: 135088854 },
  { date: "2015-08-01", volume: 158191824 },
  { date: "2015-09-01", volume: 124257823 },
  { date: "2015-10-01", volume: 115231050 },
  { date: "2015-11-01", volume: 138719625 },
  { date: "2015-12-01", volume: 111443042 },
  { date: "2016-01-01", volume: 179118249 },
  { date: "2016-02-01", volume: 161566818 },
  { date: "2016-03-01", volume: 147686869 },
  { date: "2016-04-01", volume: 151936061 },
  { date: "2016-05-01", volume: 211814173 },
  { date: "2016-06-01", volume: 154985479 },
  { date: "2016-07-01", volume: 176758565 },
  { date: "2016-08-01", volume: 139879341 },
  { date: "2016-09-01", volume: 136744721 },
  { date: "2016-10-01", volume: 135775521 },
  { date: "2016-11-01", volume: 97906206 },
  { date: "2016-12-01", volume: 124987140 },
  { date: "2017-01-01", volume: 201461887 },
  { date: "2017-02-01", volume: 178173517 },
  { date: "2017-03-01", volume: 135677135 },
  { date: "2017-04-01", volume: 185292137 },
  { date: "2017-05-01", volume: 160638753 },
  { date: "2017-06-01", volume: 155101164 },
  { date: "2017-07-01", volume: 179955080 },
  { date: "2017-08-01", volume: 128238409 },
  { date: "2017-09-01", volume: 107595048 },
  { date: "2017-10-01", volume: 136697530 },
  { date: "2017-11-01", volume: 122366787 },
  { date: "2017-12-01", volume: 173496117 },
  { date: "2018-01-01", volume: 162729515 },
  { date: "2018-02-01", volume: 188381335 },
  { date: "2018-03-01", volume: 172521404 },
];

let forecast = [
  { date: "2018-04-01" },
  { date: "2018-05-01" },
  { date: "2018-06-01" },
  { date: "2018-07-01" },
  { date: "2018-08-01" },
  { date: "2018-09-01" },
];

const parseTime = d3.timeParse("%Y-%m-%d");

history = history.map((d) => {
  return {
    date: parseTime(d.date),
    volume: d.volume,
  };
});

const predict = (data, newX) => {
  const round = (n) => Math.round(n * 100) / 100;

  const sum = data.reduce(
    (acc, pair) => {
      const x = pair[0];
      const y = pair[1];

      if (y !== null) {
        acc.x += x;
        acc.y += y;
        acc.squareX += x * x;
        acc.product += x * y;
        acc.len += 1;
      }

      return acc;
    },
    { x: 0, y: 0, squareX: 0, product: 0, len: 0 }
  );

  const rise = sum.len * sum.product - sum.x * sum.y;
  const run = sum.len * sum.squareX - sum.x * sum.x;
  const gradient = run === 0 ? 0 : round(rise / run);
  const intercept = round(sum.y / sum.len - (gradient * sum.x) / sum.len);

  return round(gradient * newX + intercept);
};

const historyIndex = history.map((d, i) => [i, d.volume]);

forecast = forecast.map((d, i) => {
  return {
    date: parseTime(d.date),
    volume: predict(historyIndex, historyIndex.length - 1 + i),
  };
});

forecast.unshift(history[history.length - 1]);

const chart = d3.select("#chart");
const margin = { top: 20, right: 20, bottom: 30, left: 70 };
const width = 1000 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;
const innerChart = chart
  .append("g")
  .attr("transform", `translate(${margin.left} ${margin.top})`);

const x = d3.scaleTime().rangeRound([0, width]);
const y = d3.scaleLinear().rangeRound([height, 0]);

const line = d3
  .line()
  .x((d) => x(d.date))
  .y((d) => y(d.volume));

x.domain([d3.min(history, (d) => d.date), d3.max(forecast, (d) => d.date)]);
y.domain([0, d3.max(history, (d) => d.volume)]);

innerChart
  .append("g")
  .attr("transform", `translate(0 ${height})`)
  .call(d3.axisBottom(x));

innerChart
  .append("g")
  .call(d3.axisLeft(y))
  .append("text")
  .attr("fill", "#000")
  .attr("transform", "rotate(-90)")
  .attr("y", 6)
  .attr("dy", "0.71em")
  .attr("text-anchor", "end")
  .text("Avocados sold");

innerChart
  .append("path")
  .datum(history)
  .attr("fill", "none")
  .attr("stroke", "steelblue")
  .attr("stroke-width", 1.5)
  .attr("d", line);

innerChart
  .append("path")
  .datum(forecast)
  .attr("fill", "none")
  .attr("stroke", "tomato")
  .attr("stroke-dasharray", "10,7")
  .attr("stroke-width", 1.5)
  .attr("d", line);
