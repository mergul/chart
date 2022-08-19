const width = 960,
  height = 500,
  margin = { top: 20, right: 20, bottom: 40, left: 50 },
  graphWidth = width - margin.left - margin.right,
  graphHeight = height - margin.top - margin.bottom;

d3.csv("alphabet.csv")
  .then((d) =>
    d.map((d) => ({
      name: d.letter,
      value: +d.frequency,
    }))
  )
  .then((data) => {
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.name))
      //Here the domain is the letters in the our data and that's what will be written on the Axis
      .range([margin.left, graphWidth - margin.right])
      // margin.left and width-margin.right are respectively the minimum and maximum extents of the bands and that's where the axis will be placed.
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.value)])
      .nice()
      //Here the domain of y will vary between 0 and the maximum frequency of the letters and that's what will be written on the Axis
      .range([graphHeight - margin.bottom, margin.top]);
    //The extents of the bands will vary from height-margin to margin.top and that's where the axis will be placed.

    const xAxis = (g) =>
      g
        .attr("transform", `translate(0,${graphHeight - margin.bottom})`) // This controls the vertical position of the Axis
        .call(d3.axisBottom(xScale).tickSizeOuter(0))
        .call((g) => g.select(".domain").remove()); //Creates bottom horizontal axis with an  outer tick size equal to 0

    const yAxis = (g) =>
      g
        .attr("transform", `translate(${margin.left},0)`) // This controls the horizontal position of the Axis
        .call(d3.axisLeft(yScale)) //Creates left vertical axis
        .call((g) => g.select(".domain").remove()); //This removes the domain from the DOM API.

    const ZoomableBarChart = () => {
      const svg = d3
        .select("#app")
        .append("svg")
        .attr("viewBox", [
          0,
          0,
          graphWidth - margin.left,
          graphHeight - margin.top,
        ]);
      // .call(zoom); //calls the zoom function
      const gView = svg
        .append("g")
        .attr("class", "view")
        .attr("width", graphWidth - margin.left - margin.right)
        .attr("height", graphHeight - margin.top - margin.bottom);
      // .attr("transform", `translate(${margin.left}, ${margin.top})`);

      gView
        .append("g")
        .attr("clip-path", "url(#clipx)")
        .append("g")
        .attr("class", "x-axis")
        .call(xAxis);

      gView
        .append("g")
        .attr("clip-path", "url(#clipy)")
        .append("g")
        .attr("class", "y-axis")
        .call(yAxis);

      gView
        .append("g")
        .attr("clip-path", "url(#clip)")
        .attr("class", "bars")
        .attr("fill", "steelblue")
        .attr("width", graphWidth)
        .attr("height", graphHeight)
        .selectAll("rect")
        .data(data)
        .join("rect")
        .attr("x", (d) => xScale(d.name))
        .attr("y", (d) => yScale(d.value))
        .attr("height", (d) => yScale(0) - yScale(d.value))
        .attr("width", xScale.bandwidth());

      const defs = gView.append("defs");
      defs
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", graphWidth)
        .attr("height", graphHeight - margin.top - margin.bottom)
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("fill", "none")
        .style("opacity", 0);
      defs
        .append("clipPath")
        .attr("id", "clipx")
        .append("rect")
        .attr("width", graphWidth - margin.left)
        .attr("height", margin.bottom)
        .attr("x", margin.left)
        .attr("y", graphHeight - margin.bottom);
      defs
        .append("clipPath")
        .attr("id", "clipy")
        .append("rect")
        .attr("width", margin.left)
        .attr("height", graphHeight - margin.top)
        .attr("x", 0)
        .attr("y", 0);
      rectZoom = gView
        .append("rect")
        .attr("class", "zoom")
        .style("fill", "none")
        .style("pointer-events", "all")
        .style("opacity", 0)
        .attr("x", margin.left)
        .attr("y", margin.top)
        .attr("width", graphWidth - margin.left - margin.right)
        .attr("height", graphHeight - margin.top - margin.bottom);
      // .attr("transform", `translate(${margin.left}, ${margin.top})`);

      rectZoom.call(zoom);
    };

    const zoom = (rectZoom) => {
      const extent = [
        [margin.left, margin.top],
        [graphWidth - margin.right, graphHeight - margin.bottom],
      ];

      rectZoom.call(
        d3
          .zoom()
          .scaleExtent([1, 8])
          .translateExtent(extent) //If extent is specified, sets the translate extent to the specified array of points in extent
          .extent(extent) //If extent is specified, sets the viewport extent to the specified array of points (sets the zooming behaviour)
          .on("zoom", zoomed)
      ); //Applies this zoom behavior to the specified event
      // in this function we will specify our zooming targets
      function zoomed(event) {
        var t = event.transform;
        xScale.range(
          [margin.left, graphWidth - margin.right].map((d) => t.applyX(d))
        );
        yScale.range(
          [graphHeight - margin.bottom, margin.top].map((d) => t.applyY(d))
        );
        d3.select(".view")
          .selectAll(".bars rect")
          .attr("x", (d) => xScale(d.name))
          .attr("width", xScale.bandwidth())
          .attr("y", (d) => yScale(d.value))
          .attr("height", (d) => yScale(0) - yScale(d.value));

        d3.select(".view").selectAll(".x-axis").call(xAxis);
        d3.select(".view").selectAll(".y-axis").call(yAxis);
        // in our case these targets are the x axis and the bar rectangles that's why when you zoom you won't see the y axis zooming too.

        // d3.select(".view").selectAll(".bars rect").attr("transform", t);

        // d3.select(".view")
        //   .selectAll(".x-axis")
        //   .attr("transform", d3.zoomIdentity.translate(0, t.y).scale(t.k));
        // d3.select(".view")
        //   .selectAll(".x-axis")
        //   .selectAll("text")
        //   .attr("transform", d3.zoomIdentity.scale(1 / t.k));
        // d3.select(".view")
        //   .selectAll(".x-axis")
        //   .selectAll("line")
        //   .attr("transform", d3.zoomIdentity.scale(1 / t.k));
      }
    };
    ZoomableBarChart();
  });
