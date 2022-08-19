const parseDate = d3.timeParse("%Y-%m-%d");

d3.csv("aapl-2.csv")
  .then((d) =>
    d
      .map((d) => ({
        date: parseDate(d["Date"]),
        high: +d["High"],
        low: +d["Low"],
        open: +d["Open"],
        close: +d["Close"],
      }))
      .slice(-180)
  )
  .then((data) => {
    const chart = function () {
        const svg = d3
          .select("#container")
          .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

        svg.append("g").call(xAxis);

        svg.append("g").call(yAxis);

        svg
          .append("g")
          .attr("stroke-width", 2)
          .attr("fill", "none")
          .selectAll("path")
          .data(data)
          .join("path")
          .attr(
            "d",
            (d) => `
        M${x(d.date)},${y(d.low)}V${y(d.high)}
        M${x(d.date)},${y(d.open)}h-4
        M${x(d.date)},${y(d.close)}h4
      `
          )
          .attr("stroke", (d) =>
            d.open > d.close
              ? d3.schemeSet1[0]
              : d.close > d.open
              ? d3.schemeSet1[2]
              : d3.schemeSet1[8]
          )
          .append("title")
          .text(
            (d) => `${formatDate(d.date)}
Open: ${formatValue(d.open)}
Close: ${formatValue(d.close)} (${formatChange(d.open, d.close)})
Low: ${formatValue(d.low)}
High: ${formatValue(d.high)}`
          );

        return svg.node();
      },
      width = 1500,
      height = 500,
      margin = { top: 20, right: 30, bottom: 30, left: 40 },
      x = d3
        .scaleBand()
        .domain(
          d3.timeDay
            .range(data[0].date, +data[data.length - 1].date + 1)
            .filter((d) => d.getDay() !== 0 && d.getDay() !== 6)
        )
        .range([margin.left, width - margin.right])
        .padding(0.2),
      y = d3
        .scaleLog()
        .domain([d3.min(data, (d) => d.low), d3.max(data, (d) => d.high)])
        .rangeRound([height - margin.bottom, margin.top]),
      xAxis = (g) =>
        g
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(
            d3
              .axisBottom(x)
              .tickValues(
                d3.timeMonday
                  .every(width > 720 ? 1 : 2)
                  .range(data[0].date, data[data.length - 1].date)
              )
              .tickFormat(d3.timeFormat("%-m/%-d"))
          )
          .call((g) => g.select(".domain").remove()),
      yAxis = (g) =>
        g
          .attr("transform", `translate(${margin.left},0)`)
          .call(
            d3
              .axisLeft(y)
              .tickFormat(d3.format("$~f"))
              .tickValues(d3.scaleLinear().domain(y.domain()).ticks())
          )
          .call((g) =>
            g
              .selectAll(".tick line")
              .clone()
              .attr("stroke-opacity", 0.2)
              .attr("x2", width - margin.left - margin.right)
          )
          .call((g) => g.select(".domain").remove()),
      formatDate = d3.timeFormat("%B %-d, %Y"),
      formatValue = d3.format(".2f"),
      formatChange = function () {
        const f = d3.format("+.2%");
        return (y0, y1) => f((y1 - y0) / y0);
      };
    // data = d3
    //   .csvParse(await FileAttachment("aapl-2.csv").text(), (d) => {
    //     const date = parseDate(d["Date"]);
    //     return {
    //       date,
    //       high: +d["High"],
    //       low: +d["Low"],
    //       open: +d["Open"],
    //       close: +d["Close"],
    //     };
    //   })
    //   .slice(-90);
    chart();
  });
