d3.csv("animes_with_years_and_genres.csv").then(function(csv){
	var hierarchy = d3.nest()
    .key(function(d) { return d.year; })
/*    .key(function(d) { 
    	air = d.aired.split("to");
    	//console.log(air);
    	return air[0];
    	 })
    .key(function(d) { return d.genre; })*/
    .entries(csv);

    console.log(hierarchy)
	
 });


 /*d3.json("results5.json").then(function(json) {
 	console.log(json)
 });*/
 