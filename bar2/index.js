let data = [],
  zoom,
  width = 1400,
  height = 650,
  margin = { top: 20, right: 20, bottom: 50, left: 50 },
  graphWidth = width - margin.left - margin.right,
  graphHeight = height - margin.top - margin.bottom;

const strictIsoParse = d3.utcParse("%Y-%m-%dT%H:%M:%SZ");
function initZoom() {
  const svg = d3
    .select(".canvas")
    .append("svg")
    .attr("width", width)
    .attr("height", height);
  const gGraph = svg
    .append("g")
    .attr("width", graphWidth)
    .attr("height", graphHeight)
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  const gXAxis = gGraph
    .append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${graphHeight})`);
  const gYAxis = gGraph
    .append("g")
    .attr("class", "y axis")
    .attr("transform", `translate(${margin.left}, 0)`);

  d3.json("sales.json").then((data) => {
    let dates = data.map((item) => item.Period);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => +d.Amount)])
      .range([graphHeight, 0])
      .nice();

    // const xScale = d3
    //   .scaleBand()
    //   .domain(data.map((item) => item.Period))
    //   .range([0, graphWidth])
    //   .paddingInner(0.2)
    //   .paddingOuter(0.2);

    var xmax = d3.max(data.map((r) => new Date(r.Period).getTime()));
    var xScale = d3
      .scaleLinear()
      .domain([0, dates.length])
      .range([margin.left, graphWidth]);
    var xDateScale = d3.scaleQuantize().domain([-1, dates.length]).range(dates);
    let xBand = d3
      .scaleBand()
      .domain(d3.range(0, dates.length))
      .range([margin.left, graphWidth])
      .padding(0.3);
    var resizeTimer;
    const extent = [
      [0, 0],
      [graphWidth, graphHeight],
    ];
    zoom = d3
      .zoom()
      .scaleExtent([1, 4])
      .translateExtent(extent)
      .extent(extent)
      .on("zoom", handleZoom);
    // .on("end", handleZoomEnd);
    const xAxis = d3.axisBottom(xScale).tickFormat(function (d) {
      if (dates[d] !== undefined) {
        d = new Date(dates[d]);
        hours = d.getHours();
        minutes = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
        amPM = hours < 13 ? "am" : "pm";
        return hours + ":" + minutes + amPM;
      } else return "";
    });

    const yAxis = d3.axisLeft(yScale).tickFormat((d) => `${d / 1000}`);

    gXAxis.call(xAxis);

    gYAxis.call(yAxis);

    let mizoom = gGraph
      .append("rect")
      .attr("class", "zoom")
      .attr("id", "rect")
      .attr("width", graphWidth)
      .attr("height", graphHeight)
      .style("fill", "none")
      .style("opacity", 0)
      .style("pointer-events", "all");

    const chartBody = gGraph
      .append("g")
      .attr("class", "chartBody")
      .attr("fill", "steelblue")
      .attr("clip-path", "url(#clip)")
      .attr("width", graphWidth)
      .attr("height", graphHeight);
    // .attr("transform", `translate(${margin.left}, ${0})`);

    const rects = chartBody.selectAll("rect").data(data);

    rects
      .enter()
      .append("rect")
      .attr("class", "bar-rect")
      .attr("width", xBand.bandwidth())
      .attr("height", (d) => yScale(0) - yScale(d.Amount))
      .attr("x", (d, i) => xScale(i) - xBand.bandwidth())
      .attr("y", (d) => yScale(d.Amount));

    gXAxis.selectAll("text").style("font-size", 14);

    gYAxis.selectAll("text").style("font-size", 14);

    gGraph
      .append("defs")
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", graphWidth)
      .attr("height", graphHeight)
      .attr("transform", `translate(${margin.left}, ${0})`)
      .style("fill", "none")
      .style("pointer-events", "all");

    mizoom.call(zoom);

    function handleZoom(event) {
      //  d3.select("svg g").attr("transform", e.transform);
      const t = event.transform;
      let xScaleZ = t.rescaleX(xScale);
      gXAxis.call(
        xAxis.scale(xScaleZ).tickFormat(function (d) {
          if (dates[d] !== undefined) {
            d = new Date(dates[d]);
            hours = d.getHours();
            minutes = (d.getMinutes() < 10 ? "0" : "") + d.getMinutes();
            amPM = hours < 13 ? "am" : "pm";
            return hours + ":" + minutes + amPM;
          } else return "";
        })
      );
      // chartBody.selectAll("rect").attr("transform", t);
      chartBody
        .selectAll("rect")
        .attr("x", (d, i) => xScaleZ(i) - (xBand.bandwidth() * t.k) / 2)
        .attr("width", xBand.bandwidth() * t.k);
    }
    function handleZoomEnd(event) {
      const t = event.transform;
      let xScaleZ = t.rescaleX(xScale);
      gYAxis.attr("transform", d3.zoomIdentity.translate(0, t.y).scale(t.k));
      gYAxis
        .selectAll("text")
        .attr("transform", d3.zoomIdentity.scale(1 / t.k));
      gYAxis
        .selectAll("line")
        .attr("transform", d3.zoomIdentity.scale(1 / t.k));

      clearTimeout(resizeTimer);
      if (t.k !== 1) {
        resizeTimer = setTimeout(function () {
          var xmin = new Date(xDateScale(Math.floor(xScaleZ.domain()[0])));
          xmax = new Date(xDateScale(Math.floor(xScaleZ.domain()[1])));
          filtered = data.filter((d) => {
            if (
              Math.floor(new Date(d.Period).getTime() - 76676799) <=
              xmax.getTime()
            )
              console.log(d.Period);
            return (
              Math.floor(new Date(d.Period).getTime() + 89897799) >=
                xmin.getTime() &&
              Math.floor(new Date(d.Period).getTime() - 76676799) <=
                xmax.getTime()
            );
          });
          minP = +d3.min(filtered, (d) => d.Amount);
          maxP = +d3.max(filtered, (d) => d.Amount);
          buffer = Math.floor((maxP - minP) * 0.1);
          yScale.domain([minP - buffer, maxP + buffer]);
          console.log(
            " minP-buffer -> ",
            minP - buffer,
            " maxP+buffer -> ",
            maxP + buffer,
            " xmin -> ",
            xmin,
            " xmax -> ",
            xmax,
            "t -> ",
            JSON.stringify(t),
            "filtered -> ",
            filtered.length
          );
          // chartBody
          //   .transition()
          //   .duration(500)
          //   .selectAll("rect")
          //   .attr("y", (d) => yScale(d.Amount))
          //   .attr("height", (d, i) => yScale(0) - yScale(d.Amount));
          // gYAxis.call(yAxis.scale(yScale));
          // gYAxis
          //   .transition()
          //   .duration(500)
          //   .call(
          //     d3
          //       .axisRight()
          //       .scale(yScale)
          //       .tickFormat((d) => `${d / 1000}`)
          //   );
        }, 200);
      }
    }
  });
}

function zoomIn() {
  d3.select("svg").transition().call(zoom.scaleBy, 2);
}

function zoomOut() {
  d3.select("svg").transition().call(zoom.scaleBy, 0.5);
}

function resetZoom() {
  d3.select("svg").transition().call(zoom.scaleTo, 1);
}

function center() {
  d3.select("svg")
    .transition()
    .call(zoom.translateTo, 0.5 * width, 0.5 * height);
}

function panLeft() {
  d3.select("svg").transition().call(zoom.translateBy, -50, 0);
}

function panRight() {
  d3.select("svg").transition().call(zoom.translateBy, 50, 0);
}

function update() {
  d3.select("svg g")
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", function (d) {
      return d.x;
    })
    .attr("cy", function (d) {
      return d.y;
    })
    .attr("r", 3);
}

initZoom();
//updateData();
//update();
