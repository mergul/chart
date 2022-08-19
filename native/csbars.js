function barchart() {
  function barrender(selection) {
    const width = selection.node().getBoundingClientRect().width;
    const height = selection.node().getBoundingClientRect().height / 6;
    selection.each(function (data) {
      const graph = selection
        .append("g")
        .attr("width", width)
        .attr("height", height)
        .classed("volume", true)
        .attr("transform", `translate(0, ${5 * height})`);
      // const gXAxis = graph
      //   .append("g")
      //   .attr("transform", `translate(0, ${graphHeight})`);
      // const gYAxis = graph.append("g");

      let x = d3
        .scaleBand()
        .domain(data.map((d) => d.Date))
        .range([0, width])
        .padding(0.1);
      let y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.Volume)])
        .nice()
        .range([height, 0]);

      const rects = graph.selectAll("rect").data(data);
      rects
        .attr("width", x.bandwidth)
        .attr("class", "bar-rect")
        .attr("height", (d) => height - y(d.Volume))
        .attr("x", (d) => x(d.Date))
        .attr("y", (d) => y(d.Volume));
      rects
        .enter()
        .append("rect")
        .attr("class", "bar-rect")
        .attr("width", x.bandwidth)
        .attr("height", (d) => height - y(d.Volume))
        .attr("x", (d) => x(d.Date))
        .attr("y", (d) => y(d.Volume));
      // const xAxis = d3.axisBottom(x);
      // const yAxis = d3
      //   .axisLeft(y)
      //   .ticks(5)
      //   .tickFormat((d) => `USD ${d / 1000}K`);
      // gXAxis.call(xAxis);
      // gYAxis.call(yAxis);
    });
  } // barrender

  return barrender;
} // barchart
