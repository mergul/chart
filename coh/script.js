function ZoomableCandleChart() {
  let width = 920,
    height = 460,
    margin = { top: 25, right: 25, bottom: 50, left: 50 },
    graphWidth = width - margin.left - margin.right,
    graphHeight = height - margin.top - margin.bottom,
    yValue = function (d) {
      return d[1];
    },
    xValue = function (d) {
      return d[0];
    },
    t,
    // prices = [],
    // mmax = 0,
    // dates = [],
    xDateScale = d3.scaleQuantize(),
    xBand = d3.scaleBand(),
    xScale = d3.scaleLinear(),
    yScale = d3.scaleLinear(),
    xRange = [0, graphWidth],
    yRange = [graphHeight, 0],
    xScaleZ,
    chartShape;

  function chart(selection) {
    selection.each(function (data) {
      // Select the svg element, if it exists.
      var svg = d3.select(this).selectAll("svg").data([data]);

      // Otherwise, create the skeletal chart.
      var svgEnter = svg.enter().append("svg");
      // Otherwise, create the skeletal chart.
      var gEnter = svgEnter.append("g").attr("class", "view");

      var gX = gEnter.append("g").attr("class", "axis x-axis");
      var gY = gEnter.append("g").attr("class", "axis y-axis");

      var chartBody = gEnter
        .append("g")
        .attr("class", "chartBody")
        .attr("clip-path", "url(#clip)");
      // Update the outer dimensions.
      svg.merge(svgEnter).attr("viewBox", [0, 0, width, height]);

      // Update the inner dimensions.
      var g = svg
        .merge(svgEnter)
        .select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var dates = data.map((item) => item.Date);
      // console.log(JSON.stringify(dates));
      var xmax = d3.max(data.map((r) => r.Date.getTime()));
      xScale = d3
        .scaleLinear()
        .domain([-1, dates.length])
        .range([0, graphWidth]);
      xDateScale = d3.scaleQuantize().domain([0, dates.length]).range(dates);
      xBand = d3
        .scaleBand()
        .domain(d3.range(-1, dates.length))
        .range([0, graphWidth])
        .padding(0.3);
      var xAxis = d3
        .axisBottom(xScale)
        .tickFormat(function (d) {
          d = dates[d];
          return d ? d.toLocaleDateString() : "1/1/2000";
        })
        .tickSize(-graphHeight);

      var ymin = d3.min(data.map((r) => r.Low));
      var ymax = d3.max(data.map((r) => r.High));
      yScale = d3
        .scaleLog()
        .domain([d3.min(data, (d) => d.Low), d3.max(data, (d) => d.High)])
        .rangeRound([height - margin.bottom, margin.top]);

      var yAxis = d3
        .axisLeft(yScale)
        .tickFormat(d3.format("$~f"))
        .tickValues(d3.scaleLinear().domain(yScale.domain()).ticks());

      gX.attr("transform", "translate(0," + graphHeight + ")")
        .merge(svg.select(".x-axis"))
        .call(xAxis);
      gY.merge(svg.select(".y-axis")).call(yAxis);
      gX.selectAll(".tick text").style("font-size", "10px");
      gX.selectAll(".tick line").attr("opacity", ".1");
      gX.selectAll("path.domain").attr("opacity", ".1");
      gY.selectAll(".tick text").style("font-size", "10px");
      gY.selectAll(".tick line").attr("opacity", ".1");
      gY.selectAll("path.domain").attr("opacity", ".1");
      let label = chartBody
        .append("text")
        .attr("class", "label")
        .attr("x", 12)
        .attr("y", 12)
        .style("font-size", "10px");
      label.append("tspan").text("AAPL : ");
      label.append("tspan").attr("id", "date");
      label.append("tspan").attr("id", "open");
      label.append("tspan").attr("id", "high");
      label.append("tspan").attr("id", "low");
      label.append("tspan").attr("id", "close");
      label.append("tspan").attr("id", "volume");
      label.append("tspan").attr("id", "diff");
      let gCandles = chartBody
        .append("g")
        .attr("class", "candles")
        .attr("stroke-width", 2)
        .attr("fill", "none")
        .merge(g.select(".candles"));
      let candles = gCandles.selectAll(".candle").data(data);
      candles
        .enter()
        .append("path")
        .attr("class", "candle")
        .merge(candles)
        .attr(
          "d",
          (d, i) => `
        M${xScale(i) - xBand.bandwidth() / 2},${yScale(d.Low)}V${yScale(d.High)}
        M${xScale(i) - xBand.bandwidth() / 2},${yScale(d.Open)}h-4
        M${xScale(i) - xBand.bandwidth() / 2},${yScale(d.Close)}h4
      `
        )
        .attr("stroke", (d) =>
          d.Open > d.Close
            ? d3.schemeSet1[0]
            : d.Close > d.Open
            ? d3.schemeSet1[2]
            : d3.schemeSet1[8]
        );

      gEnter
        .append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", graphWidth)
        .attr("height", graphHeight)
        .style("fill", "none");

      let yVolume = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => +d.Volume)])
        .nice()
        .range([graphHeight / 6, 0]);
      var gSmalled = chartBody
        .append("g")
        .attr("class", "smalld")
        .attr("transform", `translate(0, ${(5 * graphHeight) / 6})`)
        .merge(g.select(".smalld"));
      const rects = gSmalled.selectAll(".bar-rect").data(data);
      rects
        .enter()
        .append("rect")
        .attr("class", "bar-rect")
        .merge(rects)
        .attr("width", xBand.bandwidth())
        .attr("height", (d) => graphHeight / 6 - yVolume(d.Volume))
        .attr("x", (d, i) => xScale(i) - xBand.bandwidth())
        .attr("y", (d) => yVolume(d.Volume))
        .attr("fill", (d) =>
          d.Open === d.Close
            ? "silver"
            : d.Open > d.Close
            ? "#f7a8a7"
            : "#92d2cc"
        )
        .attr("fill-opacity", "1");

      const yVolumeAxis = d3
        .axisLeft(yVolume)
        .scale(yVolume)
        .tickFormat((d) => `${(d / 1000000).toFixed(1)}M`);

      const gYVolume = chartBody
        .append("g")
        .attr("class", "yVolume-axis")
        .attr("transform", `translate(${graphWidth}, ${(5 * graphHeight) / 6})`)
        .merge(g.select(".yVolume-axis"))
        .call(yVolumeAxis);
      gYVolume
        .selectAll("text")
        .attr("fill", "orange")
        .attr("font-size", "8px");

      let showLabel = (d) => {
        const maj = (d.Close - d.Open).toFixed(2);
        const yaj = maj < 0 ? "#bf4a48" : "#1d7e75";
        label.select("#date").text("Date: " + `${d.Date.toDateString()}`);
        label.select("#open").text("Open: " + `${d.Open.toFixed(2)}`);
        label.select("#close").text("Close: " + `${d.Close.toFixed(2)}`);
        label.select("#high").text("High: " + `${d.High.toFixed(2)}`);
        label.select("#low").text("Low: " + `${d.Low.toFixed(2)}`);
        label.select("#volume").text("Volume: " + `${d.Volume.toFixed(2)}`);
        label.select("#diff").text("Diff: " + `${maj}`);
        label.style("fill", yaj);
      };

      var crosshair = gEnter.append("g").attr("class", "crosshair");

      // create horizontal line
      crosshair.append("rect").attr("id", "crosshairX");
      // crosshair.append("rect").attr("id", "crossline");
      // create vertical line
      crosshair.append("rect").attr("id", "crosshairY");
      crosshair.append("text").attr("class", "crosstext");

      const extent = [
        [0, 0],
        [graphWidth, graphHeight],
      ];

      var resizeTimer;
      var zoom = d3
        .zoom()
        .scaleExtent([1, 100])
        .translateExtent(extent)
        .extent(extent)
        // .on("zoom", updateToZoom);
        .on("zoom", xzooming)
        .on("zoom.end", yzooming);
      // mazoom.call(zoom);
      gEnter
        .append("rect")
        .attr("class", "zoom")
        .attr("id", "rect")
        .attr("width", graphWidth)
        .attr("height", graphHeight)
        .style("fill", "none")
        .style("opacity", 0)
        .style("pointer-events", "all")
        .call(zoom)
        .on("mouseover", () => {
          crosshair.style("display", null);
        })
        .on("mouseleave", () => {
          crosshair.style("display", "none");
        })
        .on("mousemove", function (event) {
          chartShape = chartBody.node().getBoundingClientRect();
          let xmBand = d3
            .scaleBand()
            .domain(d3.range(-1, dates.length))
            .range([chartShape.left, chartShape.right])
            .padding(0.4);
          let xMoveScales = d3
            .scaleLinear()
            .domain([chartShape.left, chartShape.right])
            .range(xRange);
          let index;
          const dd = data.find((d) => {
            index = xScale.invert(xMoveScales(event.x));
            return d.Date === xDateScale(index);
          });
          let mx, mwidth;
          if (t && t.k !== 1) {
            mx = xScaleZ(index) - xmBand.bandwidth() / 2;
            mwidth = xmBand.bandwidth();
          } else {
            mx = xScale(index) - xmBand.bandwidth();
            mwidth = xmBand.bandwidth();
          }
          crosshair
            .select("#crosshairX")
            .attr("x", mx)
            .attr("y", 0)
            .attr("width", 1)
            .attr("height", graphHeight)
            .style("opacity", 0.5);
          let mmax = Math.max(dd.Open, dd.Close);
          let mmin = Math.min(dd.Open, dd.Close);
          crosshair
            .select("#crosshairY")
            .attr("x", 0)
            .attr("y", yScale(mmax))
            .attr("width", graphWidth)
            .attr(
              "height",
              dd.Open === dd.Close ? 1 : yScale(mmin) - yScale(mmax)
            )
            .attr("minx", mmin)
            .attr("maxx", mmax)
            .style("opacity", ".1");
          crosshair
            .select(".crosstext")
            .attr("x", -30)
            .attr("y", yScale(mmax) + (yScale(mmin) - yScale(mmax)) / 2)
            .attr("dy", "+.25em")
            .attr("text-anchor", "start")
            .style("fill", dd.Open < dd.Close ? "green" : "red")
            .text((dd.Close - dd.Open).toFixed(1));
          showLabel(dd);
        });

      if (t) {
        zoomed("", t);
        zoomend("", t);
      } else if (!chartShape) chartShape = chartBody.node().getBoundingClientRect();
      chartBody.exit().remove();
      gCandles.exit().remove();
      gSmalled.exit().remove();
      // g.call(zoom);
      function xzooming(event) {
        zoomed(event, "");
      }
      function yzooming(event) {
        zoomend(event, "");
      }

      function zoomed(event, ext) {
        ext === "" ? (t = event.transform) : (t = ext);
        // var t = event.transform;
        if (t.k == 1 && t.x == 0 && t.y == 0) return;
        xScaleZ = t.rescaleX(xScale);

        let hideTicksWithoutLabel = function () {
          d3.selectAll(".xAxis .tick text").each(function (d) {
            if (this.innerHTML === "") {
              this.parentNode.style.display = "none";
            }
          });
        };

        d3.select(".x-axis").call(
          d3
            .axisBottom(xScaleZ)
            .tickFormat((d, e, target) => {
              if (Number.isInteger(d) && d >= 0 && d <= dates.length - 1) {
                d = dates[d];
                hours = d?.getHours();
                minutes = (d?.getMinutes() < 10 ? "0" : "") + d?.getMinutes();
                amPM = hours < 13 ? "am" : "pm";
                return (
                  hours + ":" + minutes + amPM //+ " " + d.toLocaleDateString()
                );
              }
            })
            .tickSize(-graphHeight)
        );
        xRange = xScaleZ.range();
        d3.select(".x-axis").selectAll(".tick text").style("font-size", "10px");
        d3.select(".x-axis").selectAll(".tick line").attr("opacity", ".1");
        d3.select(".x-axis").selectAll("path.domain").attr("opacity", ".1");

        gCandles.selectAll(".candle").attr(
          "d",
          (d, i) => `
        M${xScaleZ(i) - (xBand.bandwidth() * t.k) / 2},${yScale(
            d.Low
          )}V${yScale(d.High)}
        M${xScaleZ(i) - (xBand.bandwidth() * t.k) / 2},${yScale(d.Open)}h-4
        M${xScaleZ(i) - (xBand.bandwidth() * t.k) / 2},${yScale(d.Close)}h4
      `
        );

        gSmalled
          .selectAll("rect")
          .attr("x", (d, i) => xScaleZ(i) - (xBand.bandwidth() * t.k) / 2)
          .attr("width", xBand.bandwidth() * t.k);

        hideTicksWithoutLabel();

        d3.select(".x-axis")
          .selectAll(".tick text")
          .call(wrap, xBand.bandwidth());
      }
      function zoomend(event, ext) {
        ext === "" ? (t = event.transform) : (t = ext);
        // var t = event.transform;
        if (t.k == 1 && t.x == 0 && t.y == 0) return;
        xScaleZ = t.rescaleX(xScale);
        clearTimeout(resizeTimer);
        // resizeTimer = setTimeout(function () {
        var xmin = new Date(xDateScale(Math.floor(xScaleZ.domain()[0]))),
          xmax = new Date(xDateScale(Math.floor(xScaleZ.domain()[1]))),
          filtered = data.filter((d) => d.Date >= xmin && d.Date <= xmax),
          minP = +d3.min(filtered, (d) => d.Low),
          maxP = +d3.max(filtered, (d) => d.High),
          buffer = Math.floor((maxP - minP) * 0.1);

        yScale.domain([minP - buffer, maxP + buffer]);
        gCandles.selectAll(".candle").attr(
          "d",
          (d, i) => `
        M${xScaleZ(i) - (xBand.bandwidth() * t.k) / 2},${yScale(
            d.Low
          )}V${yScale(d.High)}
        M${xScaleZ(i) - (xBand.bandwidth() * t.k) / 2},${yScale(d.Open)}h-4
        M${xScaleZ(i) - (xBand.bandwidth() * t.k) / 2},${yScale(d.Close)}h4
      `
        );
        d3.select(".y-axis").call(
          d3.axisLeft().scale(yScale).tickSize(-graphWidth)
        );
        yRange = yScale.range();
        d3.select(".y-axis").selectAll(".tick text").style("font-size", "10px");
        d3.select(".y-axis").selectAll(".tick line").attr("opacity", ".1");
        d3.select(".y-axis").selectAll("path.domain").attr("opacity", ".1");
        // }, 40);
      }
    });
  }

  function wrap(text, width) {
    text.each(function () {
      var text = d3.select(this),
        words = text.text().split(/\s+/).reverse(),
        word,
        line = [],
        lineNumber = 0,
        lineHeight = 1.1, // ems
        y = text.attr("y"),
        dy = parseFloat(text.attr("dy")),
        tspan = text
          .text(null)
          .append("tspan")
          .attr("x", 0)
          .attr("y", y)
          .attr("dy", dy + "em");
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          tspan = text
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", ++lineNumber * lineHeight + dy + "em")
            .text(word);
        }
      }
    });
  }
  chart.width = function (value) {
    if (!arguments.length) return width;
    width = value;
    return chart;
  };

  chart.height = function (value) {
    if (!arguments.length) return height;
    height = value;
    return chart;
  };

  chart.margin = function (value) {
    if (!arguments.length) return margin;
    margin = value;
    return chart;
  };

  chart.graphWidth = function (value) {
    if (!arguments.length) return graphWidth;
    graphWidth = value;
    return chart;
  };

  chart.graphHeight = function (value) {
    if (!arguments.length) return graphHeight;
    graphHeight = value;
    return chart;
  };

  chart.x = function (_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };

  chart.y = function (_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };

  chart.t = function (value) {
    if (!arguments.length) return t;
    t = value;
    return chart;
  };

  chart.xScale = function (value) {
    if (!arguments.length) return xScale;
    xScale = value;
    return chart;
  };

  chart.yScale = function (value) {
    if (!arguments.length) return yScale;
    yScale = value;
    return chart;
  };

  return chart;
}

// crosshair
//   .select("#crosshairX")
//   .attr("x1", xMoveScales(event.x))
//   .attr("y1", yScale(yScale.domain()[0]))
//   .attr("x2", xMoveScales(event.x))
//   .attr("y2", yScale(yScale.domain()[1]))
//   .attr("stroke-width", "1px")
//   .attr("stroke", "black");
// crosshair
//   .select("#crosshairY")
//   .attr("x1", xScale(xScale.domain()[0]))
//   .attr("y1", yMoveScales(event.y))
//   .attr("x2", xScale(xScale.domain()[1]))
//   .attr("y2", yMoveScales(event.y))
//   .attr("stroke-width", "1px")
//   .attr("stroke", "red");
