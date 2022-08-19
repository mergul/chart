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
      .slice(-100)
  )
  .then((data) => {
    var xScale = d3.scaleTime(),
      yScale = d3.scaleLinear();

    var xAxis = d3.axisBottom().scale(xScale).ticks(5);

    var yAxis = d3.axisLeft().scale(yScale);

    var series = ohlcSeries().xScale(xScale).yScale(yScale);
    var crosshairs = crosshairsSeries()
      .series(data)
      .xScale(xScale)
      .yScale(yScale)
      .yValue("close")
      .formatV(function (data) {
        return d3.format(".1f")(data.close);
      })
      .formatH(function (data) {
        return d3.timeFormat("%b %e")(data.date);
      });

    var zoom = d3
      .zoom()
      .scaleExtent([0.5, 5])
      .on("zoom", zoomed)
      .on("end", zoomEnd);

    var zoomChart = zoomChartExample(
      zoom,
      data,
      series,
      crosshairs,
      xScale,
      yScale,
      xAxis,
      yAxis
    );
    zoomChart();

    function zoomed(event) {
      var t = event.transform;
      var xScaleZ = t.rescaleX(xScale);
      series.xScale(xScaleZ).tickWidth(5 * t.k);
      crosshairs.xScale(xScaleZ);

      var g = d3.selectAll("svg").select("g");
      g.select(".x.axis").call(d3.axisBottom(xScaleZ));
      g.select(".series").call(series);
      crosshairs.update(event);
    }
    function zoomEnd(event) {
      var t = event.transform;
      var xScaleZ = t.rescaleX(xScale),
        filtered = data.filter(
          (d) => d.date >= xScaleZ.domain()[0] && d.date <= xScaleZ.domain()[1]
        ),
        minP = +d3.min(filtered, (d) => d.low),
        maxP = +d3.max(filtered, (d) => d.high),
        buffer = Math.floor((maxP - minP) * 0.1);

      yScale.domain([minP - buffer, maxP + buffer]);
      series.yScale(yScale);
      crosshairs.yScale(yScale);

      var g = d3.selectAll("svg").select("g");
      g.select(".y.axis").call(d3.axisLeft(yScale));
      g.select(".series").call(series);
      crosshairs.update(event);
    }
  });
