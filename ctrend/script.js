/////////////////////////////////////////////////////////////////////////////
// #region Drawing Code
//

var pageData = null;
var columns = null;
var config = null;

//
// Main Drawing Method
//

function renderCore(sfdata) {
  if ($("#trendChartContainer")) {
    $("#trendChartContainer").empty();
  }
  var chartdata;

  // Log entering renderCore

  if (!resizing) {
    // Extract the columns
    columns = sfdata.columns;

    // Extract the data array section
    chartdata = sfdata.data;

    // Config settings
    config = sfdata.config;

    //Set Global data for resizing
    pageData = chartdata;
  } else {
    chartdata = sfdata;
  }

  draw(chartdata, columns, config);
}

//
// #endregion Drawing Code
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// #region Marking Code
//

//
// This method receives the marking mode and marking rectangle coordinates
// on mouse-up when drawing a marking rectangle
//
function markModel(markMode, rectangle) {
  // Implementation of logic to call markIndices or markIndices2 goes here
}

//
// #endregion Marking Code
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
// #region Resizing Code
//

var resizing = false;

window.onresize = function (event) {
  resizing = true;
  if ($("#trendChartContainer")) {
    $("#trendChartContainer").empty();
    draw(pageData, columns, config);
  }
  resizing = false;
};

//
// #endregion Resizing Code
//////////////////////////////////////////////////////////////////////////////

function draw(chartdata, columns, config) {
  // set the dimensions and margins of the graph
  var margin = {
    top: 20,
    right: 20,
    bottom: 30,
    left: 50,
  };
  var width = window.innerWidth - margin.left - margin.right - 50;
  var height = window.innerHeight - margin.top - margin.bottom - 50;

  // set the ranges
  var x;
  var y;

  var actualData = [];
  for (var i = 0; i < chartdata.length; i++) {
    if (config.time === "forecast") {
      if (chartdata[i].items[columns.indexOf("Actual_Volume_CY")] === 0) {
        actualData.push(chartdata[i]);
      }
    } else if (config.time === "actual") {
      if (chartdata[i].items[columns.indexOf("Actual_Volume_CY")] != 0) {
        actualData.push(chartdata[i]);
      }
    }
  }

  var actualVolume_CY = 0;
  var actualVolume_LY = 0;
  var fcastVolume_CY = 0;
  var fcastVolume_LY = 0;
  var actual_CY = 0;
  var actual_LY = 0;
  var fcast_CY = 0;
  var fcast_LY = 0;
  var actualDNNSI_CY = 0;
  var actualDNNSI_LY = 0;
  var fcastDNNSI_CY = 0;
  var fcastDNNSI_LY = 0;
  var pctChange_Volume = 0;
  columns.push("DNNSI");
  columns.push("Measure");
  for (var i = 0; i < actualData.length; i++) {
    actualVolume_CY = actualData[i].items[columns.indexOf("Actual_Volume_CY")];
    actualVolume_LY = actualData[i].items[columns.indexOf("Actual_Volume_LY")];
    fcastVolume_CY = actualData[i].items[columns.indexOf("Forecast_Volume_CY")];
    fcastVolume_LY = actualData[i].items[columns.indexOf("Forecast_Volume_LY")];

    actualDNNSI_CY = actualData[i].items[columns.indexOf("Actual_DNNSI_CY")];
    actualDNNSI_LY = actualData[i].items[columns.indexOf("Actual_DNNSI_LY")];
    fcastDNNSI_CY = actualData[i].items[columns.indexOf("Forecast_DNNSI_CY")];
    fcastDNNSI_LY = actualData[i].items[columns.indexOf("Forecast_DNNSI_LY")];

    actual_CY =
      actualData[i].items[columns.indexOf("Actual_" + config.measure + "_CY")];
    actual_LY =
      actualData[i].items[columns.indexOf("Actual_" + config.measure + "_LY")];
    fcast_CY =
      actualData[i].items[
        columns.indexOf("Forecast_" + config.measure + "_CY")
      ];
    fcast_LY =
      actualData[i].items[
        columns.indexOf("Forecast_" + config.measure + "_LY")
      ];

    if (config.time === "forecast") {
      var val =
        (fcastDNNSI_CY / fcastVolume_CY - fcastDNNSI_LY / fcastVolume_LY) /
        (fcastDNNSI_LY / fcastVolume_LY);
      actualData[i].items.push(val);

      var valMeasure = (fcast_CY - fcast_LY) / fcast_LY;
      actualData[i].items.push(valMeasure);
    } else if (config.time === "actual") {
      var val =
        (actualDNNSI_CY / actualVolume_CY - actualDNNSI_LY / actualVolume_LY) /
        (actualDNNSI_LY / actualVolume_LY);
      actualData[i].items.push(val);

      var valMeasure = (actual_CY - actual_LY) / actual_LY;
      actualData[i].items.push(valMeasure);
    }
  }

  //(((Sum([Forecast_DNNSI_CY])) / (Sum([Forecast_Volume_CY]))) - ((Sum([Forecast_DNNSI_LY])) / (Sum([Forecast_Volume_LY])))) / ((Sum([Forecast_DNNSI_LY])) / (Sum([Forecast_Volume_LY])))

  // append the svg obgect to the body of the page
  // appends a 'group' element to 'svg'
  // moves the 'group' element to the top left margin
  var svg = d3
    .select("#trendChartContainer")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x = d3
    .scaleLinear()
    .domain([
      d3.min(actualData, function (d) {
        return d.items[columns.indexOf("Week")];
      }),
      d3.max(actualData, function (d) {
        return d.items[columns.indexOf("Week")];
      }),
    ])
    .range([0, width]);
  y = d3.scaleLinear().domain([-0.15, 0.25]).range([height, 0]);

  var formatPercent = d3.format(".0%");

  var xAxis = d3.axisBottom(x).tickFormat(function (d) {
    return d.items[columns.indexOf("Week")];
  });

  var yAxis = d3.axisLeft(y).tickFormat(formatPercent);

  // define the 1st line
  var valueline = d3
    .line()
    .x(function (d) {
      return x(d.items[columns.indexOf("Week")]);
    })
    .y(function (d) {
      return y(d.items[columns.indexOf("DNNSI")]);
    });

  // define the 2nd line
  var valueline2 = d3
    .line()
    .x(function (d) {
      return x(d.items[columns.indexOf("Week")]);
    })
    .y(function (d) {
      return y(d.items[columns.indexOf("Measure")]);
    });

  // Add the valueline path.
  svg
    .append("path")
    .data([actualData])
    .attr("class", "line")
    .attr("d", valueline);

  // Add the valueline2 path.
  svg
    .append("path")
    .data([actualData])
    .attr("class", "line")
    .style("stroke", "#319455")
    .attr("d", valueline2);

  // Add the X Axis
  svg
    .append("g")
    .attr("class", "x-bottom")
    .attr("transform", "translate(1," + height + ")")
    .call(d3.axisBottom(x));

  svg
    .append("g")
    .attr("class", "x axis")
    .append("line")
    .attr("y1", y(0))
    .attr("y2", y(0))
    .attr("x2", width);

  // Add the Y Axis
  svg.append("g").call(yAxis);

  var regLine = d3
    .line()
    .x(function (d) {
      return x(d.Week);
    })
    .y(function (d) {
      return y(d.Measure);
    });

  // Derive a linear regression
  var regression = ss.linearRegression(
    actualData.map(function (d) {
      return [
        +d.items[columns.indexOf("Week")],
        d.items[columns.indexOf("Measure")],
      ];
    })
  );

  var lin = ss.linearRegressionLine(regression);

  // Create a line based on the beginning and endpoints of the range
  var lindata = x.domain().map(function (x) {
    return {
      Week: x,
      Measure: lin(+x),
    };
  });

  svg
    .append("path")
    .datum(lindata)
    .attr("class", "reg")
    .style("stroke-dasharray", "3, 3")
    .attr("stroke", "#319455")
    .attr("stroke-width", 1)
    .attr("d", regLine);

  // Derive a linear regression
  var regression2 = ss.linearRegression(
    actualData.map(function (d) {
      return [
        +d.items[columns.indexOf("Week")],
        d.items[columns.indexOf("DNNSI")],
      ];
    })
  );

  var lin2 = ss.linearRegressionLine(regression2);

  // Create a line based on the beginning and endpoints of the range
  var lindata2 = x.domain().map(function (x) {
    return {
      Week: x,
      Measure: lin2(+x),
    };
  });

  svg
    .append("path")
    .datum(lindata2)
    .attr("class", "reg")
    .style("stroke-dasharray", "3, 3")
    .attr("stroke", "#b43c3c")
    .attr("stroke-width", 1)
    .attr("d", regLine);
}

var data = {
  columns: [
    "Week",
    "Actual_Volume_CY",
    "Actual_Volume_LY",
    "Forecast_Volume_CY",
    "Forecast_Volume_LY",
    "Actual_DNNSI_CY",
    "Actual_DNNSI_LY",
    "Forecast_DNNSI_CY",
    "Forecast_DNNSI_LY",
    "Actual_DNGP_CY",
    "Actual_DNGP_LY",
    "Forecast_DNGP_CY",
    "Forecast_DNGP_LY",
  ],
  pageDataRows: false,
  pageRowSize: 10000,
  dataOnRequest: false,
  viewRowCount: 52,
  baseTableHints: {
    rows: 1973319,
    visible: 1973319,
    marked: 0,
    tableName: "Report Data",
    settingName: "Report",
  },
  data: [
    {
      items: [
        1, 4127405.8618, 3726787.5061, 0, 0, 50206722.9082, 43825775.0067, 0, 0,
        17835438.4493, 16496347.5628, 0, 0,
      ],
      hints: {
        index: 0,
      },
    },
    {
      items: [
        2, 4752083.4088, 4962322.22, 0, 0, 59404306.6366, 57849968.7258, 0, 0,
        20724538.8852, 20713139.3653, 0, 0,
      ],
      hints: {
        index: 1,
      },
    },
    {
      items: [
        3, 4969831.1577, 4376098.7468, 0, 0, 60675830.2445, 49555144.6002, 0, 0,
        21210575.5558, 17528242.2557, 0, 0,
      ],
      hints: {
        index: 2,
      },
    },
    {
      items: [
        4, 4604185.1847, 4890098.7383, 0, 0, 54543763.8231, 56943572.2975, 0, 0,
        19031655.1229, 20471188.0338, 0, 0,
      ],
      hints: {
        index: 3,
      },
    },
    {
      items: [
        5, 5150754.2785, 5249279.0964, 0, 0, 61531446.8776, 59875124.7198, 0, 0,
        21645578.0987, 21339594.6553, 0, 0,
      ],
      hints: {
        index: 4,
      },
    },
    {
      items: [
        6, 4750404.6874, 4815909.5518, 0, 0, 58813511.4655, 56525857.954, 0, 0,
        20625198.0688, 20022985.4158, 0, 0,
      ],
      hints: {
        index: 5,
      },
    },
    {
      items: [
        7, 4647691.2142, 4595576.5222, 0, 0, 58128580.9676, 54958252.9919, 0, 0,
        20462372.1471, 19529016.2917, 0, 0,
      ],
      hints: {
        index: 6,
      },
    },
    {
      items: [
        8, 4518341.4886, 4502606.0523, 0, 0, 56997533.7265, 54659288.7941, 0, 0,
        20301048.3198, 19351942.0347, 0, 0,
      ],
      hints: {
        index: 7,
      },
    },
    {
      items: [
        9, 5095072.403, 4905098.1413, 0, 0, 62381433.1466, 59523024.5527, 0, 0,
        22079448.3367, 21178851.1654, 0, 0,
      ],
      hints: {
        index: 8,
      },
    },
    {
      items: [
        10, 5176943.4655, 5225035.3877, 0, 0, 64183946.7657, 61638189.6286, 0,
        0, 22648408.6438, 21825272.7515, 0, 0,
      ],
      hints: {
        index: 9,
      },
    },
    {
      items: [
        11, 4960218.7484, 4841556.0488, 0, 0, 62302678.7735, 58339811.6852, 0,
        0, 22021615.6949, 20694195.163, 0, 0,
      ],
      hints: {
        index: 10,
      },
    },
    {
      items: [
        12, 5423226.4033, 5302608.0102, 0, 0, 65897811.9275, 61658821.7184, 0,
        0, 23011882.633, 21483454.6568, 0, 0,
      ],
      hints: {
        index: 11,
      },
    },
    {
      items: [
        13, 5267655.2441, 5690019.0188, 0, 0, 65958482.3475, 65716392.4992, 0,
        0, 22932875.2805, 22953509.6469, 0, 0,
      ],
      hints: {
        index: 12,
      },
    },
    {
      items: [
        14, 5150351.8839, 4669526.5253, 0, 0, 65310058.6427, 56072924.4511, 0,
        0, 22888107.9027, 19742251.3793, 0, 0,
      ],
      hints: {
        index: 13,
      },
    },
    {
      items: [
        15, 5512139.5747, 5233313.2101, 0, 0, 69036334.8061, 62942686.3758, 0,
        0, 24394444.5197, 21991485.0795, 0, 0,
      ],
      hints: {
        index: 14,
      },
    },
    {
      items: [
        16, 6150782.8172, 5059253.5783, 0, 0, 74461736.3673, 61778105.2074, 0,
        0, 26323635.5316, 21426775.8062, 0, 0,
      ],
      hints: {
        index: 15,
      },
    },
    {
      items: [
        17, 4858647.5717, 5243897.8415, 0, 0, 61404108.2114, 62464739.3597, 0,
        0, 21721955.5845, 21540292.6836, 0, 0,
      ],
      hints: {
        index: 16,
      },
    },
    {
      items: [
        18, 5350203.6841, 5402178.7216, 0, 0, 67807079.23, 64755806.67, 0, 0,
        23939026.2031, 22173445.6018, 0, 0,
      ],
      hints: {
        index: 17,
      },
    },
    {
      items: [
        19, 5805479.7063, 5898638.9954, 0, 0, 71254523.0592, 69530140.9819, 0,
        0, 25051829.7476, 23976572.3038, 0, 0,
      ],
      hints: {
        index: 18,
      },
    },
    {
      items: [
        20, 5412354.1364, 6014801.9212, 0, 0, 67065819.6983, 69746663.6412, 0,
        0, 23638729.7768, 23822793.1831, 0, 0,
      ],
      hints: {
        index: 19,
      },
    },
    {
      items: [
        21, 6865538.922, 7027852.2051, 0, 0, 81001432.8922, 78538222.8681, 0, 0,
        28442019.196, 26859913.7456, 0, 0,
      ],
      hints: {
        index: 20,
      },
    },
    {
      items: [
        22, 5094923.5836, 4721574.2371, 0, 0, 63358042.9311, 56586269.4206, 0,
        0, 22233172.9972, 19530781.1996, 0, 0,
      ],
      hints: {
        index: 21,
      },
    },
    {
      items: [
        23, 5715489.5843, 5410737.1137, 0, 0, 70872374.0291, 64326703.3832, 0,
        0, 24644192.7829, 21890903.7595, 0, 0,
      ],
      hints: {
        index: 22,
      },
    },
    {
      items: [
        24, 5170172.0638, 5322092.995, 0, 0, 65624515.7493, 63815392.4392, 0, 0,
        22889619.0791, 21758670.2427, 0, 0,
      ],
      hints: {
        index: 23,
      },
    },
    {
      items: [
        25, 5764308.3378, 6253196.961, 0, 0, 69695119.2824, 71703168.0025, 0, 0,
        24133722.0873, 24117378.1598, 0, 0,
      ],
      hints: {
        index: 24,
      },
    },
    {
      items: [
        26, 6540707.6004, 6828556.2059, 0, 0, 77349521.0606, 76584129.2488, 0,
        0, 26746226.9418, 25793796.0725, 0, 0,
      ],
      hints: {
        index: 25,
      },
    },
    {
      items: [
        27, 6257826.5519, 5499690.3529, 0, 0, 74086449.3883, 64314117.8182, 0,
        0, 25833906.7421, 21796222.4327, 0, 0,
      ],
      hints: {
        index: 26,
      },
    },
    {
      items: [
        28, 5209539.096, 5233198.5191, 0, 0, 67147175.5839, 64165641.4583, 0, 0,
        23487712.6982, 22057882.7588, 0, 0,
      ],
      hints: {
        index: 27,
      },
    },
    {
      items: [
        29, 5591550.1152, 5210715.6963, 0, 0, 69711890.8571, 63863513.7482, 0,
        0, 24278101.3108, 21832598.4132, 0, 0,
      ],
      hints: {
        index: 28,
      },
    },
    {
      items: [
        30, 5407391.3709, 5185203.7163, 0, 0, 67946673.5886, 63400490.3012, 0,
        0, 23928773.7541, 22005875.5018, 0, 0,
      ],
      hints: {
        index: 29,
      },
    },
    {
      items: [
        31, 5526094.8982, 5201135.1707, 0, 0, 68730810.6415, 63423742.4069, 0,
        0, 23726136.9879, 22080876.0732, 0, 0,
      ],
      hints: {
        index: 30,
      },
    },
    {
      items: [
        32, 5648101.5574, 5466411.7827, 0, 0, 70387627.5118, 66758343.1083, 0,
        0, 24365311.2461, 23420882.9253, 0, 0,
      ],
      hints: {
        index: 31,
      },
    },
    {
      items: [
        33, 0, 0, 5208735.4338, 5524645.8769, 0, 0, 65184484.8366,
        67787867.8744, 0, 0, 22772305.7808, 23971094.1467,
      ],
      hints: {
        index: 32,
      },
    },
    {
      items: [
        34, 0, 0, 5470037.231, 5691274.7049, 0, 0, 66432870.5654, 68693635.7232,
        0, 0, 22872206.2851, 24033419.663,
      ],
      hints: {
        index: 33,
      },
    },
    {
      items: [
        35, 0, 0, 5890199.0645, 6555715.1118, 0, 0, 70227790.346, 76497489.2993,
        0, 0, 24237394.6318, 26827002.5196,
      ],
      hints: {
        index: 34,
      },
    },
    {
      items: [
        36, 0, 0, 4690055.7249, 4944431.1033, 0, 0, 58280938.0442,
        60819195.9908, 0, 0, 20532405.3186, 21740297.4738,
      ],
      hints: {
        index: 35,
      },
    },
    {
      items: [
        37, 0, 0, 4902504.6825, 5442590.5359, 0, 0, 60637386.9984, 63788232.65,
        0, 0, 21263415.4547, 22407775.5042,
      ],
      hints: {
        index: 36,
      },
    },
    {
      items: [
        38, 0, 0, 4884258.6452, 5182869.9754, 0, 0, 60395425.9959,
        63099803.0636, 0, 0, 21056640.4673, 22109236.3834,
      ],
      hints: {
        index: 37,
      },
    },
    {
      items: [
        39, 0, 0, 4794892.5942, 5245460.0056, 0, 0, 60227364.7493,
        65423733.3446, 0, 0, 20996659.4512, 22810510.5746,
      ],
      hints: {
        index: 38,
      },
    },
    {
      items: [
        40, 0, 0, 4700658.3435, 4975178.6916, 0, 0, 60886261.7294,
        63003976.8136, 0, 0, 21822484.5146, 22470235.6025,
      ],
      hints: {
        index: 39,
      },
    },
    {
      items: [
        41, 0, 0, 4905077.8788, 5267126.4213, 0, 0, 61642023.637, 64892145.2825,
        0, 0, 21816526.4691, 23157598.4033,
      ],
      hints: {
        index: 40,
      },
    },
    {
      items: [
        42, 0, 0, 4782187.2276, 5200612.6958, 0, 0, 60601212.6232,
        63229690.5445, 0, 0, 21583779.8265, 22380908.6984,
      ],
      hints: {
        index: 41,
      },
    },
    {
      items: [
        43, 0, 0, 4693770.9634, 4906077.8934, 0, 0, 59366438.1148,
        60667622.3203, 0, 0, 21179006.3853, 21698359.2742,
      ],
      hints: {
        index: 42,
      },
    },
    {
      items: [
        44, 0, 0, 4674837.1421, 4933877.3711, 0, 0, 58315892.7898,
        60361020.7245, 0, 0, 20645513.7, 21196311.3788,
      ],
      hints: {
        index: 43,
      },
    },
    {
      items: [
        45, 0, 0, 4693495.0252, 5243178.4142, 0, 0, 58334697.4002,
        62183689.5867, 0, 0, 20640635.9305, 21879262.4873,
      ],
      hints: {
        index: 44,
      },
    },
    {
      items: [
        46, 0, 0, 4845905.4491, 5612070.938, 0, 0, 59392075.1705, 65449448.416,
        0, 0, 20861702.4254, 23027055.0583,
      ],
      hints: {
        index: 45,
      },
    },
    {
      items: [
        47, 0, 0, 4794980.1451, 4817313.266, 0, 0, 56612809.4239, 55955123.5472,
        0, 0, 19825787.1496, 19867396.7009,
      ],
      hints: {
        index: 46,
      },
    },
    {
      items: [
        48, 0, 0, 4523018.1448, 4595513.6637, 0, 0, 55696293.499, 56519692.032,
        0, 0, 19875197.5976, 19981949.5966,
      ],
      hints: {
        index: 47,
      },
    },
    {
      items: [
        49, 0, 0, 4654437.0283, 5244627.7981, 0, 0, 57639649.2979,
        62023820.6351, 0, 0, 20459670.3356, 21731464.4993,
      ],
      hints: {
        index: 48,
      },
    },
    {
      items: [
        50, 0, 0, 4772431.256, 5084863.9784, 0, 0, 57622379.887, 59647231.5819,
        0, 0, 20306577.5918, 20874884.5438,
      ],
      hints: {
        index: 49,
      },
    },
    {
      items: [
        51, 0, 0, 5292074.4452, 6248237.6808, 0, 0, 62101165.3817,
        71524178.7526, 0, 0, 21760049.0618, 25183157.5545,
      ],
      hints: {
        index: 50,
      },
    },
    {
      items: [
        52, 0, 0, 4772625.1013, 4828015.1191, 0, 0, 56738112.0298,
        54924677.2101, 0, 0, 19985790.1991, 19215470.6314,
      ],
      hints: {
        index: 51,
      },
    },
  ],
  additionalTables: [],
  user: "Colt.Street@dataventures.com",
  static: false,
  wait: 0,
  runtime: {},
  legend: false,
  config: {
    measure: "DNGP",
    time: "actual",
  },
  style:
    'font-family:"Montserrat",sans-serif;font-size:11px;font-style:Normal;font-weight:Normal;color:#000000;background-color:transparent;border-style:None;border-top-color:#FFFFFF;border-right-color:#FFFFFF;border-bottom-color:#FFFFFF;border-left-color:#FFFFFF;border-top-width:0px;border-right-width:0px;border-bottom-width:0px;border-left-width:0px;border-top-left-radius:0px;border-top-right-radius:0px;border-bottom-right-radius:0px;border-bottom-left-radius:0px;padding-top:0px;padding-bottom:0px;padding-left:0px;padding-right:0px;margin-top:0px;margin-bottom:0px;margin-left:0px;margin-right:0px;',
};

renderCore(data);
