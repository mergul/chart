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
    xDateScale = d3.scaleQuantize(),
    xBand = d3.scaleBand(),
    xScale = d3.scaleLinear(),
    yScale = d3.scaleLinear(),
    xRange = [0, graphWidth],
    xScaleZ,
    chartShape,
    dates,
    aData;

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
      svg.merge(svgEnter).attr("viewBox", [0, 0, width, height]);

      // Update the inner dimensions.
      var g = svg
        .merge(svgEnter)
        .select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      dates = data.map((item) => item.Date);
      aData = data;
      // var xmax = d3.max(data.map((r) => r.Date.getTime()));
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

      let yVolumeScale = d3
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
        .attr("height", (d) => graphHeight / 6 - yVolumeScale(d.Volume))
        .attr("x", (d, i) => xScale(i) - xBand.bandwidth())
        .attr("y", (d) => yVolumeScale(d.Volume))
        .attr("fill", (d) =>
          d.Open === d.Close
            ? "silver"
            : d.Open > d.Close
            ? "#f7a8a7"
            : "#92d2cc"
        )
        .attr("fill-opacity", "1");

      const yVolumeAxis = d3
        .axisLeft(yVolumeScale)
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

      // var resizeTimer;
      var zoom = d3
        .zoom()
        .scaleExtent([1, 100])
        .translateExtent(extent)
        .extent(extent)
        .on("zoom", xzooming)
        .on("zoom.end", yzooming);

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
            mwidth = xBand.bandwidth() * t.k;
          } else {
            mx = xScale(index) - xmBand.bandwidth();
            mwidth = xBand.bandwidth();
          }
          crosshair
            .select("#crosshairX")
            .attr("x", mx)
            .attr("y", 0)
            .attr("width", mwidth / 2)
            .attr("height", graphHeight)
            .style("opacity", 0.1);
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
      gStems.exit().remove();
      gSmalled.exit().remove();

      // g.call(zoom);
      function xzooming(event) {
        zoomed(event, "");
      }
      function yzooming(event) {
        zoomend(event, "");
      }
    });
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

    d3.select(".candles")
      .selectAll(".candle")
      .attr("x", (d, i) => xScaleZ(i) - (xBand.bandwidth() * t.k) / 2)
      .attr("width", xBand.bandwidth() * t.k);
    d3.select(".lines")
      .selectAll(".stem")
      .attr(
        "x1",
        (d, i) => xScaleZ(i) - xBand.bandwidth() / 2 + xBand.bandwidth() * 0.5
      );
    d3.select(".lines")
      .selectAll(".stem")
      .attr(
        "x2",
        (d, i) => xScaleZ(i) - xBand.bandwidth() / 2 + xBand.bandwidth() * 0.5
      )
      .attr("stroke-width", t.k > 3 ? 3 : t.k);
    d3.select(".smalld")
      .selectAll("rect")
      .attr("x", (d, i) => xScaleZ(i) - (xBand.bandwidth() * t.k) / 2)
      .attr("width", xBand.bandwidth() * t.k);

    hideTicksWithoutLabel();

    d3.select(".x-axis").selectAll(".tick text").call(wrap, xBand.bandwidth());
  }
  function zoomend(event, ext) {
    ext === "" ? (t = event.transform) : (t = ext);
    // var t = event.transform;
    if (t.k == 1 && t.x == 0 && t.y == 0) return;
    xScaleZ = t.rescaleX(xScale);
    // clearTimeout(resizeTimer);
    // resizeTimer = setTimeout(function () {
    var xmin = new Date(xDateScale(Math.floor(xScaleZ.domain()[0]))),
      xmax = new Date(xDateScale(Math.floor(xScaleZ.domain()[1]))),
      filtered = aData.filter((d) => d.Date >= xmin && d.Date <= xmax),
      minP = +d3.min(filtered, (d) => d.Low),
      maxP = +d3.max(filtered, (d) => d.High),
      buffer = Math.floor((maxP - minP) * 0.1);

    yScale.domain([minP - buffer, maxP + buffer]);
    d3.select(".candles")
      .selectAll(".candle")
      .attr("y", (d) => yScale(Math.max(d.Open, d.Close)))
      .attr("height", (d) =>
        d.Open === d.Close
          ? 1
          : yScale(Math.min(d.Open, d.Close)) -
            yScale(Math.max(d.Open, d.Close))
      );
    d3.select(".lines")
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
