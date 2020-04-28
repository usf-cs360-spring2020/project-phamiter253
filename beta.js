var data = [
	{ 
		name: "Anime Database",
		id: "Anime Database",
		parent: ""
	}
];

div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1e-6);

function makePie(data, colors){
	var width = 100
    height = 100
    margin = 10

	// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
	var radius = Math.min(width, height) / 2 - margin

	// append the svg object to the div called 'my_dataviz'
	var svg = d3.select("#here")
	  .append("svg")
	    .attr("width", width)
	    .attr("height", height)
	  .append("g")
	    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

	// Create dummy data

	// set the color scale
	var color = d3.scaleOrdinal()
	  .domain(data)
	  .range(colors)

	// Compute the position of each group on the pie:
	var pie = d3.pie()
	  .value(function(d) {return d.value; })
	var data_ready = pie(d3.entries(data))

	// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
	svg
	  .selectAll('whatever')
	  .data(data_ready)
	  .enter()
	  .append('path')
	  .attr('d', d3.arc()
	    .innerRadius(0)
	    .outerRadius(radius)
	  )
	  .attr('fill', function(d){ return(color(d.data.key)) })
	 
}

const details = d3.select("#anime_info");

const body = details.append("xhtml:body")
  .style("text-align", "left")
  .style("background", "none")
  .html("<p>N/A</p>");

details.style("visibility", "hidden");

d3.csv("data/newAnimeColumns.csv").then(function(csv){
	global_csv = csv;
	createLegend();
	filterYears("1986-1999");

	
  });

var radio = d3.select("#color_choices")

radio.on("change", function(){
	var form = document.getElementById("color_choices");
	var form_val;
	for(var i=0; i<form.length; i++){
	    if(form[i].checked){
	      form_val = form[i].value;
	  	}
	}
	changeNodes = d3.select("#beta").selectAll("circle")

	var color = d3.scaleThreshold()
	  .domain([6.9, 7.5])
	  .range(["#9e1a1a", "#fed000", "#80c904"])

	var genderColor = function(d){
		if(parseInt(d.data.data.male_favorites) > parseInt(d.data.data.female_favorites)){
			return "#ff6961";
		}else if(parseInt(d.data.data.male_favorites) < parseInt(d.data.data.female_favorites)){
			return "#3c89d0";
		}else{
			return "purple";
		}
	};

	var ageColor = function(d){
		if(parseInt(d.data.data.teen_favorites) > parseInt(d.data.data.adult_favorites) && parseInt(d.data.data.teen_favorites) > parseInt(d.data.data.young_adult_favorites)){
			return "#90ee90";
		}else if(parseInt(d.data.data.young_adult_favorites) > parseInt(d.data.data.teen_favorites) && parseInt(d.data.data.young_adult_favorites) > parseInt(d.data.data.adult_favorites)){
			return "#77ab59";
		}else if(parseInt(d.data.data.adult_favorites) > parseInt(d.data.data.teen_favorites) && parseInt(d.data.data.adult_favorites) > parseInt(d.data.data.young_adult_favorites)){
			return "#234d20";
		}else{
			return "#d4af37";
		}
	};

	if(form_val == 'ratings'){
		changeNodes.attr("fill", d => d.children ? "black" : color(d.data.data.score))
	}else if(form_val == 'gender'){
		changeNodes.attr("fill", d => d.children ? "black" : genderColor(d))
	}else{
		changeNodes.attr("fill", d => d.children ? "black" : ageColor(d))
	}
})

function updateColor(nodes){
	var form = document.getElementById("color_choices");
	var form_val;
	for(var i=0; i<form.length; i++){
	    if(form[i].checked){
	      form_val = form[i].value;
	  	}
	}

	var color = d3.scaleThreshold()
	  .domain([6.9, 7.5])
	  .range(["#9e1a1a", "#fed000", "#80c904"])

	var genderColor = function(d){
		if(parseInt(d.data.data.male_favorites) > parseInt(d.data.data.female_favorites)){
			return "#ff6961";
		}else if(parseInt(d.data.data.male_favorites) < parseInt(d.data.data.female_favorites)){
			return "#3c89d0";
		}else{
			return "purple";
		}
	};

	var ageColor = function(d){
		if(parseInt(d.data.data.teen_favorites) > parseInt(d.data.data.adult_favorites) && parseInt(d.data.data.teen_favorites) > parseInt(d.data.data.young_adult_favorites)){
			return "#90ee90";
		}else if(parseInt(d.data.data.young_adult_favorites) > parseInt(d.data.data.teen_favorites) && parseInt(d.data.data.young_adult_favorites) > parseInt(d.data.data.adult_favorites)){
			return "#77ab59";
		}else if(parseInt(d.data.data.adult_favorites) > parseInt(d.data.data.teen_favorites) && parseInt(d.data.data.adult_favorites) > parseInt(d.data.data.young_adult_favorites)){
			return "#234d20";
		}else{
			return "#d4af37";
		}
	};

	if(form_val == 'ratings'){
		nodes.attr("fill", d => d.children ? "black" : color(d.data.data.score))
	}else if(form_val == 'gender'){
		nodes.attr("fill", d => d.children ? "black" : genderColor(d))
	}else{
		nodes.attr("fill", d => d.children ? "black" : ageColor(d))
	}
}

function update(str){
  d3.selectAll('svg > g > *').remove();
  while(data.length > 1) {
    data.pop();
  }
  filterYears(str);
}

function filterYears(str){
	var range = str.split("-");
	var filter = global_csv.filter(function(row) {
		if (parseInt(row['year']) >= parseInt(range[0]) && parseInt(row['year']) <= parseInt(range[1])){
			return row;
		}
	});
	buildHierarchy(filter);
}

function createLegend(){

	var tip = d3.select("body").append("div")
    .attr("class", "tooltip1")
    .style("opacity", 1e-6)
    .style("width", "140px")
	.style("height", "70px");

  var color = d3.scaleThreshold()
	  .domain([0, 6.9, 7.5])
	  .range(["#9e1a1a", "#fed000", "#80c904"]) 

  var legend = d3.select("#legend");

  legend.selectAll("dots")
  .data(color.domain())
  .enter()
  .append("circle")
    .attr("cx", function(d,i){ return 20 + i*80})
    .attr("cy", 10) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 10)
    .style("fill", function(d){ 
    	if(d == 0){
    		return "#9e1a1a";
    	}else if (d == 6.9){
    		return "#fed000";
    	}else{
    		return  "#80c904";
    	}
    });

    legend.selectAll("dots")
	  .data(["Male", "Female", "Both"])
	  .enter()
	  .append("circle")
	    .attr("cx", function(d,i){ return 20 + i*80})
	    .attr("cy", 80) // 100 is where the first dot appears. 25 is the distance between dots
	    .attr("r", 10)
	    .style("fill", function(d){ 
	    	if(d == "Male"){
	    		return "#ff6961";
	    	}else if (d == "Female"){
	    		return "#3c89d0";
	    	}else{
	    		return  "purple";
	    	}
	    });

	legend.selectAll("dots")
	  .data(["Teens", "Young", "Adults"])
	  .enter()
	  .append("circle")
	    .attr("cx", function(d,i){ return 20 + i*80})
	    .attr("cy", 150) // 100 is where the first dot appears. 25 is the distance between dots
	    .attr("r", 10)
	    .style("fill", function(d){ 
	    	if(d == "Teens"){
	    		return "#90ee90";
	    	}else if (d == "Young"){
	    		return "#77ab59";
	    	}else{
	    		return  "#234d20";
	    	}
	    });

	legend.selectAll("dots")
		.data(["MultiAge"])
	  .enter()
	  .append("circle")
	    .attr("cx", 20  + 3*80)
	    .attr("cy", 150) // 100 is where the first dot appears. 25 is the distance between dots
	    .attr("r", 10)
	    .style("fill", "#d4af37");

	legend.selectAll("dots")
		.data(["Either100", "Both100"])
	  .enter()
	  .append("circle")
	    .attr("cx", function(d,i){ return 20 + i*80})
	    .attr("cy", 220) // 100 is where the first dot appears. 25 is the distance between dots
	    .attr("r", 9)
	    .attr("stroke", function(d){
	    	if(d == "Either100"){
	    		return "black";
	    	}else{
	    		return "red";
	    	}
	    })
	    .attr("stroke-width", 2)
	    .style("fill", "white");


	const dots = legend.selectAll("circle")
		.on("mouseout", mouseout)
		.on("mouseover", mouseover)
		.on("mousemove", function() {
			let currentNode = d3.select(this);
    		let currentData = currentNode.datum();

			var text = "Score is greater than 0";

			if(currentData == "6.9"){
				text = "Score is greater than 6.9";
			}else if(currentData == "7.5"){
				text = "Score is greater then 7.5";
			}else if(currentData == "Male"){
				text = "Favorited more by Men";
			}else if(currentData == "Female"){
				text = "Favorited more by Women";
			}else if(currentData == "Both"){
				text = "Equally favorited by both Genders";
			}else if(currentData == "Teens"){
				text = "Favorited more by Teens<br/>(19 and below)";
			}else if(currentData == "Young"){
				text = "Favorited more by Young Adults<br/>(20 &le; and &le; 35)";
			}else if(currentData == "Adults"){
				text = "Favorited more by Adults<br/>(35 < and &le; 60)";
			}else if(currentData == "MultiAge"){
				text = "Favorited by Multiple Generations Equally";
			}else if(currentData == "Either100"){
				text = "Ranked in the Top 100 for Overall Scores or Popularity";
			}else if(currentData == "Both100"){
				text = "Ranked in the Top 100 for Overall scores and Popularity";
			}
			tip
	   .html(`<h1 style="font-family: 'Georgia'; color: white">${text}</h1>`)
	      .style("left", (d3.event.pageX) - 140/2 + "px")
	      .style("top", (d3.event.pageY) - 80 + "px");
	      
		});

	function mouseover() {
	  tip.transition()
	      .style("opacity", 1);
	}

	function mouseout() {
	  tip.transition()
	      .style("opacity", 1e-6);
	}

}

function buildHierarchy(csv){
	years = [...new Set(csv.map(d => d.year))].sort();
    main_genre = [...new Set(csv.map(d => d.genre + "#" +d.year))]
    other_genres = [...new Set(csv.map(d => d.genres + "#" + d.genre + "#" + d.year))]

    years.forEach( e => {
		var year = {
			name: e,
			id: e,
			parent: "Anime Database"
		};
		data.push(year);
	});

    csv.forEach(row => {
    	total = row.total_favorites.split(":")
    	male = row.total_male.split(":")
    	female = row.total_female.split(":")
    	teens = row.total_teens.split(":")
    	young = row.total_young_adults.split(":")
    	adult = row.total_adults.split(":")
    	senior = row.total_seniors.split(":")
	    anime = {
	      name: row.title,
	      id: row.title,
	      uid: row.uid,
	      synopsis: row.synopsis,
	      genres: row.genres,
	      aired: row.aired,
	      episodes: row.episodes,
	      members: row.members,
	      popularity: row.popularity,
	      rank: row.ranked,
	      score: row.score,
	      img: row.img_url,
	      genre: row.genre,
	      total_favorites: total[1],
	      male_favorites: male[2],
	      female_favorites: female[2],
	      teen_favorites: teens[2],
	      young_adult_favorites: young[2],
	      adult_favorites: adult[2],
	      senior_favorites: senior[2],
	      parent: row.year
	    }
	    data.push(anime);
	  });

    root = d3.stratify()
	  .id(function(row) { return row.name; })
	  .parentId(function(row) {
	    return row.parent;
	  })
	  (data);

	root.count()
  
	root.each(function(node) {
		node.data.leaves = node.value;
	})

	root.sum(row => row.size)

	root.each(function(node) {
		node.data.total = node.value;
	})
  	buildForce(root);
}

function buildForce(data) {

	const root = d3.hierarchy(data);
	const links = root.links();
	const nodes = root.descendants();

	n = root.data.data.leaves;

	width = n + 200;
	height = width;

	var color = d3.scaleThreshold()
	  .domain([6.9, 7.5])
	  .range(["#9e1a1a", "#fed000", "#80c904"]) 

	const svg = d3.select("#beta")
		.attr("viewBox", [-width / 2, -height / 2, width, height]);

	const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(links).id(d => d.id).distance(30).strength(1))
      .force("charge", d3.forceManyBody().strength(-50))
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
      .attr("stroke-width", 1.5)
    .selectAll("circle")
    .data(nodes)
    .join("circle")
      .attr("fill", d => d.children ? "black" : "silver")
      .attr("stroke", function(d){
      	if(!d.children){
      		var rank = parseInt(d.data.data.rank);
      		var pop = parseInt(d.data.data.popularity);
      		if(rank <= 100 && pop <= 100){
      			return "red";
      		}else if(rank <= 100 || pop <= 100){
      			return "black";
      		}
      		return "none";
      	}
      })
      .attr("r", d => d.children ? 5 * d.data.height : 5)
      .call(drag(simulation))
      .style("cursor", "pointer")
                    .on("click", animeInfo)
                    .on("dblclick", seeSimilar)
                    .on("mouseover", mouseover)
				    .on("mousemove", mousemove)
				    .on("mouseout", mouseout);
                  
    updateColor(node);

  simulation.on("tick", () => {
    link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

    node
        .attr("cx", d => d.x)
        .attr("cy", d => d.y);
  });

  function mouseover() {

	  div.transition()
	      .duration(500)
	      .style("opacity", 1);
	}

  function mousemove(d) {
  		var extra = ``;
  		if(d.children){
  			if(d.parent == null){
  				count = node.filter(e => (!e.children && (parseInt(e.data.data.rank) <= 100 || parseInt(e.data.data.popularity) <= 100)));
  				redcount = node.filter(e => (!e.children && parseInt(e.data.data.rank) <= 100 && parseInt(e.data.data.popularity) <= 100));
  			}else{
  				count = node.filter(e => (!e.children && d.children.includes(e) && (parseInt(e.data.data.rank) <= 100 || parseInt(e.data.data.popularity) <= 100)));
  				redcount = node.filter(e => (!e.children && d.children.includes(e) && parseInt(e.data.data.rank) <= 100 && parseInt(e.data.data.popularity) <= 100));
  				numfavs = 0;
  				favs = d.children.forEach(n =>{
  					numfavs = numfavs + parseInt(n.data.data.total_favorites);
  				})
  				
  				extra = `Number of total favorites: ${numfavs.toLocaleString()}`;
  			}
  			
  			//console.log("count", redcount._groups[0].length);
  			red = redcount._groups[0].length;
  			black = count._groups[0].length - red;
  			div
	   .html(`<h1 style="font-family: 'Palatino Linotype'">
	   	<strong>${d.data.id} </strong><br/>Number of animes: ${d.data.data.leaves}<br/>
	   	Number of red: ${red}<br/>
	   	Number of black: ${black}<br/>
	   	${extra}
	   	</h1>`)
	      .style("left", (d3.event.pageX) + "px")
	      .style("top", (d3.event.pageY) + "px")
	      .style("width", "150px")
	      .style("height", "auto");

  		}else if(!d.children){
  			div
	   .html(`
	   	<h1 style="font-family: 'Palatino Linotype'; text-align: center"><strong>${d.data.id}</strong></h1>
	   	<div class="columns">
	   		<div class="column is-one-quarter" style="padding-left: 10px">
	   			<br/>
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
	   			<div id="here"></div>
	   		</div>
	   	</div>
	   	 `)
	      .style("left", (d3.event.pageX) + "px")
	      .style("top", (d3.event.pageY) + "px")
	      .style("width", "150px")
	      .style("height", "auto");

	      var data;
	      var color;

	      var colors = d3.scaleThreshold()
			  .domain([6.9, 7.5])
			  .range(["#9e1a1a", "#fed000", "#80c904"])

	      var form = document.getElementById("color_choices");
			var form_val;
			for(var i=0; i<form.length; i++){
			    if(form[i].checked){
			      form_val = form[i].value;
			  	}
			}

	      if(form_val == 'gender'){
	      	data = {Male: parseInt(d.data.data.male_favorites), Female: parseInt(d.data.data.female_favorites)};
	      	color = ["#ff6961", "#3c89d0"];
	      }else if(form_val == 'age'){
	      	data = {Teens: parseInt(d.data.data.teen_favorites), Young: parseInt(d.data.data.young_adult_favorites), Adults: parseInt(d.data.data.adult_favorites)};
	      	color = ["#90ee90", "#77ab59", "#234d20"];
	      }else{
	      	str = parseInt(d.data.data.score);
	      	data = {str: parseFloat(d.data.data.score).toFixed(2)};
	      	color = [colors(d.data.data.score)];
	      }

	      makePie(data, color);
  		}
	}

	function mouseout() {
	  div.transition()
	      .duration(500)
	      .style("opacity", 1e-6);
	}

   function animeInfo(d){
    let currentNode = d3.select(this);
    let currentData = currentNode.datum();
    
    currentData.fx = currentData.x;
    currentData.fy = currentData.y;
    currentNode.datum(currentData);
    
     if(!d.children){
     	var str = d.data.data.genres.slice(1, -1).replace(/[']/gi, "").split(",");
     	var strGenre = ``;
     	str.forEach( e => {
     		strGenre = strGenre + `
					  <span class="tag">${e}</span>
					  `
     	})
     	node.attr("r", e => e != d ? 5 : 10);
        const html = `
        <div class="content" style="padding: 30px">
			<div class="columns">
				<div class="column is-one-third">
			 	<figure class="image">
			    	<img style="width: auto; height: 200px" src="${d.data.data.img}">
			  	</figure>
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
			    <li class="tab is-active" onclick="openTab(event, 'synopsis')">
			      <a>
			        <span>Synopsis</span>
			      </a>
			    </li>
			    <li class="tab" onclick="openTab(event, 'overall')">
			      <a>
			        <span>Overall Ratings</span>
			      </a>
			    </li>
			    <li class="tab" onclick="openTab(event, 'gender_stat')">
			      <a>
			        <span>Ratings Based on Gender</span>
			      </a>
			    </li>
			    <li class="tab" onclick="openTab(event, 'age_stat')">
			      <a>
			        <span>Ratings Based on Age Group</span>
			      </a>
			    </li>
			  </ul>
			</div>
			<div class="content-tab" id="synopsis" style="padding-left: 50px; padding-right: 50px">
				<div class="columns">
					<div class="column is-one-quarter">
						<p class="subtitle" style="font-size: 15px; font-family: 'Georgia'">
						<strong>Aired: </strong>${d.data.data.aired}
						</p>
						<hr style="width: 80%"></hr>
						<p class="subtitle" style="font-size: 15px; font-family: 'Georgia'">
						<strong>Number of Episodes: </strong>${parseInt(d.data.data.episodes)}
						</p>

					</div>
					<div class="column">
						<p class="subtitle" style="font-size: 15px; font-family: 'Georgia'">
						<strong>Synopsis: </strong><br/>${d.data.data.synopsis}
						</p>
					</div>
				</div>
				
			</div>
			<div class="content-tab" id="overall" style="padding-left: 50px; padding-right: 50px; display: none">
				<div class="columns">
					<div class="column is-one-quarter">
						<p class="subtitle" style="font-size: 15px; font-family: 'Georgia'">
						<strong>Total Number<br/> of Favorites: </strong></p>
						<p class="subtitle" style="font-size: 20px; color: gray; text-align:center; font-family: 'Georgia'">${parseInt(d.data.data.total_favorites).toLocaleString()}</p>
						
						<hr style="width: 80%"></hr>
						<p class="subtitle" style="font-size: 15px; font-family: 'Georgia'">
						<strong>Total Number<br/> of Reviews: </strong></p>
						<p class="sutitle" style="font-size: 20px; color: gray; text-align:center; font-family: 'Georgia'">(In Progress)</p>
				
					</div>
					<div class="column">
						<p class="title" style="font-size: 30px; font-family: 'Georgia'">
						<strong>Overall Statistics: <br/>(In Progress)</strong><br/>
						</p>
					</div>
				</div>
				
			</div>

			<div class="content-tab" id="gender_stat" style="padding-left: 50px; padding-right: 50px; display: none">
				<div class="columns">
					<div class="column is-one-quarter">
						<p class="title" style="font-size: 15px"><strong>Number of Favorites from: </strong></p><br/>

						<p class="subtitle" style="font-size: 12px; font-family: 'Georgia';text-indent: 5px">
						<strong>Women: </strong><span style="color: gray">${parseInt(d.data.data.female_favorites).toLocaleString()}<span>
						</p>
						<hr style="width: 80%"></hr>
						<p class="subtitle" style="font-size: 12px; font-family: 'Georgia'; text-indent: 5px">
						<strong>Men: </strong><span style="color: gray">${parseInt(d.data.data.male_favorites).toLocaleString()}<span>
						</p>
					</div>
					<div class="column">
						<p class="title" style="font-size: 30px; font-family: 'Georgia'">
						<strong>Overall Statistics: <br/>(In Progress)</strong><br/>
						</p>
					</div>
				</div>
				
			</div>

			<div class="content-tab" id="age_stat" style="padding-left: 50px; padding-right: 50px; display: none">
				<div class="columns">
					<div class="column is-one-quarter">
						<p class="title" style="font-size: 15px"><strong>Number of Favorites from: </strong></p><br/>

						<p class="subtitle" style="font-size: 12px; font-family: 'Georgia'; text-indent: 5px">
						<strong>Teens: </strong><span style="color: gray">${parseInt(d.data.data.teen_favorites).toLocaleString()}<span>
						</p>
						<hr style="width: 80%"></hr>
						<p class="subtitle" style="font-size: 12px; font-family: 'Georgia'; text-indent: 5px">
						<strong>Young Adults: </strong><span style="color: gray">${parseInt(d.data.data.young_adult_favorites).toLocaleString()}<span>
						</p>
						<hr style="width: 80%"></hr>
						<p class="subtitle" style="font-size: 12px; font-family: 'Georgia'; text-indent: 5px">
						<strong>Adults: </strong><span style="color: gray">${parseInt(d.data.data.adult_favorites).toLocaleString()}<span>
						</p>
					</div>
					<div class="column">
						<p class="title" style="font-size: 30px; font-family: 'Georgia'">
						<strong>Overall Statistics: <br/>(In Progress)</strong><br/>
						</p>
					</div>
				</div>
				
			</div>
			
	    </div>
	     
	    `;

	    body.html(html);
	    details.style("visibility", "visible");
    }
   }

    function seeSimilar(d){
      let currentNode = d3.select(this);
      let currentData = currentNode.datum();
    
      currentData.fx = null;
      currentData.fy = null;
      currentNode.datum(currentData);

      node.attr("fill", d => d.children ? "black" : "silver");
      simNodes = node.filter(e => (currentData.data.data.genre == e.data.data.genre && !e.children));
      updateColor(simNodes);
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