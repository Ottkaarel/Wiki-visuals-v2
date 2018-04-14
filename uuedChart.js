
d3.csv('uued.csv', function(error, data) {
	if (error) {
			console.error('Error getting or parsing the data.');
			throw error;
	}
	var chart = bubbleChart().title("Uued eestikeelsed artiklid");
	d3.select('#uuteChart').datum(data).call(chart);
});


function bubbleChart() {
	var width = 1000,
	height = 900,
	marginTop = 40,
	minRadius = 5,
	maxRadius = 70,
	columnForTitle = "art",
	columnForRadius = "size",
	forceApart = -30,
	unitName="baiti infot",
  colors = d3.scaleOrdinal(d3.schemeCategory10),
	chartSelection,
	chartSVG,
	showTitleOnCircle=true;


	function chart(selection) {
		var data = selection.datum();
		chartSelection=selection;
		var div = selection,
		svg = div.selectAll('svg');
		svg.attr('width', width).attr('height', height);
		chartSVG=svg;

		var tooltip = selection
		.append("div")
		.style("position", "absolute")
		.style("visibility", "hidden")
		.style("color", "white")
		.style("padding", "8px")
		.style("background-color", "#180c42")
		.style("border-radius", "6px")
		.style("text-align", "center")
		.style("font-family", "monospace")
    .style("font-size", "15px")
		.text("");



		var scaleRadius = d3.scaleSqrt().domain([0, 220000]).range([minRadius,maxRadius])


		var simulation = d3.forceSimulation(data)
		.force("charge", d3.forceManyBody().strength(function(d){
    return - scaleRadius(d.size*3) * 2.5 ;
  }))
		.force("x", d3.forceX(10))
		.force("y", d3.forceY(10))
		.force("collide", d3.forceCollide(function(d){
    return scaleRadius(d.size) + 4;
  }))
		.on("tick", ticked);


		function ticked(e) {
			node.attr("transform",function(d) {
				return "translate(" + [d.x+(width / 2), d.y+((height+marginTop) / 2)] +")";
			});
		}

    function randomColor() {
      var random = Math.floor(Math.random() * 10);
      return colors(random);
    }

    function openWiki(d) {
      return window.open("http://et.wikipedia.org/wiki/" + d, "_blank");
    }


		var node = svg.selectAll("circle")
		.data(data)
		.enter()
		.append("g")
		.attr('transform', 'translate(' + [width / 2, height / 2] + ')')
		.style('opacity',1);

		node.append("circle")
		.attr("id",function(d,i) {
			return i;
		})
		.attr('r', function(d) {
			return scaleRadius(d[columnForRadius]);
		})
		.style("fill", function(d) {
      return randomColor();
		})
    .style('cursor', 'pointer')
    .on("click", function(d) {
      return openWiki(d[columnForTitle]);
    })
		.on("mouseover", function(d) {
      simulation
				.alpha(0.2)
				.restart();
			tooltip.html(d[columnForTitle] + "<br/>" + d[columnForRadius] + " "+ unitName);
			return tooltip.style("visibility", "visible");
		})
		.on("mousemove", function() {
			return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
		})
		.on("mouseout", function() {
			return tooltip.style("visibility", "hidden");
		});
    node.append("clipPath")
		.attr("id",function(d,i) {
			return "clip-"+i;
		})
		.append("use")
		.attr("xlink:href",function(d,i) {
			return "#" + i;
		});
		if (showTitleOnCircle) {
			node.append("text")
			.attr("clip-path",function(d,i) {
				return "url(#clip-" + i + ")"
			})
			.attr("text-anchor", "middle")
			.attr("font-family", "Rubik")
			.attr("font-size", function(d) {
				if(scaleRadius(d[columnForRadius]) > 40) return "14px";
				return "10px";

			})
			.append("tspan")
			.attr("x",function(d) {
				return 0;
			})
			.attr("y",function(d) {
				return ".3em";
			})
			.text(function(d) {
				if(scaleRadius(d[columnForRadius]) > 15) return d[columnForTitle].substring(0, 7) + "..";
				else return "";
			})
      .style('cursor', 'pointer')
      .on("click", function(d) {
        return openWiki(d[columnForTitle]);
      })
			.on("mouseover", function(d) {
				tooltip.html(d[columnForTitle] + "<br/>" + d[columnForRadius] + " "+ unitName);
				return tooltip.style("visibility", "visible");
			})
			.on("mousemove", function() {
				return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
			})
			.on("mouseout", function() {
				return tooltip.style("visibility", "hidden");
			});
		}

		svg.append('text')
			.attr('x',width/2).attr('y',marginTop)
			.attr("text-anchor", "middle")
			.attr("font-size","1.8em")
			.attr("font-family", "Rubik")
			.text(title)

	}


	chart.width = chartWidth;
	chart.height = chartHeight;
	chart.columnForRadius = chartColForRadius;
	chart.columnForTitle = chartColForTitle;
	chart.minRadius = chartMinRadius;
	chart.maxRadius = chartMaxRadius;
	chart.forceApart = chartForceApart;
	chart.unitName = chartUnitName;
	chart.showTitleOnCircle = chartShowTitleOnCircle;
	chart.title=chartTitle;



	function chartWidth(value) {
		if (!arguments.length) {
			return width;
		}
		width = value;
		return chart;
	};


	function chartHeight(value) {
		if (!arguments.length) {
			return height;
		}
		height = value;
		marginTop=0.05*height;
		return chart;
	};



	function chartColForTitle(value) {
		if (!arguments.length) {
			return columnForTitle;
		}
		columnForTitle = value;
		return chart;
	};


	function chartColForRadius (value) {
		if (!arguments.length) {
			return columnForRadius;
		}
		columnForRadius = value;
		return chart;
	};


	function chartMinRadius(value) {
		if (!arguments.length) {
			return minRadius;
		}
		minRadius = value;
		return chart;
	};


	function chartMaxRadius(value) {
		if (!arguments.length) {
			return maxRadius;
		}
		maxRadius = value;
		return chart;
	};


	function chartUnitName(value) {
		if (!arguments.length) {
			return unitName;
		}
		unitName = value;
		return chart;
	};


	function chartForceApart(value) {
		if (!arguments.length) {
			return forceApart;
		}
		forceApart = value;
		return chart;
	};


	function chartShowTitleOnCircle(value) {
		if (!arguments.length) {
			return showTitleOnCircle;
		}
		showTitleOnCircle = value;
		return chart;
	};


	function chartTitle(value) {
		if (!arguments.length) {
			return title;
		}
		title = value;
		return chart;
	}

	return chart;
}
