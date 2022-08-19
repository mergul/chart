var zoomChartExample = function (
  zoom,
  data,
  crosshairs,
  xScale,
  yScale,
  yVolumeScale,
  yMacdScale,
  yCciScale,
  xAxis,
  yAxis,
  seriesMap,
  seriesProps,
  indicatorsCount
) {
  let width = 920,
    height = 460,
    margin = { top: 25, right: 25, bottom: 50, left: 50 },
    indicatorHeight = 80,
    graphWidth = width - margin.left - margin.right,
    graphHeight =
      height - margin.top - margin.bottom - indicatorHeight * indicatorsCount,
    showns = 0;

  var zoomChart = function () {
    // Select the svg element, if it exists.
    var svg = d3.select("#container").selectAll("svg").data([data]);
    // Otherwise, create the skeletal chart.
    var svgEnter = svg.enter().append("svg");
    // Otherwise, create the skeletal chart.
    var gEnter = svgEnter.append("g").attr("class", "view");

    var gX = gEnter.append("g").attr("class", "axis x-axis");
    var gY = gEnter.append("g").attr("class", "axis y-axis");
    gEnter
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", graphWidth)
      .attr("height", graphHeight)
      .style("fill", "none");

    var chartBody = gEnter
      .append("g")
      .attr("class", "chartBody")
      .attr("clip-path", "url(#clip)");
    // Update the outer dimensions.
    svg
      .merge(svgEnter)
      .attr("viewBox", [0, 0, width, height])
      .attr("preserveAspectRatio", "none");
    // Update the inner dimensions.
    var g = svg
      .merge(svgEnter)
      .select("g")
      .attr("transform", "translate(" + 35 + "," + 5 + ")");
    //------------BODY ------------

    let label = chartBody
      .append("text")
      .attr("class", "label")
      .attr("x", 12)
      .attr("y", 12)
      .style("font-size", "10px");
    label.append("tspan").attr("id", "date");
    label.append("tspan").attr("id", "open");
    label.append("tspan").attr("id", "high");
    label.append("tspan").attr("id", "low");
    label.append("tspan").attr("id", "close");
    label.append("tspan").attr("id", "volume");
    label.append("tspan").attr("id", "diff");
    //------------crosshairs ------------
    if (data.length > 0) {
      var overlay = d3
        .area()
        .x(function (d) {
          return xScale(d.date);
        })
        .y0(0)
        .y1(height);
      if (!g.select(".crosshairs").empty()) {
        g.select(".crosshairs").remove();
        crosshairs.target(g);
      } else crosshairs.target(g);

      gEnter.append("path").attr("class", "overlay").attr("d", overlay(data));
    }
    //------------X-AXIS ------------
    var xExtend = d3.extent(data, (d) => d.date);
    minP = d3.min(data, function (d) {
      return d.low;
    });
    maxP = d3.max(data, function (d) {
      return d.high;
    });
    buffer = Math.floor((maxP - minP) * 0.1);
    xScale
      .domain([
        d3.timeDay.offset(xExtend[0], -1),
        d3.timeDay.offset(xExtend[1], 1),
      ])
      .range([0, graphWidth]);
    yScale.domain([minP - buffer, maxP + buffer]).range([graphHeight, 0]);
    yVolumeScale
      .domain([0, d3.max(data, (d) => +d.volume)])
      .nice()
      .range([graphHeight / 8, 0]);
    xAxis.tickFormat(d3.timeFormat("%b %e")).tickSize(-graphHeight);
    yAxis.tickSize(-graphWidth);

    //------------ZOOM ------------

    const extent = [
      [0, 0],
      [graphWidth, graphHeight],
    ];
    zoom.extent(extent).translateExtent(extent);

    // Draw axes
    gX.attr("transform", "translate(0," + graphHeight + ")")
      .merge(svg.select(".x-axis"))
      .call(xAxis);
    gY.attr("transform", "translate(" + graphWidth + ",0)")
      .merge(svg.select(".y-axis"))
      .call(yAxis);

    gX.selectAll(".tick text").style("font-size", "10px");
    gX.selectAll(".tick line").style("opacity", ".1");
    gX.selectAll("path.domain").style("opacity", ".1");
    gY.selectAll(".tick text").style("font-size", "10px");
    gY.selectAll(".tick line").style("opacity", ".1");
    gY.selectAll("path.domain").style("opacity", ".1");
    // Draw series.
    Object.assign(seriesProps, {
      volume_series: {
        transform: `translate(0, ${(7 * graphHeight) / 8 - 12})`,
      },
    });
    for (const [key, value] of Object.entries(seriesMap)) {
      if (Array.isArray(value)) {
        var gs = g.selectAll(`.${key}`).nodes();
        value.forEach((d, i) => {
          d3.select(gs[i]).datum(data).call(d);
        });
      } else {
        var mSerie = chartBody
          .append("g")
          .attr("class", key)
          .merge(g.select(`.${key}`));
        if (key === "macd_series") setYMacdScale(data, gEnter);
        if (key === "cci_series") setYCciScale(data, gEnter);

        const props = seriesProps[key];
        if (props)
          for (const [mk, mv] of Object.entries(props)) {
            mSerie.attr(mk, mv);
          }
        mSerie.datum(data).call(value);
      }
    }
    gEnter
      .append("rect")
      .attr("class", "zoom")
      .attr("id", "rect")
      .attr("width", graphWidth)
      .attr("height", graphHeight + indicatorsCount * 80)
      .style("fill", "none")
      .style("opacity", 0)
      .style("pointer-events", "all")
      .call(zoom);
    gEnter.call(crosshairs);
  };
  function setYMacdScale(data, gEnter) {
    Object.assign(seriesProps, {
      macd_series: {
        transform: `translate(0, ${graphHeight + showns * indicatorHeight})`,
      },
    });
    yMacdScale
      .domain(d3.extent(data, (d) => +d.macd?.macd))
      .range([indicatorHeight, 0]);
    var gYMacd = gEnter
      .append("g")
      .attr("class", "axis yMacd-axis")
      .merge(d3.select(".view").select(".yMacd-axis"));
    gYMacd
      .attr(
        "transform",
        `translate(${graphWidth},${graphHeight + showns * indicatorHeight})`
      )
      .call(d3.axisRight(yMacdScale));
    showns++;
  }
  function setYCciScale(data, gEnter) {
    Object.assign(seriesProps, {
      cci_series: {
        transform: `translate(0, ${graphHeight + showns * indicatorHeight})`,
      },
    });
    yCciScale
      .domain(d3.extent(data, (d) => +d.cci))
      .range([indicatorHeight, 0]);
    var gYCci = gEnter
      .append("g")
      .attr("class", "axis yCci-axis")
      .merge(d3.select(".view").select(".yCci-axis"));
    gYCci
      .attr(
        "transform",
        `translate(${graphWidth},${graphHeight + showns * indicatorHeight})`
      )
      .call(d3.axisRight(yCciScale));
    showns++;
  }

  // function getMacd(data) {
  //   const macdAlgorithm = macd()
  //     .fastPeriod(4)
  //     .slowPeriod(10)
  //     .signalPeriod(5)
  //     .value((d) => d.close);
  //   // compute the MACD
  //   const macdData = macdAlgorithm(data);

  //   // merge into a single series
  //   const mergedData = data.map((d, i) =>
  //     Object.assign({}, d, {
  //       macd: macdData[i],
  //     })
  //   );
  //   setYMacdScale(mergedData);
  //   return mergedData;
  // }
  return zoomChart;
};

/** 
 * if (!mSerie.node()) {
        mSerie = g.select(".chartBody").append("g").attr("class", key);
        // .merge(g.select(`.${key}`));
      }
 * 
    // chartBody
    //   .append("g")
    //   .attr("class", "series")
    //   .merge(g.select(".series"))
    //   .datum(data)
    //   .call(series);
    // chartBody
    //   .append("g")
    //   .attr("class", "volume-series")
    //   .attr("transform", `translate(0, ${(5 * graphHeight) / 6})`)
    //   .merge(g.select(".volume-series"))
    //   .datum(data)
    //   .call(volumeSeries);
 * 
   // zoomChart.addNewSeries = function (data) {
  //   var exte = d3.extent(data, (d) => d.date);
  //   xScale.domain([
  //     d3.timeDay.offset(exte[0], -1),
  //     d3.timeDay.offset(exte[1], 1),
  //   ]);
  //   yScale.domain([
  //     d3.min(data, function (d) {
  //       return d.low;
  //     }),
  //     d3.max(data, function (d) {
  //       return d.high;
  //     }),
  //   ]);
  //   var bollinger = bollingerSeries()
  //     .xScale(xScale)
  //     .yScale(yScale)
  //     .yValue("close")
  //     .movingAverage(20)
  //     .standardDeviations(2);

  //   var g = d3.selectAll("svg").select("g");
  //   let chartBody = g.select(".chartBody");

  //   chartBody
  //     .append("g")
  //     .attr("class", "newseries")
  //     .datum(data)
  //     .call(bollinger);
  // };

  // zoomChart.updateData = function (data) {
  //   var exte = d3.extent(data, (d) => d.date);
  //   xScale
  //     .domain([d3.timeDay.offset(exte[0], -1), d3.timeDay.offset(exte[1], 1)])
  //     .range([0, graphWidth]);
  //   yScale
  //     .domain([
  //       d3.min(data, function (d) {
  //         return d.low;
  //       }),
  //       d3.max(data, function (d) {
  //         return d.high;
  //       }),
  //     ])
  //     .range([graphHeight, 0]);

  //   series.xScale(xScale).yScale(yScale);
  //   volumeSeries.xScale(xScale).yScale(yVolumeScale);
  //   crosshairs.series(data).xScale(xScale).yScale(yScale);

  //   var g = d3.selectAll("svg").select("g");
  //   g.select(".x-axis").call(d3.axisBottom(xScale).tickSize(-graphHeight));
  //   g.select("y-axis").call(d3.axisLeft(yScale).tickSize(-graphWidth));
  //   g.select(".series").call(series);
  //   g.select(".volume_series").call(volumeSeries);
  // };

 */
