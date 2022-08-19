/**
 *  Relative Size Chart for d3.js
 */

function relativeSizeChart() {
  var width = 1200,
    margin = 0,
    padding = 16,
    r = d3.scale.linear(),
    onTotalMouseOver = null,
    onTotalClick = null,
    onClusterMouseOver = null,
    onClusterClick = null,
    val = function (d) {
      return d;
    };
  totalFormat = function (d) {
    return d;
  };
  clusterFormat = function (d) {
    return d;
  };
  clusterFormat2 = function (d) {
    return d;
  };

  function chart(selection) {
    selection.each(function (data) {
      //console.log(data);

      var clusterCount = data.Clusters.length,
        totalColWidth = 0.3 * width,
        colWidth = (width - totalColWidth) / clusterCount,
        height = colWidth + 2 * padding,
        maxRadius = (colWidth - 10) / 2;

      var svg = d3.select(this).selectAll("svg").data([data]);

      var svgEnter = svg
        .enter()
        .append("svg")
        .attr("class", function (d) {
          if (
            onTotalMouseOver !== null ||
            onTotalClick !== null ||
            onClusterMouseOver !== null ||
            onClusterClick !== null
          ) {
            return "clickable";
          } else {
            return "static";
          }
        });

      svgEnter.append("g").attr("class", "background");

      svgEnter.append("g").attr("class", "headers");

      svgEnter.append("g").attr("class", "total");

      var background = svg.selectAll("g.background");

      var headers = svg
        .selectAll("g.headers")
        .selectAll("text.header")
        .data(data.Headers, function (d) {
          return d;
        });

      var total = svgEnter.selectAll("g.total");
      //.data(data.Total);

      var cluster = svgEnter
        .selectAll("g.cluster")
        .data(data.Clusters, function (d) {
          return d;
        });

      var clusterEnter = cluster
        .enter()
        .append("g")
        .attr("class", "cluster")
        .attr("transform", function (d, i) {
          return "translate(" + (totalColWidth + i * colWidth) + ",0)";
        });

      var clusters = svg.selectAll("g.cluster");

      svg.attr("width", width).attr("height", height).call(responsivefy);

      r = d3.scale
        .linear()
        .domain([
          0,
          d3.max(data.Clusters, function (d) {
            return d[1];
          }),
        ])
        .range([40, maxRadius]);

      svgEnter
        .selectAll("g.background")
        .append("rect")
        .attr("class", "chart-bg")
        .attr("x", 0)
        .attr("y", padding)
        .attr("height", height - padding)
        .attr("width", width)
        .attr("class", "chart-bg");

      svgEnter
        .selectAll("g.background")
        .append("g")
        .attr("class", "cluster-lines");

      svgEnter
        .selectAll("g.background")
        .append("line")
        .attr("class", "centerline")
        .attr("x1", totalColWidth - padding)
        .attr("x2", width - colWidth / 2)
        .attr("y1", (height + padding) / 2)
        .attr("y2", (height + padding) / 2);

      var clusterLines = svg
        .select("g.cluster-lines")
        .selectAll("line")
        .data(data.Clusters, function (d) {
          return d;
        })
        .enter()
        .append("line")
        .attr("class", "cluster-line");

      headers.enter().append("text").attr("class", "header");

      total
        .append("rect")
        .attr("class", "total-cluster")
        .attr("x", padding)
        .attr("y", 0.2 * (height + 4 * padding))
        .attr("height", 0.5 * height)
        .attr("width", totalColWidth - 2 * padding)
        .attr("rx", 4)
        .attr("ry", 4)
        .on("mouseover", onTotalMouseOver)
        .on("click", onTotalClick);

      total
        .append("text")
        .attr("class", "total-name")
        .attr("x", totalColWidth / 2)
        .attr("y", function (d, i) {
          return (height + padding) / 2 + (padding + 10);
        });

      total
        .append("text")
        .attr("class", "total-value")
        .attr("x", totalColWidth / 2)
        .attr("y", function (d, i) {
          return (height + padding) / 2;
        })
        .text(totalFormat(0));

      clusterEnter
        .append("circle")
        .attr("class", "bubble empty")
        .attr("cx", function (d, i) {
          return colWidth / 2;
        })
        .attr("cy", function (d, i) {
          return (height + padding) / 2;
        })
        .attr("r", "50")
        .on("mouseover", function (d, i, j) {
          if (onClusterMouseOver != null) onClusterMouseOver(d, i, j);
        })
        .on("mouseout", function () {
          /*do something*/
        })
        .on("click", function (d, i) {
          onClusterClick(this, d, i);
        });

      clusterEnter
        .append("text")
        .attr("class", "cluster-value")
        .attr("x", function (d, i) {
          return colWidth / 2;
        })
        .attr("y", function (d, i) {
          return (height + padding) / 2;
        })
        .text(clusterFormat(0));

      clusterEnter
        .append("text")
        .attr("class", "cluster-value-2")
        .attr("x", function (d, i) {
          return colWidth / 2;
        })
        .attr("y", function (d, i) {
          return (height + padding) / 2 + (padding + 10);
        })
        .text(clusterFormat2(0));

      //update attributes
      clusterLines
        .attr("x1", function (d, i) {
          return totalColWidth + i * colWidth;
        })
        .attr("x2", function (d, i) {
          return totalColWidth + i * colWidth;
        })
        .attr("y1", function (d, i) {
          return padding;
        })
        .attr("y2", function (d, i) {
          return height;
        });

      headers
        .attr("x", function (d, i) {
          if (i === 0) {
            return totalColWidth / 2;
          } else {
            return totalColWidth + i * colWidth - colWidth / 2;
          }
        })
        .attr("y", 12);

      //clean up old
      svg.exit().remove();

      cluster
        .exit()
        .selectAll("circle.bubble")
        .style("opacity", 1)
        .style("fill", "#DDD")
        .style("stroke", "#DDD")
        .transition()
        .duration(500)
        .style("opacity", 0);

      cluster.exit().remove();
      headers.exit().remove();

      //update with data
      function update(data) {
        svg
          .selectAll("text.total-value")
          .transition()
          //.delay(100)
          .duration(500)
          .tween("text", function (d) {
            var currentValue = +this.textContent.replace(/\D/g, "");
            var interpolator = d3.interpolateRound(currentValue, data.Total[1]);
            return function (t) {
              this.textContent = totalFormat(interpolator(t));
            };
          });

        svg.selectAll("text.total-name").text(data.Total[0]);

        svg
          .selectAll("circle")
          .attr("class", function (d, i) {
            if (data.Clusters[i][1] === 0) {
              return "bubble empty";
            } else {
              return "bubble";
            }
          })
          .transition()
          .duration(1000)
          .delay(function (d, i) {
            return 100 + i * 100;
          })
          .ease("elastic")
          .attr("r", function (d, i) {
            return r(data.Clusters[i][1]);
          });

        svg
          .selectAll("text.cluster-value")
          .transition()
          .delay(function (d, i) {
            return 100 + i * 100;
          })
          .duration(1000)
          .tween("text", function (d, i) {
            var currentValue = +this.textContent.replace(/\D/g, "");
            var interpolator = d3.interpolateRound(
              currentValue,
              data.Clusters[i][1]
            );
            return function (t) {
              this.textContent = clusterFormat(interpolator(t));
            };
          });

        svg
          .selectAll("text.cluster-value-2")
          .transition()
          .delay(function (d, i) {
            return 100 + i * 100;
          })
          .duration(1000)
          .tween("text", function (d, i) {
            var currentValue = +this.textContent.replace(/\D/g, "");
            var interpolator = d3.interpolateRound(
              currentValue,
              data.Clusters[i][0]
            );
            return function (t) {
              this.textContent = clusterFormat2(interpolator(t));
            };
          });

        headers.text(function (d, i) {
          return data.Headers[i];
        });
      }

      //http://www.brendansudol.com/posts/responsive-d3/
      function responsivefy(svg) {
        // get container + svg aspect ratio
        //var SVG = d3.select(selection).selectAll('svg');
        var container = d3.select(svg.node().parentNode),
          width = parseInt(svg.style("width")),
          height = parseInt(svg.style("height")),
          aspect = width / height;

        // add viewBox and preserveAspectRatio properties,
        // and call resize so that svg resizes on inital page load
        svg
          .attr("viewBox", "0 0 " + width + " " + height)
          .attr("preserveAspectRatio", "xMidYMin meet")
          .call(resize);

        // to register multiple listeners for same event type,
        // you need to add namespace, i.e., 'click.foo'
        // necessary if you call invoke this function for multiple svgs
        // api docs: https://github.com/mbostock/d3/wiki/Selections#on
        d3.select(window).on("resize." + container.attr("id"), resize);

        // get width of container and resize svg to fit it
        function resize() {
          var targetWidth = parseInt(container.style("width"));
          svg.attr("width", targetWidth);
          svg.attr("height", Math.round(targetWidth / aspect));
        }
      }

      update(data);
    });
  }

  chart.totalFormat = function (_) {
    if (!arguments.length) return totalFormat;
    totalFormat = _;
    return chart;
  };
  chart.clusterFormat = function (_) {
    if (!arguments.length) return clusterFormat;
    clusterFormat = _;
    return chart;
  };
  chart.clusterFormat2 = function (_) {
    if (!arguments.length) return clusterFormat2;
    clusterFormat2 = _;
    return chart;
  };

  chart.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };
  chart.onTotalClick = function (_) {
    if (!arguments.length) return onTotalClick;
    onTotalClick = _;
    return chart;
  };

  chart.onTotalMouseOver = function (_) {
    if (!arguments.length) return onTotalMouseOver;
    onTotalMouseOver = _;
    return chart;
  };

  chart.onClusterClick = function (_) {
    if (!arguments.length) return onClusterClick;
    onClusterClick = _;
    return chart;
  };

  chart.onClusterMouseOver = function (_) {
    if (!arguments.length) return onClusterMouseOver;
    onClusterMouseOver = _;
    return chart;
  };

  return chart;
}

var term;

var data = {
  data1: {
    Headers: ["Total", "Col 1A", "Col 2A", "Col 3A", "Col 4A"],
    Total: ["Total # of Widgets", 1200],
    Clusters: [
      [100, 1200],
      [67, 800],
      [42, 500],
      [17, 198],
    ],
  },
  data2: {
    Headers: ["Total", "Col 1B", "Col 2B", "Col 3B", "Col 4B"],
    Total: ["Total # of Wedgets", 1201],
    Clusters: [
      [24, 285],
      [37, 466],
      [37, 449],
      [0, 0],
    ],
  },
};

$(function () {
  $(".filter-switch a").on("click", function (event) {
    event.preventDefault();
    term = $(this).text();
    console.log(term);

    $(this).parent("li").addClass("active").siblings().removeClass("active");

    d3.select("#overview-graph")
      .datum(data[term])
      .call(
        relativeSizeChart()
          .totalFormat(function (d) {
            return d;
          })
          .clusterFormat(function (d) {
            return d;
          })
          .clusterFormat2(function (d) {
            return d + "%";
          })
      );
  });
  $(".filter-switch li.active a").trigger("click");
});
