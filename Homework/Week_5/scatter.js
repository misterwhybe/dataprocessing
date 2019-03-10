// Wiebe Jelsma 12468223

var womenInScience = "https://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var consConf = "https://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

window.onload = function() {
    var requests = [d3.json(womenInScience), d3.json(consConf)];
    women = []
    women_years = []
    consumers = []

    Promise.all(requests).then(function(response) {
        womenInScience = transformResponse(response[0])
        consConf = transformResponse(response[1])

        function data(womenInScience, consConf){
            length = 54
            missing =  [10, 12, 14, 16, 28, 30, 46]        
            // get data of women in science
            for(i=0; i<47; i++){
                women.push(womenInScience[i].datapoint)
                women_years.push(womenInScience[i].time)

            }
            // add None-values at places where no data is found
            for(i=0; i<missing.length; i++){
                women.splice(missing[i], 0, "None")
            }
            // get data for consumer satisfaction
            for(i=0; i<length; i++){
                consumers.push(consConf[i].datapoint)
            }
            // add 2 datasets together, make arrays within arrat
            Dataset = []
            Temp = []
            for(i=0; i<length; i++){
                Temp = [consumers[i], women[i]]
                Dataset.push(Temp)
            }
            Data=[]
            // get rid of arrays with none values
            for(i=0; i<length; i++){
                if(Dataset[i][1] !== "None"){
                    Data.push(Dataset[i])
                }
            }
        }

        function program(Data){
            // set margin and padding
            margin = {top: 15, right: 25, bottom: 30, left: 30}
            var height = 400 - margin.top - margin.bottom;
            var width = 800 - margin.left - margin.right;
            var padding = 40;
            // maybe use for legend
            var colour = ["red", "purple", "gray", "orange", "green",
            "blue"]
            countries = ["France", "Germany", "Korea", 
            "Netherlands", "Portugal", "Great Britain"]
            var colourScale = [0,9,14,23,30,39,47]
            var color = d3.scaleQuantile()
                .domain(colourScale)
                .range(colour);

            // scale axis
            var xScale = d3.scaleLinear()
                    .domain([0, d3.max(Data, function(d) { return d[1]; })])
                    .range([padding, width - padding * 2]);
            var yScale = d3.scaleLinear()
                    .domain([94, d3.max(Data, function(d) { return d[0]; })])
                    .range([height - padding, padding]);

            var xAxis = d3.axisBottom(xScale)                                          
            var yAxis = d3.axisLeft(yScale);
            // make the svg
            var svg = d3.select("body")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .style("background", "white")

            // create the circles
            svg.selectAll("circle")
                .data(Data)
                .enter()
                .append("circle")
                // hard-code the different colours
                .style("fill", function(d,i){
                    return color(i)
                    
                })
                // get x and y values for circles
                .attr("cx", function(d) {
                    return xScale(d[1]);
                })
                .attr("cy", function(d){
                    return  yScale(d[0]);
                })
                .attr("r", 5)
            svg.append("text")
                .attr("x", width / 3)
                .attr("y", 15)
                .text("Scatterplot of women in science and consumer satisfaction")
            // add x-axis
            svg.append("g")
                .attr("class", "axis") 
                .attr("transform", "translate("+ 
                [ 0, height - margin.bottom - margin.top + 5]+")")
                .call(xAxis);
            // label x-axis
            svg.append("text")
                .attr("transform", "rotate(0)")
                .attr("y", height)
                .attr("x", width / 2)
                .style("text-anchor", "begin")
                .text("Percentage of women in science");
            // add y-axis
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate(" + padding + ",0)")
                .call(yAxis)
            // label y-axis
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", 0 - padding)
                .attr("y", margin.top )
                .style("text-anchor", "end")
                .text("Consumer Satisfaction")

            var colourScaleLegend = [0,1,2,3,4,5]
            var colorLegend = d3.scaleLinear()
                .domain(colourScaleLegend)
                .range(colour);
            // add legend with colours and countries
            var legend = svg.selectAll(".legend")
                .data(countries)
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) {
                  return "translate(0," + (i * 20 + 6)+ ")";
                });
              
              // draw legend colored rectangles
            legend.append("rect")
                .attr("x", width - padding)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function(d, i){
                    return colorLegend(i)
                })
            legend.append("text")
                .attr("x", width - margin.top)
                .attr("y", 9)
                // .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) {
                  return d;
                });
        }  
            
    function title(){
        // add text and tell where data comes from
        d3.select("body")
            .append("p").text("Welcome to my scatterplot!")
            .append("p").text("The links to the data can be found in scatter.js.")
            .append("p").text("Wiebe Jelsma (12468223)")
        }
    title()  
    data(womenInScience, consConf)
    program(Data)
    }).catch(function(e){
        throw(e);
    });   
};
function transformResponse(data){

    // access data property of the response
    let dataHere = data.dataSets[0].series;

    // access variables in the response and save length for later
    let series = data.structure.dimensions.series;
    let seriesLength = series.length;

    // set up array of variables and array of lengths
    let varArray = [];
    let lenArray = [];
    

    series.forEach(function(serie){
        varArray.push(serie);
        lenArray.push(serie.values.length);
    });

    // get the time periods in the dataset
    let observation = data.structure.dimensions.observation[0];

    // add time periods to the variables, but since it's not included in the
    // 0:0:0 format it's not included in the array of lengths
    varArray.push(observation);

    // create array with all possible combinations of the 0:0:0 format
    let strings = Object.keys(dataHere);

    // set up output array, an array of objects, each containing a single datapoint
    // and the descriptors for that datapoint
    let dataArray = [];

    // for each string that we created
    strings.forEach(function(string){
        // for each observation and its index
        observation.values.forEach(function(obs, index){
            let data = dataHere[string].observations[index];
            if (data != undefined){

                // set up temporary object
                let tempObj = {};

                let tempString = string.split(":").slice(0, -1);
                tempString.forEach(function(s, indexi){
                    tempObj[varArray[indexi].name] = varArray[indexi].values[s].name;
                });

                // every datapoint has a time and ofcourse a datapoint
                tempObj["time"] = obs.name;
                tempObj["datapoint"] = data[0];
                dataArray.push(tempObj);
            }
        });
    });

    // return the finished product!
    return dataArray;
};