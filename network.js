 
var years;

 d3.csv("data/animes.csv").then(function(csv){
    years = [...new Set(csv.map(d => d.year))];
    var hierarchy1 = d3.nest()
    .key(function(d) { return d.year; })
    .key(function(d) { return d.genre; })
    .key(function(d) { return d.genres; })
    .entries(csv);

//console.log(hierarchy1);
drawBars(csv);
  });


function drawBars(csv){
  //console.log("years", years);
var width = 600,
      height = 600,
      start = 0,
      end = 2.25,
      numSpirals = 3
      margin = {top:50,bottom:50,left:50,right:50};

    var theta = function(r) {
      return numSpirals * Math.PI * r;
    };

    // used to assign nodes color by group
    var color = d3.scaleOrdinal(d3.schemeCategory10);

    var r = d3.min([width, height]) / 2 - 40;

    var radius = d3.scaleLinear()
      .domain([start, end])
      .range([40, r]);

    var svg = d3.select("#vis").append("svg")
      .attr("width", width + margin.right + margin.left)
      .attr("height", height + margin.left + margin.right)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var points = d3.range(start, end + 0.001, (end - start) / 1000);

    var spiral = d3.radialLine()
      .curve(d3.curveCardinal)
      .angle(theta)
      .radius(radius);

    var path = svg.append("path")
      .datum(points)
      .attr("id", "spiral")
      .attr("d", spiral)
      .style("fill", "none")
      .style("stroke", "steelblue");

    var categories = ["leg warmers","soy sauce packet","bag","nail clippers","white out","canvas","chair","mp3 player","sketch pad","drawer","clamp","remote","water bottle","door","eye liner","toe ring","ipod","needle","shoe lace","blouse","paper","shovel","milk","bread","watch","outlet","glow stick","purse","radio","computer","thermometer","clock","desk","money","controller","pool stick","apple","plastic fork","conditioner","plate","grid paper","zipper","wallet","sticky note","flag","photo album","lotion","deodorant","tissue box","glasses","magnet","chapter book","ring","tv","bowl","balloon","lace","car","rug","beef","house","camera","thread","sand paper","fridge","spoon","coasters","box","model car","doll","toothbrush","bananas","shawl","towel","hair tie","newspaper","knife","rusty nail","nail file","cinder block","book","mouse pad","sponge","boom box","soda can","face wash","sailboat","carrots","button","hair brush","phone","sidewalk","cat","stockings","bottle cap","cork","sun glasses","charger","keys","bracelet","tire swing","tooth picks","perfume","sofa","pants","candle","table","air freshener","fork","thermostat","washing machine","tree","tomato","shoes","sharpie","drill press","hanger","twezzers","rubber band","pen","bow","shirt","truck","socks","keyboard","slipper","video games","key chain","television","pillow","lamp shade","puddle","candy wrapper","sandal","mop","couch","greeting card","cell phone","lamp","bed","helmet","piano","window","glass","picture frame","USB drive","screw","ice cube tray","eraser","mirror","chocolate","brocolli","fake flowers","checkbook","paint brush","monitor","street lights","credit card","teddies","flowers","speakers","soap","scotch tape","wagon","cup","toilet","spring","chalk","packing peanuts","headphones","seat belt","floor","pencil","toothpaste","clothes","shampoo","blanket","food","CD","rubber duck","playing card","buckel","bottle","bookmark","twister","cookie jar","lip gloss","clay pot","vase","stop sign"];
      console.log(categories.length);
    var spiralLength = path.node().getTotalLength(),
        N = categories.length,
        barWidth = (spiralLength / N) - 1;
    var someData = [];
    for (var i = 0; i < N; i++) {      
      someData.push({
        cat: categories[i],
        value: Math.random()
      });
    }

    var ordinalScale = d3.scaleBand()
      .domain(categories)
      .range([0, spiralLength]);
    
    // yScale for the bar height
    var yScale = d3.scaleLinear()
      .domain([0, d3.max(someData, function(d){
        return d.value;
      })])
      .range([0, (r / numSpirals) - 30]);

    svg.selectAll("rect")
      .data(someData)
      .enter()
      .append("rect")
      .attr("x", function(d,i){
        
        var linePer = ordinalScale(d.cat),
            posOnLine = path.node().getPointAtLength(linePer),
            angleOnLine = path.node().getPointAtLength(linePer - barWidth);
      
        d.linePer = linePer; // % distance are on the spiral
        d.x = posOnLine.x; // x postion on the spiral
        d.y = posOnLine.y; // y position on the spiral
        
        d.a = (Math.atan2(angleOnLine.y, angleOnLine.x) * 180 / Math.PI) - 90; //angle at the spiral position

        return d.x;
      })
      .attr("y", function(d){
        return d.y;
      })
      .attr("width", function(d){
        return barWidth;
      })
      .attr("height", function(d){
        return yScale(d.value);
      })
      .style("fill", function(d){return color(d.group);})
      .style("stroke", "none")
      .attr("transform", function(d){
        return "rotate(" + d.a + "," + d.x  + "," + d.y + ")"; // rotate the bar
      });
    
    // add date labels
    var tF = d3.timeFormat("%b %Y"),
        firstInMonth = {};

    svg.selectAll("text")
      .data(someData)
      .enter()
      .append("text")
      .attr("dy", 10)
      .style("text-anchor", "start")
      .style("font", "10px arial")
      .append("textPath")
      // only add for the first of each month
      .filter(function(d,i){
        return i % 10 === 0;
      })
      .text(function(d){
        return d.cat;
      })
      // place text along spiral
      .attr("xlink:href", "#spiral")
      .style("fill", "grey")
      .attr("startOffset", function(d){
        return ((d.linePer / spiralLength) * 100) + "%";
      })


    var tooltip = d3.select("#chart")
    .append('div')
    .attr('class', 'tooltip');

    tooltip.append('div')
    .attr('class', 'date');
    tooltip.append('div')
    .attr('class', 'value');

    svg.selectAll("rect")
    .on('mouseover', function(d) {

        tooltip.select('.date').html("Category: <b>" + d.cat + "</b>");
        tooltip.select('.value').html("Value: <b>" + Math.round(d.value*100)/100 + "<b>");

        d3.select(this)
        .style("fill","#FFFFFF")
        .style("stroke","#000000")
        .style("stroke-width","2px");

        tooltip.style('display', 'block');
        tooltip.style('opacity',2);

    })
    .on('mousemove', function(d) {
        tooltip.style('top', (d3.event.layerY + 10) + 'px')
        .style('left', (d3.event.layerX - 25) + 'px');
    })
    .on('mouseout', function(d) {
        d3.selectAll("rect")
        .style("fill", function(d){return color(d.cat);})
        .style("stroke", "none")

        tooltip.style('display', 'none');
        tooltip.style('opacity',0);
    });
}
