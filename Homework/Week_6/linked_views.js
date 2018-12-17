// Wiebe Jelsma (12468223)
window.onload = function() {

    var university = "data.json"
    var data = "world_countries.json"
    var requests = [d3.json(university), d3.json(data)];
  
    Promise.all(requests).then(function(response) {
        var countries = []
        var educationYears = []
        var income = []
        var life = []
        var University = response[0];
        var data = response[1];
        console.log(University);
        // console.log(University.Country)
        for(i=0;i<39;i++){
            countries.push(Object.values(University.Country)[i])
            income.push(Object.values(University.Value)[i])
        }
        for(i=39;i<78;i++){
            educationYears.push(Object.values(University.Value)[i])
        }
        for(i=78; i<117;i++){
            life.push(Object.values(University.Value)[i])   
        }

        console.log(life)
          
  
        var format = d3.format(",");
  
        // Set tooltips
        var tip = d3.tip()
                    .attr('class', 'd3-tip')
                    .offset([-10, 0])
                    .html(function(d) {
                        if(countries.includes(d.properties.name)){
                            var place = countries.indexOf(d.properties.name)
                            Income = income[place]
                            
                        }

                        return "<strong>Country: </strong><span class= \
                        'details'>" + d.properties.name + "<br></span>" 
                        +"<strong>Household net income: </strong><span class='details'>" 
                        + Income + "<br></span>"
                    })

  
        var margin = {top: 20, right: 0, bottom: 0, left: 50},
                    width = 960 - margin.left - margin.right,
                    height = 650 - margin.top - margin.bottom;
        var padding = 20;
  
        var color = d3.scaleThreshold()
            .domain([5000,10000,15000,20000,25000,30000,35000,40000,"NAN",])
            .range(["#f7fcf5", "#e5f5e0", "#c7e9c0", "#a1d99b", "#74c476", "#41ab5d","#238b45","#005a32","black"]);
  
        var path = d3.geoPath();
  
        var svg = d3.select("#map")
                    .append("svg")
                    .attr("width", width)
                    .attr("height", height)
                    .style("fill", "green")
                    .append('g')
                    .attr('class', 'map');
  
        var projection = d3.geoMercator()
                           .scale(130)
                          .translate( [width / 2, (height) / 1.5]);
  
        var path = d3.geoPath().projection(projection);
        var t = d3.transition()
                  .duration(750);
  
        var click;
  
        svg.call(tip);
        ready(data, University);
  
        function ready(data, University) {
           

        svg.append("g")
            .attr("class", "countries")
            .selectAll("path")
            .data(data.features)
            .enter()
            .append("path")
            .attr("d", path)
            .style("fill", function(d) {
                if(countries.includes(d.properties.name)){
                    var place = countries.indexOf(d.properties.name)
                    Income = income[place] 
                    return (color(Income));
                }
                    return "black"
                })  
                    
            .style('stroke-width', 1.5)
            .style("opacity",0.8)
            // tooltips
            .style("stroke","grey")
            .style('stroke-width', 0.3)
            .on('mouseover',function(d){
                if(countries.includes(d.properties.name)){
                    tip.show(d);
                }

                d3.select(this)
                .style("opacity", 1)
                .style("stroke","white")
                .style("stroke-width",3);
            })
            .on("click", function (d){
                d3.select("#chart > *").remove()
                var data = [];
                Life = 0
                Education = 0
                if(countries.includes(d.properties.name)){
                    var place = countries.indexOf(d.properties.name)
                    Life = life[place]
                    console.log(Life)
                    Education = educationYears[place]
                    data.push({name: d.properties.name, value: Life},{name: d.properties.name, value: Education})

                    make_barchart(data)
                }

                })
            .on('mouseout', function(d){
                tip.hide(d);

                d3.select(this)
                .style("opacity", 0.8)
                .style("stroke","white")
                .style("stroke-width",0.3);
            });
            // make legend
            legend = svg.selectAll("#map")
                .data([5000,10000,15000,20000,25000,30000,35000,40000,"NAN"])
                .enter()
                .append("g")
                .attr("class", ".legend")
                .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

            legend.append("rect")
                .attr("x", width - 35)
                .attr("y", 5)
                .attr("width", 32)
                .attr("height", margin.top)
                .style("fill", d => color(d))

                // add text to legend
            legend.append("text")
                    .attr("x", width - 85)
                    .attr("y", 20)
                    .style("color", "#FFF")
                    .text(function(d){
                    return d;
                    })
  
          svg.append("path")
              .datum(topojson.mesh(data.features, function(a, b) { return a.name !== b.name; }))
              .attr("class", "names")
              .attr("d", path);
        function make_barchart(data){

                var margin = {top: 15, right: 5, bottom: 60, left: 25};
                var width = 500 - margin.left - margin.right;
                var height = 400 - margin.top - margin.bottom;
      
                var padding = 20;
      
                var colors = d3.scaleLinear()
                              .domain([0, 2])
                              .range(['#77b7ea', '#705f7f']);
      
                var tooltip = d3.select("body")
                                .append("div")
                                .style('position','absolute')
                                .style('background', "rgba(0,0,0,0.6)")
                                .style('color', "#ffa500")
                                .style('border','1px #333 solid')
                                .style('padding', "6px")
                                .style('font-family', "sans-sherif")
                                .style('border-radius','3px');

                var barchart = d3.select("#chart")
                                .append("svg")
                                .attr("width", width + margin.left + margin.right)
                                .attr("height", height + margin.top + margin.bottom);

                var yScale = d3.scaleLinear()
                    .domain([0,100])
                    .range([height , margin.bottom])

                var yAxis = d3.axisLeft(yScale);


                var xScale = d3.scaleBand()
                    .domain(d3.range(0,2))
                    .range([margin.right, width - margin.right - margin.left])

                    barchart.append('g')
                            .selectAll("rect")
                            .data(data)
                            .enter()
                            .append("rect")
                            .attr("width", width / 5)
                            .attr("height", function(d){
                            return height - yScale(d.value) ;
                            })
                            .attr("x", function(d, i) {
                            return xScale(i) + margin.left
                            })
                            .attr("y", function(d){
                            return yScale(d.value);
                            })
                            .attr("fill", function(d,i) {
                                return colors(i);
                            })
                         
                    var hScale =  d3.scaleBand()
                    .domain(["Life expectancy", "Years of education"])
                    .range([margin.left, width - margin.right - margin.left])
        
                    // make axis
                    barchart.append("g")
                            .attr("class", "axis")
                            .attr("transform", "translate("+[0, height]+")")
                            .call(d3.axisBottom(hScale).ticks(2))
                            .selectAll("text")
                            .style("text-anchor", "end")

                    barchart.append("g")
                            .attr("class", "axis")
                            .attr("transform", "translate("+[margin.left, 0]+")")
                            .call(yAxis)
                
                    barchart.append("text")
                        .data(data)
                        .attr("x", width / 2)
                        .attr("y", margin.top)
                        .attr("text-anchor", "middle")
                        .style("font-family", "sans-sherif")
                        .style("font-size", "20px")
                        .style("font-weight", "bold")
                        .text(function(d){
                            return d.name;
                        });
            }
            };

      }).catch(function(e){
          throw(e);
    });
  };