
const details = d3.select("#BarsInfo");

const body = details.append("xhtml:body")
  .style("text-align", "left")
  .style("background", "none")
  .html("<p>N/A</p>");

details.style("visibility", "hidden");

d3.csv("data/stacked_grouped.csv", ).then(function(csv){
	drawGraph(csv);
})

//global_csv = d3.csv("animes_with_years_and_genres.csv")

function drawGraph(csv){
  radio = d3.select('#bar_choices')
    .on("click", update)

	subgroups = ["high_count", "low_count"];
	margin = ({top: 30, right: 10, bottom: 80, left: 40});
	height = 500;
	width = 1000;

	color = d3.scaleOrdinal(['#77dd77', '#d83c2d']).domain(d3.range(subgroups.length))

	groups = csv.map(d => d['year'])
	groupName = "year"

	x = d3.scaleBand()
  .domain(d3.range(groups.length))
  .rangeRound([margin.left, width - margin.right])
  .padding(0.15)

	xAxis = d3.axisBottom(x)
  .tickPadding(8)
  .tickFormat((d, i) => groups[i])

  //console.log(csv);

	data = d3.stack()
  	.keys(subgroups)(csv)
 	 .map((data, i) => data.map(([y0, y1]) => [y0, y1, i])) // add an extra array element for the subgroup index

	groupedMax = d3.max(csv, row => d3.max([parseInt(row['high_count']), parseInt(row['low_count'])])) + 50;

	stackedMax = d3.max(data, y => d3.max(y, d => d[1])) + 50;

	y = d3.scaleLinear()
  .domain([0, stackedMax])
  .range([height - margin.bottom, margin.top])

  yAxis = d3.axisLeft(y).tickPadding(8)

	const svg = d3.select("#stackbar")

  const subgroup = svg
    .selectAll(".subgroup")
    .data(data)
    .join("g")
    .attr("class", "subgroup")
    .attr("fill", (d, i) => color(i));

  const rect = subgroup
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", (d, i) => x(i))
    .attr("y", height - margin.bottom)
    .attr("width", x.bandwidth())
    .attr("height", 0)
    .on("mouseover", function(d, i){
        d3.select("#tooltip").remove();
        d3.select("#barline").remove();
        svg.append("line")
          .attr("id", "barline")
          .attr('x1', margin.left)
          .attr('y1', d3.select(this).attr("y"))
          .attr('x2', 1000 - margin.right)
          .attr('y2', d3.select(this).attr("y"))
          .attr('stroke', 'red')

        curr = d3.select(this).datum();
        value = parseInt(curr[1]) - parseInt(curr[0])
        svg.append("text")
          .attr("id", "tooltip")
          .attr("x", d3.select(this).attr("x"))
          .attr("y", parseInt(d3.select(this).attr("y")) - 6)
          .attr("dy", "0.35em")
          .attr("text-anchor", "start")
          .attr("font-size", "12px")
          .attr("font-family", "sans-serif")
          .attr("font-weight", "bold")
          .attr("fill", "black")
          .text(value)
      })
      .on("mouseout", function(){
        d3.select("#tooltip").remove();
        d3.select("#barline").remove();
      })
      .on("click", function(d, i){

        updateBarInfo(csv[i].highest_rated, csv[i].lowest_rated, csv[i].year)
      });

  subgroup.on("mouseenter", function() {
    svg
      .selectAll(".subgroup")
      .transition()
      .style("fill-opacity", 0.15);
    d3.select(this)
      .transition()
      .style("fill-opacity", 1);
  });

  subgroup.on("mouseleave", function() {
    svg
      .selectAll(".subgroup")
      .transition()
      .style("fill-opacity", 1);
  });

  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .style("font-size", "13px")
    .call(xAxis)
     .selectAll("text") 
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");


  const yAxisContainer = svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .style("font-size", "13px")
    .call(yAxis);

  function transitionGrouped() {
    y.domain([0, groupedMax]);
    yAxisContainer
      .transition()
      .duration(500)
      .delay(500)
      .call(yAxis);

    rect
      .transition()
      .duration(500)
      .delay((d, i) => i * 20)
      .attr("x", (d, i) => x(i) + (x.bandwidth() / subgroups.length) * d[2])
      .attr("width", x.bandwidth() / subgroups.length)
      .transition()
      .attr("y", d => y(d[1] - d[0]))
      .attr("height", d => y(0) - y(d[1] - d[0]));
  }

  function transitionStacked() {
    y.domain([0, stackedMax]);
    yAxisContainer
      .transition()
      .duration(500)
      .call(yAxis);

    rect
      .transition()
      .duration(500)
      .delay((d, i) => i * 20)
      .attr("y", d => y(d[1]))
      .attr("height", d => y(d[0]) - y(d[1]))
      .transition()
      .attr("x", (d, i) => x(i))
      .attr("width", x.bandwidth());
  }

  function update(){
    var form = document.getElementById("bar_choices");
      var form_val;
      for(var i=0; i<form.length; i++){
          if(form[i].checked){
            form_val = form[i].value;
          }
      }

  form_val == "stack" ? transitionStacked() : transitionGrouped()
  }
  transitionStacked()
  updateBarInfo(csv[33].highest_rated, csv[33].lowest_rated, csv[33].year)
  
}

function updateBarInfo(highId, lowId, year){
  var animeData;
  var global_csv = d3.csv("data/animes_with_years_and_genres.csv")

  Promise.resolve(global_csv).then(function(value){
    animeData = value.filter(d => d.uid == highId || d.uid == lowId );

    lowAnime = animeData[1].uid == lowId ? animeData[1] : animeData[0]
    highAnime = animeData[0].uid == highId ? animeData[0] : animeData[1]
    //console.log(animeData[0], animeData[1])
    var highstr = highAnime.genres.slice(1, -1).replace(/[']/gi, "").split(",");
      var highGenre = ``;
      highstr.forEach( e => {
        highGenre = highGenre + `
            <span class="tag">${e}</span>
            `
      })

    var lowstr = lowAnime.genres.slice(1, -1).replace(/[']/gi, "").split(",");
      var lowGenre = ``;
      lowstr.forEach( e => {
        lowGenre = lowGenre + `
            <span class="tag">${e}</span>
            `
      })


    const html = `

        <div class="content">
          <p class="title" style="font-size: 20px">Highest Rated Anime of ${year}</p>
          <div class="columns">
            <div class="column is-one-third">
              <img style="width:auto; height: 120px" src="${highAnime.img_url}">
            </div>
            <div class="column">
              <p class="title" id="texts" style="font-size: 15px"> ${highAnime.title}</p>
              <div class="tags are-small">${highGenre}</div>
            </div>
          </div>
            <div class="level">
              <p class="subtitle" style="font-size: 13px; font-family: 'Georgia'">Score: <br/>${parseFloat(highAnime.score).toFixed(2)} / 10</p>
              <p class="subtitle" style="font-size: 13px; font-family: 'Georgia'">Rank: <br/>${parseInt(highAnime.ranked)}</p>
              <p class="subtitle" style="font-size: 13px; font-family: 'Georgia'">Popularity: <br/>${highAnime.popularity}</p>
              <p class="subtitle" style="font-size: 13px; font-family: 'Georgia'">Members: <br/>${parseInt(highAnime.members).toLocaleString()}</p>
            </div>  
        </div>
        <div class="content">
          <p class="title" style="font-size: 20px">Lowest Rated Anime of ${year}</p>
          <div class="columns">
            <div class="column is-one-third">
              <img style="width:auto; height: 120px" src="${lowAnime.img_url}">
            </div>
            <div class="column">
              <p class="title" id="texts" style="font-size: 15px"> ${lowAnime.title}</p>
              <div class="tags are-small">${lowGenre}</div>
            </div>
          </div>
            <div class="level">
              <p class="subtitle" style="font-size: 13px; font-family: 'Georgia'">Score: <br/>${parseFloat(lowAnime.score).toFixed(2)} / 10</p>
              <p class="subtitle" style="font-size: 13px; font-family: 'Georgia'">Rank: <br/>${parseInt(lowAnime.ranked)}</p>
              <p class="subtitle" style="font-size: 13px; font-family: 'Georgia'">Popularity: <br/>${lowAnime.popularity}</p>
              <p class="subtitle" style="font-size: 13px; font-family: 'Georgia'">Members: <br/>${parseInt(lowAnime.members).toLocaleString()}</p>
            </div>  
        </div>

        `

        body.html(html);
        details.style("visibility", "visible");



  })
}

