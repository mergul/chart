function drawChart() {
  d3.csv("data.csv")
    .then(function (data) {
      return data.map(function (d) {
        return {
          Date: new Date(d.Date),
          Open: +d.Open,
          High: +d.High,
          Low: +d.Low,
          Close: +d.Close,
          Volume: +d.Volume,
        };
      });
    })
    .then(function (prices) {
      const margin = { top: 25, right: 25, bottom: 50, left: 50 },
        w = 920 - margin.left - margin.right,
        h = 460 - margin.top - margin.bottom;

      var gGraph = d3
        .select("#container")
        .append("svg")
        .attr("viewBox", [
          0,
          0,
          w + margin.left + margin.right,
          h + margin.top + margin.bottom,
        ])
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      let dates = prices.map((item) => item.Date);

      var xmax = d3.max(prices.map((r) => r.Date.getTime()));
      var xScale = d3.scaleLinear().domain([-1, dates.length]).range([0, w]);
      var xDateScale = d3
        .scaleQuantize()
        .domain([0, dates.length])
        .range(dates);
      let xBand = d3
        .scaleBand()
        .domain(d3.range(-1, dates.length))
        .range([0, w])
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
        .tickSize(-h);

      var gX = gGraph
        .append("g")
        .attr("class", "axis x-axis") //Assign "axis" class
        .attr("transform", "translate(0," + h + ")")
        .call(xAxis);

      gX.selectAll(".tick text").call(wrap, xBand.bandwidth());
      gX.selectAll(".tick text").style("font-size", "10px");
      gX.selectAll(".tick line").attr("opacity", ".1");
      gX.selectAll("path.domain").attr("opacity", ".1");
      var ymin = d3.min(prices.map((r) => r.Low));
      var ymax = d3.max(prices.map((r) => r.High));
      var yScale = d3.scaleLinear().domain([ymin, ymax]).range([h, 0]).nice();
      var yAxis = d3.axisLeft().scale(yScale).tickSize(-w);

      var gY = gGraph.append("g").attr("class", "axis y-axis").call(yAxis);
      gY.selectAll(".tick line").attr("opacity", ".1");
      gY.selectAll("path.domain").attr("opacity", ".1");
      gY.selectAll(".tick text").style("font-size", "10px");

      gGraph
        .append("rect")
        .attr("class", "zoom")
        .attr("id", "rect")
        .attr("width", w)
        .attr("height", h)
        .style("fill", "none")
        .style("opacity", 0)
        .style("pointer-events", "all");

      var chartBody = gGraph
        .append("g")
        .attr("class", "chartBody")
        .attr("clip-path", "url(#clip)");

      // draw rectangles
      let candles = chartBody
        .selectAll(".candle")
        .data(prices)
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(i) - xBand.bandwidth())
        .attr("class", "candle")
        .attr("id", function (d, i) {
          return "candle" + i;
        })
        .attr("y", (d) => yScale(Math.max(d.Open, d.Close)))
        .attr("width", xBand.bandwidth())
        .attr("height", (d) =>
          d.Open === d.Close
            ? 10
            : yScale(Math.min(d.Open, d.Close)) -
              yScale(Math.max(d.Open, d.Close))
        )
        .attr("fill", (d) =>
          d.Open === d.Close ? "silver" : d.Open > d.Close ? "red" : "green"
        );
      // draw high and low
      let stems = chartBody
        .selectAll("g.line")
        .data(prices)
        .enter()
        .append("line")
        .attr("class", "stem")
        .attr("x1", (d, i) => xScale(i) - xBand.bandwidth() / 2)
        .attr("x2", (d, i) => xScale(i) - xBand.bandwidth() / 2)
        .attr("y1", (d) => yScale(d.High))
        .attr("y2", (d) => yScale(d.Low))
        .attr("stroke", (d) =>
          d.Open === d.Close ? "white" : d.Open > d.Close ? "red" : "green"
        );

      gGraph
        .append("defs")
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", w)
        .attr("height", h)
        .style("fill", "none")
        .style("pointer-events", "all");

      let tooltip = d3.select("#tooltip");

      let showTooltip = function (e, d) {
        const el = d3.selectAll(".selected").nodes();
        if (el.length > 0) {
          el.map((ff) => {
            d3.select(ff).style("fill-opacity", "0");
            ff.classList.remove("selected");
          });
        }

        d3.select(this).style("fill-opacity", ".1");
        d3.select(this).classed("selected", true);
        const childs = tooltip.selectAll("span").nodes();
        tooltip.transition().duration(200);
        tooltip.style("opacity", 1);
        childs.forEach((element, i) => {
          switch (i) {
            case 0:
              element.innerHTML = "Date: " + d.Date.toDateString();
              break;
            case 1:
              element.innerHTML = "Open: " + (1 * d.Open).toFixed(2);
              element.style.color = d.Open > d.Close ? "#bf4a48" : "#1d7e75";
              break;
            case 2:
              element.innerHTML = "High: " + (1 * d.High).toFixed(2);
              element.style.color = d.Open > d.Close ? "#bf4a48" : "#1d7e75";
              break;
            case 3:
              element.innerHTML = "Low: " + (1 * d.Low).toFixed(2);
              element.style.color = d.Open > d.Close ? "#bf4a48" : "#1d7e75";
              break;
            case 4:
              element.innerHTML =
                "Close: " +
                (1 * d.Close).toFixed(2) +
                " " +
                (d.Close - d.Open).toFixed(2) +
                " (" +
                ((100 * (d.Close - d.Open)) / d.Open).toFixed(2) +
                "% )";
              element.style.color = d.Open > d.Close ? "#bf4a48" : "#1d7e75";
              break;
            case 5:
              element.innerHTML = "Volume: " + (1 * d.Volume).toFixed(2);
              element.style.color = d.Open > d.Close ? "#bf4a48" : "#1d7e75";
              break;
            default:
              break;
          }
        });
        d3.select(".crosshair").select("rect").style("opacity", ".1");
      };
      let moveTooltip = function () {
        tooltip
          .style("left", d3.mouse(this)[0] + 30 + "px")
          .style("top", d3.mouse(this)[1] + 30 + "px");
      };
      let hideTooltip = function (e) {
        crossHair.selectAll(".crosstext").attr("fill-opacity", 0);
        if (e?.target.id.substr(-2) === e?.relatedTarget?.id?.substr(-2)) {
          return;
        }
        d3.select(this).style("fill-opacity", 0);
        crossHair.select("rect").style("opacity", "0");

        // tooltip.transition().duration(200).style("opacity", 0);
      };
      const createCrosshair = function (xCoord, id, d) {
        let hair = crossHair.select("rect");
        let mmax = Math.max(d.Open, d.Close);
        let mmin = Math.min(d.Open, d.Close);
        hair.attr("id").substring(11) === id
          ? hair.style("opacity", ".1")
          : hair
              .attr("id", "h_crosshair" + id)
              .attr("x", (d, i) => xScale(i) - xBand.bandwidth())
              .attr("y", () => yScale(mmax))
              .attr("width", w + margin.left + margin.right)
              .attr("height", () =>
                d.Open === d.Close ? 1 : yScale(mmin) - yScale(mmax)
              )
              .attr("minx", mmin)
              .attr("maxx", mmax)
              .style("opacity", ".1");
        crossHair
          .append("text")
          .attr("class", "crosstext")
          .attr("x", (d, i) => -0)
          .attr("y", () => yScale(mmax) + (yScale(mmin) - yScale(mmax)) / 2)
          .attr("dy", "+.25em")
          .attr("text-anchor", "start")
          .style("fill", d.Open < d.Close ? "green" : "red")
          .text(() => (d.Close - d.Open).toFixed(1));
      };

      var mh = h / 6;
      var smalled = chartBody
        .append("g")
        .attr("width", w)
        .attr("height", mh)
        .classed("volume", true)
        .attr("transform", `translate(0, ${5 * mh})`);

      let yVolume = d3
        .scaleLinear()
        .domain([0, d3.max(prices, (d) => +d.Volume)])
        .nice()
        .range([mh, 0]);

      const rects = smalled.selectAll("rect").data(prices);

      rects
        .enter()
        .append("rect")
        .attr("class", "bar-rect")
        .attr("width", xBand.bandwidth())
        .attr("height", (d) => mh - yVolume(d.Volume))
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

      const gYVolume = smalled
        .append("g")
        .attr("class", "yVolume-axis")
        .attr("fill", "blue")
        .attr("transform", `translate(${w}, 0)`)
        .call(yVolumeAxis);
      gYVolume.selectAll("text").attr("fill", "blue").attr("font-size", "8px");
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

      var bands = chartBody
        .selectAll(".bands")
        .data([prices])
        .enter()
        .append("g")
        .attr("class", "bands");

      bands
        .selectAll("rect")
        .data(function (d) {
          return d;
        })
        .enter()
        .append("rect")
        .attr("x", (d, i) => xScale(i) - xBand.bandwidth())
        .attr("y", 0)
        .attr("height", h)
        .attr("width", xBand.bandwidth())
        .attr("id", function (d, i) {
          return "band" + i;
        })
        .style("stroke-width", Math.floor(xBand.bandwidth()))
        .attr("fill-opacity", "0")
        .on("mouseover", showTooltip)
        .on("mouseleave", hideTooltip)
        .on("mousemove", function (event, d) {
          const id = d3.select(this).attr("id");

          var xCoord = event.x,
            yCoord = event.y;
          createCrosshair(xCoord, id, d);
        });

      const extent = [
        [0, 0],
        [w, h],
      ];

      var resizeTimer;
      var zoom = d3
        .zoom()
        .scaleExtent([1, 100])
        .translateExtent(extent)
        .extent(extent)
        .on("zoom", zoomed)
        .on("zoom.end", zoomend);

      gGraph.call(zoom);

      function zoomed(event) {
        var t = event.transform;
        let xScaleZ = t.rescaleX(xScale);

        let hideTicksWithoutLabel = function () {
          d3.selectAll(".xAxis .tick text").each(function (d) {
            if (this.innerHTML === "") {
              this.parentNode.style.display = "none";
            }
          });
        };

        gX.call(
          d3
            .axisBottom(xScaleZ)
            .tickFormat((d, e, target) => {
              if (Number.isInteger(d) && d >= 0 && d <= dates.length - 1) {
                d = dates[d];
                hours = d?.getHours();
                minutes = (d?.getMinutes() < 10 ? "0" : "") + d?.getMinutes();
                amPM = hours < 13 ? "am" : "pm";
                return (
                  hours + ":" + minutes + amPM + " " + d.toLocaleDateString()
                );
              }
            })
            .tickSize(-h)
        );
        gX.selectAll(".tick line").attr("opacity", ".1");

        candles
          .attr("x", (d, i) => xScaleZ(i) - (xBand.bandwidth() * t.k) / 2)
          .attr("width", xBand.bandwidth() * t.k);
        stems.attr(
          "x1",
          (d, i) => xScaleZ(i) - xBand.bandwidth() / 2 + xBand.bandwidth() * 0.5
        );
        stems
          .attr(
            "x2",
            (d, i) =>
              xScaleZ(i) - xBand.bandwidth() / 2 + xBand.bandwidth() * 0.5
          )
          .attr("stroke-width", t.k > 3 ? 3 : t.k);
        bands
          .selectAll("rect")
          .attr("x", (d, i) => xScaleZ(i) - (xBand.bandwidth() * t.k) / 2)
          .attr("width", xBand.bandwidth() * t.k);
        // .attr("height", h);
        smalled
          .selectAll("rect")
          .attr("x", (d, i) => xScaleZ(i) - (xBand.bandwidth() * t.k) / 2)
          .attr("width", xBand.bandwidth() * t.k);

        hideTicksWithoutLabel();

        gX.selectAll(".tick text").call(wrap, xBand.bandwidth());
      }

      function zoomend(event) {
        var t = event.transform;
        let xScaleZ = t.rescaleX(xScale);
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
          var xmin = new Date(xDateScale(Math.floor(xScaleZ.domain()[0]))),
            xmax = new Date(xDateScale(Math.floor(xScaleZ.domain()[1]))),
            filtered = prices.filter((d) => d.Date >= xmin && d.Date <= xmax),
            minP = +d3.min(filtered, (d) => d.Low),
            maxP = +d3.max(filtered, (d) => d.High),
            buffer = Math.floor((maxP - minP) * 0.1);

          yScale.domain([minP - buffer, maxP + buffer]);
          candles
            .transition()
            .duration(800)
            .attr("y", (d) => yScale(Math.max(d.Open, d.Close)))
            .attr("height", (d) =>
              d.Open === d.Close
                ? 1
                : yScale(Math.min(d.Open, d.Close)) -
                  yScale(Math.max(d.Open, d.Close))
            );
          let ah = yScale(crossHair.select("rect").attr("minx"));
          let ay = yScale(crossHair.select("rect").attr("maxx"));
          crossHair
            .select("rect")
            .transition()
            .duration(800)
            .attr("y", ay)
            .attr("height", ah - ay > 1 ? ah - ay : 1);
          stems
            .transition()
            .duration(800)
            .attr("y1", (d) => yScale(d.High))
            .attr("y2", (d) => yScale(d.Low));

          bands.transition().duration(800).selectAll("rect");
          gY.transition()
            .duration(800)
            .call(d3.axisLeft().scale(yScale).tickSize(-w));
          gY.selectAll(".tick line").attr("opacity", ".1");
        }, 500);
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
drawChart();
