
d3.csv('isikud.csv', function(error, data) {
	if (error) {
			console.error('Error getting or parsing the data.');
			throw error;
	}
	var chart = isikudChart().title("Eestikeelsesse Wikipediasse panustajad");
	d3.select('#isikuteChart').datum(data).call(chart);
});


function isikudChart() {
	var width = 1000,
	height = 670,
	marginTop = 80,
	minRadius = 10,
	maxRadius = 80,
	columnForColors = "joined",
	columnForTitle = "user",
	columnForRadius = "bytes",
	forceApart = -50,
	unitName="baiti infot",
	customColors=true,
	customRange = ["B02832", "DA5254"],
	customDomain = ["ise", "kutsutud"],
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
		.style("background-color", "#4AA071")
		.style("border-radius", "6px")
		.style("text-align", "center")
		.style("font-family", "monospace")
		.style("font-size", "15px")
		.text("");



		var scaleRadius = d3.scaleSqrt().domain([0, 220000]).range([minRadius,maxRadius])


		var simulation = d3.forceSimulation(data)
		.force("charge", d3.forceManyBody().strength([forceApart]))
		.force("x", d3.forceX())
		.force("y", d3.forceY())
		.force("collide", d3.forceCollide(function(d){
    return scaleRadius(d.bytes) + 1
  }))
		.on("tick", ticked);

		var forceSeparated = d3.forceX(function(d){

	    if(d[columnForColors] == "Ise liitunud"){
	      return -200
	    } else {
	      return 200
	    }
	  }).strength(0.07)

		d3.select("#separate").on("click", function(){

			simulation
				.force("x", forceSeparated)
				.alpha(0.8)
				.restart();
			d3.select("#separate").style("display", "none");
			d3.select("#combine").style("display", "inline");
			d3.selectAll(".label").style("display", "block");
		})

		d3.select("#combine").on("click", function(){

			simulation
				.force("x", d3.forceX())
				.alpha(0.5)
				.restart();
			d3.select("#separate").style("display", "inline");
			d3.select("#combine").style("display", "none");
			d3.selectAll(".label").style("display", "inline");
		})



		function ticked(e) {
			node.attr("transform",function(d) {
				return "translate(" + [d.x+(width / 2), d.y+((height+marginTop) / 2)] +")";
			});
		}

		var colorCircles;
		if (!customColors) {
			colorCircles = d3.scaleOrdinal(d3.schemeCategory10);
		}
		else {
			colorCircles = d3.scaleOrdinal()
			.domain(customDomain)
			.range(customRange);
		}

		var minRadiusDomain = d3.min(data, function(d) {
			return +d[columnForRadius];
		});
		var maxRadiusDomain = d3.max(data, function(d) {
			return +d[columnForRadius];
		});


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
			return colorCircles(d[columnForColors]);
		})
		.on("mouseover", function(d) {
			tooltip.html(d[columnForTitle] + "<br/>" + d[columnForColors] + " kasutaja" + "<br/>" + d[columnForRadius] + " "+ unitName);
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
				if(scaleRadius(d[columnForRadius]) > 40) return "16px";
				else return "10px";

			})
			.append("tspan")
			.attr("x",function(d) {
				return 0;//-1*scaleRadius(d[columnForRadius])/3;
			})
			.attr("y",function(d) {
				return ".3em";//scaleRadius(d[columnForRadius])/4;
			})
			.text(function(d) {
				if(scaleRadius(d[columnForRadius]) > 20) return d[columnForTitle];
				else return "";
			})
			.on("mouseover", function(d) {
				tooltip.html(d[columnForTitle] + "<br/>" + d[columnForColors] + " kasutaja" + "<br/>" + d[columnForRadius] + " "+ unitName);
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
			.text(title);



	}


	chart.width = chartWidth;
	chart.height = chartHeight;
	chart.columnForColors = chartColForColors;
	chart.columnForRadius = chartColForRadius;
	chart.columnForTitle = chartColForTitle;
	chart.minRadius = chartMinRadius;
	chart.maxRadius = chartMaxRadius;
	chart.forceApart = chartForceApart;
	chart.unitName = chartUnitName;
	chart.customColors = chartCustomColors;
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



	function chartColForColors(value) {
		if (!arguments.length) {
			return columnForColors;
		}
		columnForColors = value;
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


	function chartCustomColors(domain,range) {
		customColors=true;
		customDomain=domain;
		customRange=range;
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
