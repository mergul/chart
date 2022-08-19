const randomLetters = () => {
  return d3
    .shuffle("abcdefghijklmnopqrstuvwxyz".split(""))
    .slice(0, Math.floor(6 + Math.random() * 20))
    .sort();
};
const replica = () => {
  setInterval(() => {
    svg
      .selectAll("text")
      .data(randomLetters())
      .join("text")
      .attr("x", (d, i) => i * 16)
      .text((d) => d);
  }, 5000);
};

width = 500;

const svg = d3
  .select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", 33)
  .attr("viewBox", `0 -20 ${width} 33`);
replica();
