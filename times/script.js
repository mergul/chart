// example data and other inputs
var metricName = "views";
var metricCount = [
  0, 3, 1, 2, 1, 1, 1, 1, 2, 2, 3, 1, 2, 1, 4, 3, 2, 1, 1, 1, 1, 1, 4, 2, 1, 2,
  1, 2, 1, 4, 2, 4, 7, 3, 1, 2, 1, 1, 3, 1, 1, 5, 1, 1, 4,
];
var metricMonths = [
  "2018-06",
  "2013-04",
  "2015-11",
  "2012-10",
  "2014-09",
  "2014-02",
  "2016-02",
  "2016-04",
  "2016-06",
  "2014-12",
  "2013-07",
  "2017-01",
  "2015-10",
  "2012-12",
  "2013-05",
  "2018-04",
  "2015-06",
  "2017-03",
  "2014-08",
  "2017-07",
  "2013-02",
  "2012-07",
  "2016-03",
  "2017-06",
  "2018-07",
  "2014-10",
  "2013-01",
  "2013-10",
  "2017-11",
  "2014-05",
  "2012-11",
  "2015-01",
  "2018-03",
  "2015-12",
  "2015-08",
  "2016-08",
  "2014-11",
  "2014-01",
  "2013-06",
  "2012-08",
  "2015-09",
  "2016-07",
  "2013-03",
  "2012-09",
  "2016-05",
];
var optwidth = 600;
var optheight = 370;

/*
 * ========================================================================
 *  Global variables and options
 * ========================================================================
 */

// the format of the date in the input data
var input_date_format = d3.time.format("%Y-%m");
// how dates will be displayed in the chart in most cases
var display_date_format = d3.time.format("%b %Y");

// the length of a day/year in milliseconds
var day_in_ms = 86400000,
  ms_in_year = 31540000000;

// focus chart sizing
var margin = { top: 30, right: 30, bottom: 95, left: 20 },
  width = optwidth - margin.left - margin.right,
  height = optheight - margin.top - margin.bottom;

// context chart sizing
var margin_context = { top: 315, right: 30, bottom: 20, left: 20 },
  height_context = optheight - margin_context.top - margin_context.bottom;

// zoom button sizing
var button_width = 40,
  button_height = 14,
  button_padding = 10;

/*
 * ========================================================================
 *  Prepare data
 * ========================================================================
 */

// change dates to milliseconds
metricMonths.forEach(function (part, index, theArray) {
  theArray[index] = d3.time.format("%Y-%m").parse(part).getTime();
});

// get a list of all possible months in the range of data (even if not listed in metricMonths)
var all_months = d3.time
  .scale()
  .domain(d3.extent(metricMonths))
  .ticks(d3.time.months, 1);

// for each month, check whether there is a count available, if so append it, otherwise append zero.
var dataset = [];
for (var i = 0; i < all_months.length; i++) {
  var match_index = metricMonths.indexOf(all_months[i].getTime());
  if (match_index == -1) {
    // no match in data
    dataset.push({ month: all_months[i], count: 0 });
  } else {
    // match in data
    dataset.push({ month: all_months[i], count: metricCount[match_index] });
  }
}

/*
 * ========================================================================
 *  x and y coordinates
 * ========================================================================
 */

// add about a month to the end of the x range to show the last bar (which starts on the first of the month)
var x_full_extent = d3.extent(dataset, function (d) {
  return d.month;
}); //,
(new_max_date = new Date(x_full_extent[1].getTime() + day_in_ms * 24)),
  (x_full_extent = [x_full_extent[0], new_max_date]);

var y_full_range = [
  0,
  d3.max(dataset, function (d) {
    return d.count;
  }),
];

/* === Focus Chart === */

var x = d3.time.scale().range([0, width]).domain(x_full_extent);

// The ordinal scale is used only for its `rangeBands` method, to automatially
// calculate the width of columns of column chart for details, see:
// https://stackoverflow.com/questions/12186366/d3-js-evenly-spaced-bars-on-a-time-scale
var x_ordinal = d3.scale
  .ordinal()
  .rangeBands([0, width], 0, 25)
  .domain(
    dataset.map(function (d) {
      return d.month;
    })
  );

var y = d3.scale.linear().range([height, 0]).domain(y_full_range);

var x_axis = d3.svg
  .axis()
  .scale(x)
  .orient("bottom")
  .tickSize(-height)
  .ticks(generate_ticks)
  .tickFormat(format_months);

var y_axis = d3.svg
  .axis()
  .scale(y)
  .ticks(4)
  .tickFormat(d3.format("d"))
  .tickSize(-width)
  .orient("right");

/* === Context Chart === */

var x_context = d3.time
  .scale()
  .range([0, width])
  .domain([x_full_extent[0], x_full_extent[1]]);

var x_context_ordinal = d3.scale
  .ordinal()
  .rangeBands([0, width], 0, 35)
  .domain(
    dataset.map(function (d) {
      return d.month;
    })
  );

var y_context = d3.scale.linear().range([height_context, 0]).domain(y.domain());

var x_axis_context = d3.svg
  .axis()
  .scale(x_context)
  .orient("bottom")
  .ticks(generate_ticks)
  .tickFormat(format_months);

/*
 * ========================================================================
 *  Variables for brushing and zooming behaviour
 * ========================================================================
 */

var brush = d3.svg
  .brush()
  .x(x_context)
  .on("brush", change_focus_brush)
  .on("brushend", check_bounds);

var zoom = d3.behavior
  .zoom()
  .on("zoom", change_focus_zoom)
  .on("zoomend", check_bounds);

/*
 * ========================================================================
 *  Define the SVG area ("vis") and append all the layers
 * ========================================================================
 */

// === the main components === //

var vis = d3
  .select("#metric-modal")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .attr("class", "metric-chart"); // CB -- "line-chart" -- CB //

// clipPath is used to keep elements from moving outside of plot area when viwer zooms/scrolls/brushes
vis
  .append("defs")
  .append("clipPath")
  .attr("id", "clip")
  .append("rect")
  .attr("width", width)
  .attr("height", height);

var pane = vis
  .append("rect")
  .attr("class", "pane")
  .attr("width", width)
  .attr("height", height)
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = vis
  .append("g")
  .attr("class", "context")
  .attr(
    "transform",
    "translate(" + margin_context.left + "," + margin_context.top + ")"
  );

var focus = vis
  .append("g")
  .attr("class", "focus")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// === current date range text & zoom buttons === //

var expl_text = vis
  .append("g")
  .attr("id", "buttons_group")
  .attr("transform", "translate(" + 0 + "," + 0 + ")");

expl_text
  .append("text")
  .attr("id", "totalCount")
  .style("text-anchor", "start")
  .attr("transform", "translate(" + 18 + "," + 11 + ")");

expl_text
  .append("text")
  .attr("id", "displayDates")
  .style("text-anchor", "start")
  .attr("transform", "translate(" + 20 + "," + 22 + ")");

update_context();

// === the zooming/scaling buttons === //

if (x_full_extent[1] - x_full_extent[0] < ms_in_year) {
  var button_data = ["month", "all"];
} else {
  var button_data = ["year", "month", "all"];
}

var button_count = button_data.length - 1,
  button_g_width =
    button_count * button_width +
    button_count * button_padding +
    margin.right -
    button_padding;

expl_text
  .append("text")
  .attr("class", "zoomto_text")
  .text("Zoom to")
  .style("text-anchor", "start")
  .attr(
    "transform",
    "translate(" + (width - button_g_width - 45) + "," + 14 + ")"
  )
  .style("opacity", "0");

var button = expl_text
  .selectAll("g")
  .data(button_data)
  .enter()
  .append("g")
  .attr("class", "scale_button")
  .attr("transform", function (d, i) {
    return (
      "translate(" +
      (width - button_g_width + i * button_width + i * button_padding) +
      ",4)"
    );
  })
  .style("opacity", "0");

button
  .append("rect")
  .attr("class", "button_rect")
  .attr("width", button_width)
  .attr("height", button_height)
  .attr("rx", 1)
  .attr("ry", 1);

button
  .append("text")
  .attr("dy", button_height / 2 + 3)
  .attr("dx", button_width / 2)
  .style("text-anchor", "middle")
  .text(function (d) {
    return d;
  });

/* === focus chart === */

focus
  .append("g")
  .attr("class", "y axis")
  .call(y_axis)
  .attr("transform", "translate(" + width + ", 0)")
  .style("text-anchor", "middle");

// x-axis
focus
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height + ")")
  .call(x_axis)
  .style("text-anchor", "middle");

// enter bars
focus
  .selectAll(".bar")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("id", function (d) {
    return "bar_" + d.month.getTime();
  }) //id of each bar is "bar_" plus it's associated date in ms
  .attr("x", function (d) {
    return x(d.month);
  })
  .attr("y", height)
  .attr("height", 0)
  .attr("width", x_ordinal.rangeBand())
  .style("opacity", 0)
  .on("mouseover", function (d) {
    var floor_month = d3.time.month.floor(d.month).getTime();
    highlight_bar("#bar_" + floor_month);
    highlight_label("#label_" + floor_month);
    show_tooltip(d);
  })
  .on("mouseout", function (d) {
    var floor_month = d3.time.month.floor(d.month).getTime();
    unhighlight_bar("#bar_" + floor_month);
    unhighlight_label("#label_" + floor_month);
    hide_tooltip(d);
  });

// animate bars
focus
  .selectAll(".bar")
  .transition()
  .duration(450)
  .ease("elastic", 1.03, 0.98)
  .delay(function (d, i) {
    var max_delay = 600;
    var z = i / (dataset.length - 1);
    var line_z = z * max_delay * 0.4;
    var log_z = Math.log2(z + 1) * max_delay * 0.6;
    return 250 + line_z + log_z;
  })
  .attr("y", function (d) {
    return y(d.count);
  })
  .attr("height", function (d) {
    return y(0) - y(d.count);
  })
  .style("opacity", 1);

/* === tooltip === */
var div = d3
  .select("#metric-modal")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

/* === context chart === */

// enter context bars
context
  .selectAll(".bar_context")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("class", "bar_context")
  .attr("x", function (d) {
    return x_context(d.month);
  })
  .attr("y", height_context)
  .attr("height", 0)
  .attr("width", x_context_ordinal.rangeBand())
  .style("opacity", 0);

// animate context bars
context
  .selectAll(".bar_context")
  .transition()
  .duration(450)
  .ease("elastic", 1.03, 0.98)
  .delay(function (d, i) {
    var max_delay = 600;
    var z = i / (dataset.length - 1);
    var line_z = z * max_delay * 0.4;
    var log_z = Math.log2(z + 1) * max_delay * 0.6;
    return line_z + log_z;
  })
  .attr("y", function (d) {
    return y_context(d.count);
  })
  .attr("height", function (d) {
    return y_context(0) - y_context(d.count);
  })
  .style("opacity", 1);

// x-axis
context
  .append("g")
  .attr("class", "x axis")
  .attr("transform", "translate(0," + height_context + ")")
  .call(x_axis_context);

/* === brush  === */

var brushg = context.append("g").attr("class", "x brush").call(brush);

brushg
  .selectAll(".extent")
  .attr("y", -6)
  .attr("height", height_context + 8)
  .style("opacity", "0");

brushg
  .selectAll(".resize")
  .append("rect")
  .attr("class", "handle")
  .attr("transform", "translate(0," + -3 + ")")
  .attr("rx", 1)
  .attr("ry", 1)
  .attr("height", 0)
  .attr("width", 3)
  .style("opacity", "0");

brushg
  .selectAll(".resize")
  .append("rect")
  .attr("class", "handle-mini")
  .attr("transform", "translate(-2,8.5)")
  .attr("rx", 2)
  .attr("ry", 2)
  .attr("height", 0)
  .attr("width", 7)
  .style("opacity", "0");

/* === y axis title === */
vis
  .append("text")
  .attr("class", "y axis title")
  .text("Monthly " + this.metricName)
  .attr("x", -((height + margin.top + margin.bottom - 50) / 2))
  .attr("y", 0)
  .attr("dy", "1em")
  .attr("transform", "rotate(-90)")
  .style("text-anchor", "middle");

// allow zoom, brush, and scale behavior after a small delay,
// so that user does not interrupt bar entrance animation.
// show UI elements only once user is able to interact with them.
setTimeout(function () {
  // add behaviours
  pane.call(zoom).call(change_focus_zoom);
  zoom.x(x);

  vis
    .selectAll(".scale_button")
    .style("cursor", "pointer")
    .on("click", zoom_to_interval);

  // fade in buttons
  vis
    .selectAll(".scale_button,.zoomto_text")
    .transition()
    .duration(100)
    .ease("cubic")
    .style("opacity", "1");

  // fade in brush elements
  brushg
    .selectAll(".extent")
    .transition()
    .duration(100)
    .ease("cubic")
    .style("opacity", "1");

  brushg
    .selectAll(".handle-mini")
    .transition()
    .duration(170)
    .ease("linear")
    .attr("height", height_context / 2)
    .style("opacity", "1");

  brushg
    .selectAll(".handle")
    .transition()
    .duration(170)
    .ease("linear")
    .attr("height", height_context + 6)
    .style("opacity", "1");
}, 900);

/*
 * ========================================================================
 *  Functions
 * ========================================================================
 */

/*	------------------------------------------------------
		HELPER FUNCTIONS
	------------------------------------------------------  */

function get_zoom_scale() {
  // custom zoom scale needed to calculate width of bars with zoom/brush.
  // can't use zoom.scale() because this needs to be reset (to one) when using change_focus_brush()
  var x_current_width = x.domain()[1] - x.domain()[0],
    x_total_width = x_full_extent[1] - x_full_extent[0],
    zoom_scale = x_total_width / x_current_width;
  return zoom_scale;
}

function convert_metric_name(n) {
  // remove s from metric name if count is 1
  if (n == 1) {
    return metricName.slice(0, -1);
  } else {
    return metricName;
  }
}

/*	------------------------------------------------------
		HOVER BEHAVIOUR: X-AXIS LABELS, BARS, TOOLTIPS
	------------------------------------------------------  */

function highlight_bar(bar_id) {
  // mouseover effect on bar
  focus.select(bar_id).style("stroke-width", "1").style("opacity", "0.9");
}

function unhighlight_bar(bar_id) {
  // undo mouseover effect on bar
  focus.select(bar_id).style("stroke-width", "0").style("opacity", "1");
}

function highlight_label(label_id) {
  // mouseover effect on label
  focus.select(label_id).selectAll("text").style("font-weight", "bold");
}

function unhighlight_label(label_id) {
  // undo mouseover effect on label
  focus.select(label_id).selectAll("text").style("font-weight", "normal");
}

function add_tick_behaviour() {
  focus.selectAll(".x.axis .tick")[0].forEach(function (tick) {
    d3.select(tick)
      .attr("id", function (d, i) {
        return "label_" + d3.time.month.floor(d).getTime();
      })
      .on("mouseover", function (tick) {
        // extract the datapoint from dataset that is associated with x-axis label
        var floor_month = d3.time.month.floor(tick).getTime();
        var d = dataset.filter(function (d) {
          return d.month.getTime() === floor_month;
        })[0];
        highlight_bar("#bar_" + floor_month);
        highlight_label("#label_" + floor_month);
        show_tooltip(d);
      })
      .on("mouseout", function (tick) {
        var floor_month = d3.time.month.floor(tick).getTime();
        unhighlight_bar("#bar_" + floor_month);
        unhighlight_label("#label_" + floor_month);
        hide_tooltip(tick);
      });
  });
}

function show_tooltip(d) {
  div.transition().duration(60).style("opacity", 0.98);

  div
    .html(
      "<b>" +
        display_date_format(d.month) +
        "</b><br/>" +
        d.count +
        " " +
        convert_metric_name(d.count)
    )
    .style(
      "left",
      x(d.month) + 60 + x_ordinal.rangeBand() * 0.5 * get_zoom_scale() + "px"
    )
    .style("top", y(d.count) + 68 + "px");
}

function hide_tooltip(d) {
  div.transition().duration(60).style("opacity", 0);
}

/*	------------------------------------------------------
		TICK FORMATTING FUNCTIONS (focus x-axis)
	------------------------------------------------------  */

function generate_ticks(t0, t1, dt) {
  var label_size = 45;
  var max_total_labels = Math.floor(width / label_size);
  var offset = day_in_ms * 9; //add a slight offset so that labels are at the center of each month.

  function step(date, next_step) {
    date.setMonth(date.getMonth() + next_step);
  }

  var time = d3.time.month.floor(t0),
    time = new Date(time.getTime() + offset),
    times = [],
    monthFactors = [1, 3, 4, 12];

  while (time < t1) {
    times.push(new Date(+time)), step(time, 1);
  }

  var timesCopy = times;
  var i;

  for (i = 0; times.length > max_total_labels; i++) {
    var times = _.filter(timesCopy, function (d) {
      return d.getMonth() % monthFactors[i] == 0;
    });
  }

  return times;
}

function format_months(d) {
  add_tick_behaviour(); // add tick hover behaviour everytime ticks are re-formatted;
  var test = x.domain()[1] - x.domain()[0] > 132167493818; // when to switch from yyyy to mm-yyyy
  if ((d.getMonth() == 0) & test) {
    //if january
    var yearOnly = d3.time.format("%Y");
    return yearOnly(d);
  } else {
    return display_date_format(d);
  }
}

/*	------------------------------------------------------
		BRUSH & ZOOM BEHAVIOUR
	------------------------------------------------------  */

function change_focus_brush() {
  // make the x domain match the brush domain
  x.domain(brush.empty() ? x_context.domain() : brush.extent());
  // reset zoom
  zoom.x(x);
  // re-draw axis and elements at new scale
  update_focus();
  // update the explanatory text (total views, date range)
  update_context();
}

function change_focus_zoom() {
  // make the brush range change with the x domain in focus
  brush.extent(x.domain());
  vis.select(".brush").call(brush);
  // re-draw axis and elements at new scale
  update_focus();
  // update the explanatory text (total views, date range)
  update_context();
}

function update_focus() {
  // calculate new y-max in focus data
  var left_date = x.domain()[0];
  if (left_date.getDate() < 19) {
    // date range should switch to next month on the 19th.
    var left_date = d3.time.month.floor(left_date),
      left_date = new Date(left_date.getTime());
  }

  var data_subset_focus = dataset.filter(function (d) {
    return d.month <= x.domain()[1] && d.month >= left_date;
  });

  var y_max_focus =
    d3.max(data_subset_focus, function (d) {
      return d.count;
    }) || 1;
  var y_change_duration = 85;

  // reset y-axis
  y.domain([0, y_max_focus]);
  focus
    .select(".y.axis")
    .transition()
    .duration(y_change_duration * 0.95)
    //.ease()
    .call(y_axis);

  // reset bar height given y-axis
  focus
    .selectAll(".bar")
    .transition()
    .duration(y_change_duration)
    .attr("y", function (d) {
      return y(d.count);
    })
    .attr("height", function (d) {
      return y(0) - y(d.count);
    });

  // redraw other elements
  focus.select(".x.axis").call(x_axis);
  focus
    .selectAll(".bar")
    .attr("x", function (d) {
      return x(d.month);
    })
    .attr("width", x_ordinal.rangeBand() * get_zoom_scale())
    .style("opacity", "1"); // incase user scrolls before entrance animation finishes.
}

function update_context() {
  // updates display dates, total count, and decreases opacity of context bars out of focus
  var b = brush.extent();

  // given bar width, date range should switch to next month on the 19th
  if (b[0].getDate() >= 19) {
    var left_date = d3.time.month.ceil(b[0]),
      left_date = new Date(left_date.getTime());
  } else {
    left_date = d3.time.month.floor(b[0]);
  }

  // get the range of data in focus
  var start_month = brush.empty()
      ? display_date_format(x_full_extent[0])
      : display_date_format(left_date),
    end_month = brush.empty()
      ? display_date_format(x_full_extent[1])
      : display_date_format(b[1]);

  var data_subset_focus = dataset.filter(function (d) {
    return (
      d.month <= display_date_format.parse(end_month) && d.month >= left_date
    );
  });

  focus_x_extent = d3.extent(data_subset_focus, function (d) {
    return d.month;
  });

  // calcualte the total views/downloads within focus area
  var total_count = 0;
  for (var i = 0; i < data_subset_focus.length; i++) {
    total_count += data_subset_focus[i].count;
  }

  // Update start and end dates and total count
  vis
    .select("#displayDates")
    .text(
      start_month == end_month
        ? "in " + start_month
        : "from " + start_month + " to " + end_month
    );
  vis
    .select("#totalCount")
    .text(total_count + " " + convert_metric_name(total_count));

  // Fade all years in the bar chart not within the brush
  context.selectAll(".bar_context").style("opacity", function (d, i) {
    return (d.month <= display_date_format.parse(end_month) &&
      d.month >= left_date) ||
      brush.empty()
      ? "1"
      : ".3";
  });
}

function check_bounds() {
  // when brush stops moving:

  // check whether chart was scrolled out of bounds and fix,
  var b = brush.extent();
  var out_of_bounds = brush.extent().some(function (e) {
    return (e < x_full_extent[0]) | (e > x_full_extent[1]);
  });
  if (out_of_bounds) {
    b = move_in_bounds(b);
  }
}

function move_in_bounds(b) {
  // move back to boundaries if user pans outside min and max date.

  var ms_in_year = 31536000000,
    brush_start_new,
    brush_end_new;

  if (b[0] < x_full_extent[0]) {
    brush_start_new = x_full_extent[0];
  } else if (b[0] > x_full_extent[1]) {
    brush_start_new = new Date(x_full_extent[1].getTime() - ms_in_year);
  } else {
    brush_start_new = b[0];
  }

  if (b[1] > x_full_extent[1]) {
    brush_end_new = x_full_extent[1];
  } else if (b[1] < x_full_extent[0]) {
    brush_end_new = new Date(x_full_extent[0].getTime() + ms_in_year);
  } else {
    brush_end_new = b[1];
  }

  brush.extent([brush_start_new, brush_end_new]);

  brush(d3.select(".brush").transition());
  change_focus_brush();
  change_focus_zoom();

  return brush.extent();
}

function zoom_to_interval(d, i) {
  // action for buttons that zoom focus to certain time interval

  var b = brush.extent(),
    interval_ms,
    brush_end_new,
    brush_start_new;

  if (d == "year") {
    interval_ms = 31536000000;
  } else if (d == "month") {
    interval_ms = 2592000000;
  }

  if ((d == "year") | (d == "month")) {
    if (x_full_extent[1].getTime() - b[1].getTime() < interval_ms) {
      // if brush is too far to the right that increasing the right-hand brush boundary would make the chart go out of bounds....
      brush_start_new = new Date(x_full_extent[1].getTime() - interval_ms); // ...then decrease the left-hand brush boundary...
      brush_end_new = x_full_extent[1]; //...and set the right-hand brush boundary to the maxiumum limit.
    } else {
      // otherwise, increase the right-hand brush boundary.
      brush_start_new = b[0];
      brush_end_new = new Date(b[0].getTime() + interval_ms);
    }
  } else if (d == "all") {
    brush_start_new = x_full_extent[0];
    brush_end_new = x_full_extent[1];
  } else {
    brush_start_new = b[0];
    brush_end_new = b[1];
  }

  brush.extent([brush_start_new, brush_end_new]);

  // now draw the brush to match our extent
  brush(d3.select(".brush").transition());
  // now fire the brushstart, brushmove, and check_bounds events
  brush.event(d3.select(".brush").transition());
}
