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
      var mazoom = gEnter
        .append("rect")
        .attr("class", "zoom")
        .attr("id", "rect")
        .attr("width", graphWidth)
        .attr("height", graphHeight)
        .style("fill", "none")
        .style("opacity", 0)
        .style("pointer-events", "all");
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
        .axisBottom()
        .scale(xScale)
        .tickFormat(function (d) {
          d = dates[d];
          hours = d.getHours();
          minutes = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
          amPM = hours < 13 ? "am" : "pm";
          return hours + ":" + minutes + amPM + " " + d.toLocaleDateString();
        })
        .tickSize(-graphHeight);

      var ymin = d3.min(data.map((r) => r.Low));
      var ymax = d3.max(data.map((r) => r.High));
      yScale = d3
        .scaleLinear()
        .domain([ymin, ymax])
        .range([graphHeight, 0])
        .nice();
      var yAxis = d3.axisLeft().scale(yScale).tickSize(-graphWidth);
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
      var label = chartBody
        .append("text")
        .attr("class", "label")
        .attr("x", 10)
        .attr("y", 10)
        .style("font-size", "10px");
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
        .merge(g.select(".candles"));
      let candles = gCandles.selectAll(".candle").data(data);
      candles
        .enter()
        .append("rect")
        .attr("class", "candle")
        .merge(candles)
        .attr("x", (d, i) => xScale(i) - xBand.bandwidth())
        .attr("id", function (d, i) {
          return "candle" + i;
        })
        .attr("y", (d) => yScale(Math.max(d.Open, d.Close)))
        .attr("width", xBand.bandwidth())
        .attr("height", (d) =>
          d.Open === d.Close
            ? 1
            : yScale(Math.min(d.Open, d.Close)) -
              yScale(Math.max(d.Open, d.Close))
        )
        .attr("fill", (d) =>
          d.Open === d.Close ? "silver" : d.Open > d.Close ? "red" : "green"
        );
      let gStems = chartBody
        .append("g")
        .attr("class", "lines")
        .merge(g.select(".lines"));
      let stems = gStems.selectAll(".stem").data(data);
      stems
        .enter()
        .append("line")
        .attr("class", "stem")
        .merge(stems)
        .attr("x1", (d, i) => xScale(i) - xBand.bandwidth() / 2)
        .attr("x2", (d, i) => xScale(i) - xBand.bandwidth() / 2)
        .attr("y1", (d) => yScale(d.High))
        .attr("y2", (d) => yScale(d.Low))
        .attr("stroke", (d) =>
          d.Open === d.Close ? "silver" : d.Open > d.Close ? "red" : "green"
        )
        .attr("stroke-width", "1px");

      chartBody
        .append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", graphWidth)
        .attr("height", graphHeight)
        .style("fill", "none")
        .style("pointer-events", "all");

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

      let showLabel = function (e, d) {
        const maj = (+d.Close - +d.Open).toFixed(2);
        const yaj = maj < 0 ? "#bf4a48" : "#1d7e75";
        const mlabel = d3.select(".label");
        mlabel.select("#date").text("Date: " + `${d.Date.toDateString()}`);
        mlabel.select("#open").text("Open: " + `${(+d.Open).toFixed(2)}`);
        mlabel.select("#close").text("Close: " + `${(+d.Close).toFixed(2)}`);
        mlabel.select("#high").text("High: " + `${(+d.High).toFixed(2)}`);
        mlabel.select("#low").text("Low: " + `${(+d.Low).toFixed(2)}`);
        mlabel.select("#volume").text("Volume: " + `${(+d.Volume).toFixed(2)}`);
        mlabel.select("#diff").text("Diff: " + `${maj}`);
        mlabel.style("fill", yaj);
        const el = d3.selectAll(".selected").nodes();
        if (el.length > 0) {
          el.map((ff) => {
            d3.select(ff).style("fill-opacity", "0");
            ff.classList.remove("selected");
          });
        }

        d3.select(this).style("fill-opacity", ".1");
        d3.select(this).classed("selected", true);
        d3.select(".crosshair").select("rect").style("opacity", ".1");
      };

      let hideTooltip = function (e) {
        d3.select(".crosshair").selectAll(".crosstext").attr("fill-opacity", 0);
        if (e?.target.id.substr(-2) === e?.relatedTarget?.id?.substr(-2)) {
          return;
        }
        d3.select(this).style("fill-opacity", 0);
        d3.select(".crosshair").select("rect").style("opacity", "0");

        // tooltip.transition().duration(200).style("opacity", 0);
      };
      const createCrosshair = function (id, d) {
        let hair = d3.select(".crosshair").select("rect");
        let mmax = Math.max(d.Open, d.Close);
        let mmin = Math.min(d.Open, d.Close);
        hair !== null && hair.attr("id") && hair.attr("id").substring(11) === id
          ? hair.style("opacity", ".1")
          : hair
              .attr("id", "h_crosshair" + id)
              .attr("x", (d, i) => xScale(i) - xBand.bandwidth())
              .attr("y", () => yScale(mmax))
              .attr("width", graphWidth + margin.left + margin.right)
              .attr("height", () =>
                d.Open === d.Close ? 1 : yScale(mmin) - yScale(mmax)
              )
              .attr("minx", mmin)
              .attr("maxx", mmax)
              .style("opacity", ".1");
        d3.select(".crosshair")
          .append("text")
          .attr("class", "crosstext")
          .attr("x", (d, i) => -0)
          .attr("y", () => yScale(mmax) + (yScale(mmin) - yScale(mmax)) / 2)
          .attr("dy", "+.25em")
          .attr("text-anchor", "start")
          .style("fill", d.Open < d.Close ? "green" : "red")
          .text(() => (d.Close - d.Open).toFixed(1));
      };

      var crossHair = chartBody.append("g").attr("class", "crosshair");
      crossHair
        .append("rect")
        .attr("id", "h_crosshair") // horizontal cross hair
        .attr("x", 0)
        .attr("y", 0)
        .attr("height", 0)
        .attr("width", 0)
        .style("stroke", "black")
        .style("opacity", "0");

      let gBands = chartBody
        .append("g")
        .attr("class", "bands")
        .merge(g.select(".bands"));

      var bands = gBands.selectAll(".band").data(data);

      bands
        .enter()
        .append("rect")
        .attr("class", "band")
        .merge(bands)
        .attr("x", (d, i) => xScale(i) - xBand.bandwidth())
        .attr("y", 0)
        .attr("height", graphHeight)
        .attr("width", xBand.bandwidth())
        .attr("id", function (d, i) {
          return "band" + i;
        })
        .style("stroke-width", Math.floor(xBand.bandwidth()))
        .attr("fill-opacity", "0")
        .on("mouseover", showLabel)
        .on("mouseleave", hideTooltip)
        .on("mousemove", function (event, d) {
          const id = d3.select(this).attr("id");
          createCrosshair(id, d);
        });

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

      gEnter.call(zoom);

      if (t) {
        zoomed("", t);
        zoomend("", t);
      } else if (!chartShape) chartShape = chartBody.node().getBoundingClientRect();

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
        let xScaleZ = t.rescaleX(xScale);

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

        gCandles
          .selectAll(".candle")
          .attr("x", (d, i) => xScaleZ(i) - (xBand.bandwidth() * t.k) / 2)
          .attr("width", xBand.bandwidth() * t.k);
        gStems
          .selectAll(".stem")
          .attr(
            "x1",
            (d, i) =>
              xScaleZ(i) - xBand.bandwidth() / 2 + xBand.bandwidth() * 0.5
          );
        gStems
          .selectAll(".stem")
          .attr(
            "x2",
            (d, i) =>
              xScaleZ(i) - xBand.bandwidth() / 2 + xBand.bandwidth() * 0.5
          )
          .attr("stroke-width", t.k > 3 ? 3 : t.k);
        gBands
          .selectAll("rect")
          .attr("x", (d, i) => xScaleZ(i) - (xBand.bandwidth() * t.k) / 2)
          .attr("width", xBand.bandwidth() * t.k);
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
        let xScaleZ = t.rescaleX(xScale);
        clearTimeout(resizeTimer);
        // resizeTimer = setTimeout(function () {
        var xmin = new Date(xDateScale(Math.floor(xScaleZ.domain()[0]))),
          xmax = new Date(xDateScale(Math.floor(xScaleZ.domain()[1]))),
          filtered = data.filter((d) => d.Date >= xmin && d.Date <= xmax),
          minP = +d3.min(filtered, (d) => d.Low),
          maxP = +d3.max(filtered, (d) => d.High),
          buffer = Math.floor((maxP - minP) * 0.1);

        yScale.domain([minP - buffer, maxP + buffer]);
        gCandles
          .selectAll(".candle")
          // .transition()
          // .duration(80)
          .attr("y", (d) => {
            // console.log(
            //   JSON.stringify(d),
            //   "yScale --> ",
            //   yScale(Math.max(d.Open, d.Close)),
            //   "t --> ",
            //   t
            // );
            return yScale(Math.max(d.Open, d.Close));
          })
          .attr("height", (d) =>
            d.Open === d.Close
              ? 1
              : yScale(Math.min(d.Open, d.Close)) -
                yScale(Math.max(d.Open, d.Close))
          );
        let ah = yScale(d3.select(".crosshair").select("rect").attr("minx"));
        let ay = yScale(d3.select(".crosshair").select("rect").attr("maxx"));
        d3.select(".crosshair")
          .select("rect")
          .transition()
          .duration(80)
          .attr("y", ay)
          .attr("height", ah - ay > 1 ? ah - ay : 1);
        gStems
          .selectAll(".stem")
          // .transition()
          // .duration(80)
          .attr("y1", (d) => yScale(d.High))
          .attr("y2", (d) => yScale(d.Low));

        // bands.transition().duration(800).selectAll("rect");
        d3.select(".y-axis")
          // .transition()
          // .duration(80)
          .call(d3.axisLeft().scale(yScale).tickSize(-graphWidth));
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
