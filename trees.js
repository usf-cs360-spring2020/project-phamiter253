var datatwo = [
	{
		name: "Top 100 & Bottom 100",
		parent: ""
	}
];

div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1e-6);

var reviews;

added = d3.select("#change");

change = added.append("xhtml:body");

const details1 = d3.select("#anime_info");

const body1 = details1.append("xhtml:body")
  .style("text-align", "left")
  .style("background", "none")
  .html("<p>N/A</p>");

details1.style("visibility", "hidden");

d3.csv("data/animes_with_years_and_genres.csv").then(function(csv){
	

	csv = csv.sort(function (a,b) {return a.score - b.score;});

	var i = 0;
	var highest = csv.sort(function (a,b) {return b.score - a.score;}).filter(function(d){
		if(parseFloat(d.score) >= 6.43 && i != 100){
			i++;
			return d;
		}
	});

	var j = 0;
	var lowest = csv.sort(function (a,b) {return a.score - b.score;}).filter(function(d){
		if(parseFloat(d.score) < 6.43 && j != 100){
			j++;
			return d;
		}
	});
	var list = highest.concat(lowest)

	buildhierarchy(list);
});

function buildhierarchy(list){

	years = [...new Set(list.map(d => d.year))].sort();

	years.forEach(e => {
		var year = {
			name: e,
			parent: "Top 100 & Bottom 100"
		}
		datatwo.push(year);
	});

	list.forEach(row => {
		var anime = {
			name:row.title,
			id: row.uid,
			synopsis: row.synopsis,
			genres: row.genres,
			aired: row.aired,
			episodes: row.episodes,
			members: row.members,
	      	popularity: row.popularity,
	      	rank: row.ranked,
	      	score: row.score,
	      	img: row.img_url,
	      	parent: row.year
		}
		datatwo.push(anime);
	});

	root = d3.stratify()
	  .id(function(row) { return row.name; })
	  .parentId(function(row) {
	    return row.parent;
	  })
	  (datatwo);

	root.count()
  
	root.each(function(node) {
		node.data.leaves = node.value;
	})

	root.sum(row => row.size)

	root.each(function(node) {
		node.data.total = node.value;
	})

	buildforce(root)
}

function buildforce(data) {
	
	const root = d3.hierarchy(data);
	const links = root.links();
	const nodes = root.descendants();

	n = root.data.data.leaves;

	width = 720;
	height = 720;

	var lowColor = d3.scaleSequential(d3.interpolateReds)
		.domain([4.5, 1])

	var highColor = d3.scaleSequential(d3.interpolateGreens)
		.domain([8.3, 9.3])

	var color = d3.scaleSequential(d3.interpolateRdYlGn)
		.domain([1, 10])

	const svg = d3.select("#tree")
		.attr("viewBox", [-width / 2, -height / 2, width, height]);

	const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(10).strength(1))
      .force("charge", d3.forceManyBody().strength(-200))
      .force("x", d3.forceX())
      .force("y", d3.forceY());

  const link = svg.append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
    .selectAll("line")
    .data(links)
    .join("line");

  const node = svg.append("g")
      .attr("fill", "#fff")
      .attr("stroke", "#000")
      .attr("stroke-width", 2)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("fill", function (d){
      	if(d.children){
      		return "black"
      	}else if(parseInt(d.data.data.score) > 5){
      		return highColor(d.data.data.score)
      	}else{
      		return lowColor(d.data.data.score)
      	}
      })
      .attr("stroke", function(d){
      	if(!d.children){
      		var pop = parseInt(d.data.data.popularity);
      		if(pop <= 100){
      			return "black";
      		}
      		return "none";
      	}
      })

      .attr("r", d => d.children ? 10 * d.data.depth + 1 : 8)
      .call(drag(simulation))
      .style("cursor", "pointer")
      	.on("click", animeInfo)
      	.on("mouseover", mouseover)
		.on("mousemove", mousemove)
		.on("mouseout", mouseout);

	labels = svg.append("g")
	.selectAll("text")
	.data(nodes)
	.join("text")
	.attr("fill", "white")
	.attr("text-anchor", "middle")
	.style("font-size", "13px")
	.style("font-weight", "bolder")
	.style("font-family", "Georgia")
	/*.attr("x",function(d){ d.x})
	.attr("y", function(d){d.y})*/
    .text(function(d){
    	if(d.children && d.parent != null){
    		
    		return d.data.data.name.slice(2)
    	}
    })
    .call(drag(simulation)); 

  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);

    labels.attr("transform", function(d) {
        return "translate(" + d.x + "," + d.y + ")";
    })    

  });

  function mouseover(d) {
  		if(!d.children){
  		div.transition()
	      .duration(500)
	      .style("opacity", 1);
  		}
	}

	function mousemove(d){
		if(!d.children){
			div
		  .html(`
		  	<h1 style="font-family: 'Palatino Linotype'; text-align: center"><strong>${d.data.data.name}</strong></h1>
	   	<div class="columns">
	   		<div class="column is-one-quarter" style="padding-left: 10px">
	   			<br/>
	   			<p style="font-family: 'Palatino Linotype'; font-size: 10px">
	   			Score:<br/>
	   			<span style="font-size: 15px"><strong>${parseFloat(d.data.data.score).toFixed(2)}</strong></span><br/>
	   			</p><br/>
	   			<p style="font-family: 'Palatino Linotype'; font-size: 12px">
	   			Rank:<br/>
	   			<span style="font-size: 15px"><strong>${parseInt(d.data.data.rank)}</strong></span>
	   			</p><br/>
	   			<p style="font-family: 'Palatino Linotype'; font-size: 10px">
	   			Popularity:<br/>
	   			<span style="font-size: 15px"><strong>${d.data.data.popularity}</strong></span><br/>
	   			</p>
	   			
	   		</div>
	   		<div class="column">
	   			<img style="padding: 10px" src="${d.data.data.img}">
	   		</div>
	   	</div>

		  	`)
		  	.style("left", (d3.event.pageX) + "px")
	      	.style("top", (d3.event.pageY) + "px")
	      	.style("width", "200px")
	      	.style("height", "auto");
		}
	}

	function mouseout() {
	  div.transition()
	      .duration(500)
	      .style("opacity", 1e-6);
	}

	function animeInfo(d){


		if(!d.children){

			var str = d.data.data.genres.slice(1, -1).replace(/[']/gi, "").split(",");
	     	var strGenre = ``;
	     	str.forEach( e => {
	     		strGenre = strGenre + `
				  <span class="tag">${e}</span>
				  `
	     	})
	     	kids = node.filter(e => (!e.children));
	     	kids.attr("r", e => e != d ? 8 : 15);

			const html =  `
				<div class="content" style="margin-bottom: 100px">
					<div class="columns">
						<div class="column is-one-third" align = "center">
					    	<img style="width: auto; height: 200px" src="${d.data.data.img}">
						</div>
						<div class="column">
							<p class="title" id="texts"> ${d.data.data.name}</p>
					  	<div class="level">
					  		<p class="subtitle" style="font-size: 20px; font-family: 'Georgia'">Score: <br/>${parseFloat(d.data.data.score).toFixed(2)} / 10</p>
					  		<p class="subtitle" style="font-size: 20px; font-family: 'Georgia'">Rank: <br/>${parseInt(d.data.data.rank)}</p>
					  		<p class="subtitle" style="font-size: 20px; font-family: 'Georgia'">Popularity: <br/>${d.data.data.popularity}</p>
					  		<p class="subtitle" style="font-size: 20px; font-family: 'Georgia'">Members: <br/>${parseInt(d.data.data.members).toLocaleString()}</p>
					  	</div>
					  	<div class="tags are-medium">${strGenre}</div>
						</div>
					</div>


					<div class="tabs is-boxed">
					  <ul>
					    <li class="tab is-active" onclick="openTab(event, 'ratings')">
					      <a>
					        <span>Overall Ratings</span>
					      </a>
					    </li>
					    <li class="tab" onclick="openTab(event, 'overview')">
					      <a>
					        <span>Overview</span>
					      </a>
					    </li>
					  </ul>
					</div>

					<div class="content-tab" id="ratings">
						<div class="content" style="margin: 30px">
							<p class="title" style="font-size: 20px"><strong>Overall Ratings</strong><br/>
								<span style="font-size: 15px; font-weight: normal">Here are the average scores for each catergory based on the reviews</span>
							</p>

							<div id="here"></div>

							<p class="subtitle" style="font-size: 15px; font-family: 'Georgia'">
							<strong>Total of Reviews: </strong><span id="totalReviews"></span>
							</p>
						</div>
					</div>

					<div class="content-tab" id="overview" style="padding-left: 50px; padding-right: 50px;  display: none">
						<p class="subtitle" style="font-size: 15px; font-family: 'Georgia'">
						<strong>Synopsis: </strong><br/>${d.data.data.synopsis}
						</p>
						<hr></hr>
						<div class="level">
								<p class="subtitle" style="font-size: 15px; font-family: 'Georgia'">
								<strong>Aired: </strong>${d.data.data.aired}
								</p>
								<p class="subtitle" style="font-size: 15px; font-family: 'Georgia'">
								<strong>Number of Episodes: </strong>${parseInt(d.data.data.episodes)}
								</p>

							</div>
					</div>

					


				</div>
			`;
			body1.html(html);
	    	details1.style("visibility", "visible");
	    	drawReviewBars(d.data.data.id)
		}
	}

    return svg.node();
}

function forceSimulation(nodes, links) {
  return d3.forceSimulation(nodes)
           .force("link", d3.forceLink(links).id(d => d.id).distance(50))
           .force("charge", d3.forceManyBody().strength(-50).distanceMax(270))
           .force("center", d3.forceCenter())
}

function drag(simulation){
  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart()
    d.fx = d.x
    d.fy = d.y
  }
  
  function dragged(d) {
    d.fx = d3.event.x
    d.fy = d3.event.y
  }
  
  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0)
    d.fx = null
    d.fy = null
  }
  
  return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
}


function drawReviewBars(id){

	d3.select("#move").remove()
	

	change
		.html(`
			<div class="columns" style="margin-left: 80px">
				<div class="column" style="margin:20px; margin-top: 0px; margin-bottom: 0px">
		            <p class="title">
		              Interactivity
		              </p>
		              <ul>
		                <li><p class="title" style="font-size: 20px"><i class="fas fa-tools"></i> Overview Tooltips</p></li>
		                <p style="font-size: 15px; margin-left: 20px; margin-bottom: 20px">Mouseover a node to see the general information about the anime, including its title, rank, popularity and poster image.</p>
		                <li><p class="title" style="font-size: 20px"><i class="fas fa-info-circle"></i> Individual Anime Details & Stats</p></li>
		                <p style="font-size: 15px; margin-left: 20px; margin-bottom: 20px">Click on the node to display more infomration about the anime and the ratings collected from the reviews. The selected anime node will be slightly bigger.</p>
		              </ul>
		          </div>
		          <div class="column" style="margin:20px; margin-top: 0px; margin-bottom: 0px">
		            <p class="title">
                Encodings
              </p>

              <p class="title" style="font-size: 20px; margin-bottom: 10px;font-weight: normal;">Color Ranges</p>

              <p style="font-family: 'Georgia'">Green Nodes are darker if the anime's score is greater.</p> 
              <div class="level-left">
                <svg width="30" height="20">
                  <rect width="20" height="20" style="fill:rgb(36, 141, 70);">
                </svg>
                <p style="padding-right:20px"> &asymp; 9.3</p>

                <svg width="30" height="20">
                  <rect width="20" height="20" style="fill:rgb(208, 237,202)";>
                </svg>
                <p> &asymp; 8.3</p>
              </div>
                

              <p style="font-family: 'Georgia'">Red nodes are darker if the score is lower.</p>

              <div class="level-left">
                <svg width="30" height="20">
                  <rect width="20" height="20" style="fill:rgb(253, 201, 179);">
                </svg>
                <p style="padding-right:20px"> &asymp; 4.5</p>
                <svg width="30" height="20">
                  <rect width="20" height="20" style="fill:rgb(128, 6, 16);">
                </svg>
                <p> &asymp; 1</p>
              </div>

              <p style="font-family: 'Georgia'">Nodes with black strokes are apart of the top 100 based on popularity</p>

              
              <p class="title" style="font-size: 20px; margin-bottom: 10px; margin-top: 20px;font-weight: normal;">Links</p>
              <p style="font-family: 'Georgia'">Anime nodes or the leaves, are connected to the year when they were released. The parent nodes are labeled with the last two digits for that year</p>
		          </div>
		          <div class="column" style="margin:20px; margin-top: 0px; margin-bottom: 0px">
		            <p class="title">
		              Observations
		            </p>
		            <p>
		            	<strong>2019</strong> has the most highest rated and lowest rated animes within the years 1986-2019. 2019 also has the lowest rated anime in the dataset<br/>
		            	Most of the lowest rated animes scores range around <strong>3 to 4</strong> and highest rated range around <strong>8.5</strong>.<br/>
		            	Of course the lowest rated animes have the most reviews within the lower rated group, but I was surprised to see that the <strong>enjoyment rating is relatively high</strong> compared to the other categories.<br/>
		            </p>
		          </div>
			</div>

			`)


	var results_json = d3.json("data/results5.json")

	Promise.resolve(results_json).then(function(json){
		reviews = json.filter(function(j){
			return j.uid == id
		})

		wid = 450;
		hei = 250;

		var chart = d3.select("#here")
			.append("svg")
			.attr("width", wid)
			.attr("height", hei)
			.style("margin-left", "10px")
			.append("g");

		stringy = JSON.stringify(reviews)
		console.log(stringy)

		if(reviews.length > 0  && !stringy.includes("-")){


			const marign = {top: 20, right: 20, bottom: 30, left: 40},
			w = wid - marign.left - marign.right,
			h = hei - marign.top - marign.bottom,
			x = d3.scaleBand().rangeRound([0, w]).padding(0.2), 
			y = d3.scaleLinear().rangeRound([h, 0]), 
			g = chart.append("g") 
			.attr("transform", `translate(${marign.left},${marign.top})`);


			total = d3.select("#totalReviews")
			.append("text")
			.text(reviews[0].averages.Total_Reviews)

			x.domain(["Story", "Animation", "Sound", "Character", "Enjoyment"]);
			y.domain([0, 10])

			g.append("g")
			.attr("class", "axis axis-x")
			.attr("transform", `translate(0,${h})`) 
			.call(d3.axisBottom(x)); 
			 
			g.append("g")
			.attr("class", "axis axis-y")
			.call(d3.axisLeft(y).ticks(10));

			data = reviews[0].averages; 

			const bar1 = g
			.append("rect")
			.attr("class", "bar")
			.attr("fill", "#3783ff")  
			.attr("x", x("Story")) 
			.attr("y", y(data.Story.toFixed(1))) 
			.attr("width", x.bandwidth()) 
			.attr("height", h - y(data.Story.toFixed(1)));


			chart.append("text")
	          .attr("x",  x("Story") + 50)
	          .attr("y",  y(data.Story) - 3)
	          .attr("dy", "0.35em")
	          .attr("text-anchor", "start")
	          .attr("font-family", "Georgia")
	          .attr("font-size", "18px")
	          .attr("fill", "black")
	          .text(parseFloat(data.Story).toFixed(1))

			const bar2 = g
			.append("rect")
			.attr("class", "bar")
			.attr("fill", "#3783ff")  
			.attr("x", x("Animation")) 
			.attr("y", y(data.Animation.toFixed(1))) 
			.attr("width", x.bandwidth()) 
			.attr("height", h - y(data.Animation.toFixed(1)));


			chart.append("text")
	          .attr("x",  x("Animation") + 50)
	          .attr("y",  y(data.Animation) - 3)
	          .attr("dy", "0.35em")
	          .attr("text-anchor", "start")
	          .attr("font-family", "Georgia")
	          .attr("font-size", "18px")
	          .attr("fill", "black")
	          .text(parseFloat(data.Animation).toFixed(1))


			const bar3 = g
			.append("rect")
			.attr("class", "bar")
			.attr("fill", "#3783ff")  
			.attr("x", x("Sound")) 
			.attr("y", y(data.Sound.toFixed(1))) 
			.attr("width", x.bandwidth()) 
			.attr("height", h - y(data.Sound.toFixed(1)));

			chart.append("text")
	          .attr("x",  x("Sound") + 50)
	          .attr("y",  y(data.Sound) - 3)
	          .attr("dy", "0.35em")
	          .attr("text-anchor", "start")
	          .attr("font-family", "Georgia")
	          .attr("font-size", "18px")
	          .attr("fill", "black")
	          .text(parseFloat(data.Sound).toFixed(1))

			const bar4 = g
			.append("rect")
			.attr("class", "bar")
			.attr("fill", "#3783ff")  
			.attr("x", x("Character")) 
			.attr("y", y(data.Character.toFixed(1))) 
			.attr("width", x.bandwidth()) 
			.attr("height", h - y(data.Character.toFixed(1)));

			chart.append("text")
	          .attr("x",  x("Character") + 50)
	          .attr("y",  y(data.Character) - 3)
	          .attr("dy", "0.35em")
	          .attr("text-anchor", "start")
	          .attr("font-family", "Georgia")
	          .attr("font-size", "18px")
	          .attr("fill", "black")
	          .text(parseFloat(data.Character).toFixed(1))


			const bar5 = g
			.append("rect")
			.attr("class", "bar")
			.attr("fill", "#3783ff")  
			.attr("x", x("Enjoyment")) 
			.attr("y", y(data.Enjoyment.toFixed(1))) 
			.attr("width", x.bandwidth()) 
			.attr("height", h - y(data.Enjoyment.toFixed(1)));


			chart.append("text")
	          .attr("x",  x("Enjoyment") + 50)
	          .attr("y",  y(data.Enjoyment) - 3)
	          .attr("dy", "0.35em")
	          .attr("text-anchor", "start")
	          .attr("font-family", "Georgia")
	          .attr("font-size", "18px")
	          .attr("fill", "black")
	          .text(parseFloat(data.Enjoyment).toFixed(1))


		}else{
			chart.append("text")
				.attr("x", "50%")
				.attr("y", "50%")
				.attr("class", "title")
				.style("font-size", "20px")
				.attr("text-anchor", "middle")
				.text("No Results or Reviews for this Anime")
		}
		//console.log(reviews[0].averages.Story)
	});
}