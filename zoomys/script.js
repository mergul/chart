var data = {
  columns: [
    {
      name: "Point 1",
      description: "Point 1",
    },
    {
      name: "Point 2",
      description: "Point2",
    },
    {
      name: "Point 3",
      description: "Point 3",
    },
  ],
  rows: [
    {
      name: "Zone 1",
      description: "Zone 1",
    },
    {
      name: "Zone 2",
      description: "Zone 2",
    },
    {
      name: "Zone 3",
      description: "Zone 3",
    },
  ],
  cells: [
    [
      {
        message: null,
        value: 1.4,
      },
      {
        message: null,
        value: 5.4,
      },
      {
        message: null,
        value: 7.4,
      },
    ],
    [
      {
        message: null,
        value: 2.4,
      },
      {
        message: null,
        value: 9.4,
      },
      {
        message: null,
        value: 10.4,
      },
    ],
    [
      {
        message: null,
        value: null,
      },
      {
        message: null,
        value: null,
      },
      {
        message: null,
        value: null,
      },
    ],
  ],
};

var mouseX;
var mouseY;
var mouseX1;
var mouseY1;
var transX;
var transY;

var HEATMAP_CLASS = ".influence-heatmap";
var CANVAS_CLASS = "canvas";

var colorScale = d3.scale
  .linear()
  .domain([0, 0.5, 1])
  .range(["#2c36b6", "#ffff8c", "#d7191c"]);

var margin = { top: 50, right: 50, bottom: 150, left: 100 };

var svg = d3.select("#chart").select("." + CANVAS_CLASS);
if (svg.empty()) {
  svg = d3
    .select("#chart")
    .append("svg:svg")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("class", CANVAS_CLASS);
}

var dim = {
  width: svg[0][0].parentNode.clientWidth,
  height: svg[0][0].parentNode.clientHeight,
};

var width = dim.width - margin.left - margin.right;
var height = dim.height - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangeBands([0, width]);
var y = d3.scale.ordinal().rangeBands([height, 0]);

var columns = data.columns;
var rows = data.rows;
var chartData = [];
data.cells.forEach(function (d, index) {
  d.forEach(function (dt, i) {
    chartData.push({
      x: columns[index].name,
      y: rows[i].name,
      val: +dt.value,
    });
  });
});

x.domain(
  data.columns.map(function (d) {
    return d.name;
  })
);
y.domain(
  data.rows.map(function (d) {
    return d.name;
  })
);

var xAxis = d3.svg.axis().scale(x).orient("bottom");
var yAxis = d3.svg.axis().scale(y).orient("left");

var zoom = d3.behavior.zoom().scaleExtent([1, 10]).on("zoom", zoomHandler);

var dragObj = d3.behavior
  .drag()
  .on("dragstart", dragstart)
  .on("drag", dragging)
  .on("dragend", dragend);

var graphGroup = svg
  .append("g")
  .attr("id", "container")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  .call(zoom);

svg.on("mousedown", function () {
  console.log("mousedown ####");
  var e = this,
    origin = d3.mouse(e),
    rect = svg.append("rect").attr("class", "zoom");
  d3.select("body").classed("noselect", true);
  origin[0] = Math.max(0, Math.min(width, origin[0]));
  origin[1] = Math.max(0, Math.min(height, origin[1]));
  d3.select(window)
    .on("mousemove.zoomRect", function () {
      var m = d3.mouse(e);
      m[0] = Math.max(0, Math.min(width, m[0]));
      m[1] = Math.max(0, Math.min(height, m[1]));
      rect
        .attr("x", Math.min(origin[0], m[0]))
        .attr("y", Math.min(origin[1], m[1]))
        .attr("width", Math.abs(m[0] - origin[0]))
        .attr("height", Math.abs(m[1] - origin[1]));
    })
    .on(
      "mouseup.zoomRect",
      function () {
        d3.select(window)
          .on("mousemove.zoomRect", null)
          .on("mouseup.zoomRect", null);
        d3.select("body").classed("noselect", false);
        var m = d3.mouse(e);
        m[0] = Math.max(0, Math.min(width, m[0]));
        m[1] = Math.max(0, Math.min(height, m[1]));
        if (m[0] !== origin[0] && m[1] !== origin[1]) {
          console.log("zoom rect");
          //here i need to trigger zoom translate/scale event, don't know how to trigger that.
        }
        rect.remove();
        refresh();
      },
      true
    );
  d3.event.stopPropagation();
});

var defs = svg.append("defs");

var tilesGroup = graphGroup.append("g");

defs
  .append("clipPath")
  .attr("id", "my-clip-path")
  .append("rect")
  .attr("width", width)
  .attr("height", height);

defs
  .append("clipPath")
  .attr("id", "x-clip-path")
  .append("rect")
  .attr("width", width)
  .attr("height", height + margin.bottom);
defs
  .append("clipPath")
  .attr("id", "y-clip-path")
  .append("rect")
  .attr("transform", "translate(-" + margin.left + ",0)")
  .attr("width", width)
  .attr("height", height);

tilesGroup.attr("clip-path", "url(#my-clip-path)");

tilesGroup
  .selectAll(".tile")
  .data(chartData)
  .enter()
  .append("rect")
  .attr("class", "tile")
  .attr("x", function (d) {
    return x(d.x);
  })
  .attr("y", function (d) {
    return y(d.y);
  })
  .attr("width", x.rangeBand())
  .attr("height", y.rangeBand())
  .style("fill", function (d) {
    return colorScale(d.val);
  })
  .style("pointer-events", "all")
  .on("mouseover", function () {
    console.log("mouseover");
  })
  .on("mouseout", function () {
    console.log("mouseout");
  })
  .on("mousemove", function (d) {
    console.log("mousemove");
  });

var xAxisGroup = graphGroup
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(xAxis);

var yAxisGroup = graphGroup.append("g").attr("class", "y axis").call(yAxis);

tilesGroup.attr("clip-path", "url(#my-clip-path)");

xAxisGroup.attr("clip-path", "url(#x-clip-path)");

yAxisGroup.attr("clip-path", "url(#y-clip-path)");

function zoomHandler() {
  var translate = zoom.translate(),
    scale = zoom.scale();

  var tx = Math.min(0, Math.max(translate[0], width - width * scale));
  var ty = Math.min(0, Math.max(translate[1], height - height * scale));

  zoom.translate([tx, ty]);

  x.rangeBands([
    d3.event.translate[0],
    d3.event.translate[0] + width * d3.event.scale,
  ]);
  y.rangeBands([
    d3.event.translate[1] + height * d3.event.scale,
    d3.event.translate[1],
  ]);

  svg.select(".x.axis").call(xAxis);
  svg.select(".y.axis").call(yAxis);

  tilesGroup
    .selectAll(".tile")
    .attr("width", x.rangeBand())
    .attr("height", y.rangeBand())
    .attr("x", function (d) {
      return x(d.x);
    })
    .attr("y", function (d) {
      return y(d.y);
    });
}

function dragstart() {
  console.log("dragstart");
  mouseX = d3.mouse(this)[0];
  mouseY = d3.mouse(this)[1];

  console.log(event.target.__data__);

  tilesGroup.append("rect").attr("class", "heatmap-zoom-rect");
}

function dragging() {
  console.log("dragging");

  mouseX1 = d3.mouse(this)[0];
  mouseY1 = d3.mouse(this)[1];

  console.log(event.target.__data__, "end");

  d3.select(".heatmap-zoom-rect")
    .attr("height", function () {
      if (mouseY1 - mouseY < 0) {
        transY = mouseY1;
        return mouseY - mouseY1;
      } else {
        transY = mouseY;
        return mouseY1 - mouseY;
      }
    })
    .attr("width", function () {
      if (mouseX1 - mouseX < 0) {
        transX = mouseX1;
        return mouseX - mouseX1;
      } else {
        transX = mouseX;
        return mouseX1 - mouseX;
      }
    })
    .attr("transform", "translate(" + transX + "," + transY + ")");
}

function dragend() {
  console.log("dragend");
  d3.select(".heatmap-zoom-rect").remove();
}
