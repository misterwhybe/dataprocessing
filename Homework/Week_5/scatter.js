// Wiebe Jelsma 12468223

var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"

window.onload = function() {
    var requests = [d3.json(womenInScience), d3.json(consConf)];
    women = []
    women_years = []
    consumers = []

    Promise.all(requests).then(function(response) {
        womenInScience = transformResponse(response[0])
        consConf = transformResponse(response[1])
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
        for(i=0; i<54; i++){
            consumers.push(consConf[i].datapoint)
        }
        // add 2 datasets together, make arrays within arrat
        Dataset = []
        Temp = []
        for(i=0; i<54; i++){
            Temp = [consumers[i], women[i]]
            Dataset.push(Temp)
        }
        Data=[]
        // get rid of arrays with none values
        for(i=0; i<54; i++){
            if(Dataset[i][1] !== "None"){
                Data.push(Dataset[i])
            }
        }  
        // add text and tell where data comes from
        d3.select("body")
            .append("p").text("Scatterplot")
            .append("p").text("By: Wiebe Jelsma (12468223)")
            .append("p").text("The data of women in science can be found on:")
            .append("p").text("http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/\
            TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015")
            .append("p").text("The data of consumer Confidence can be found on:")
            .append("p").text(" http://stats.oecd.org/SDMX-JSON/data/HH_DASH/\
            FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015")       

            // set margin and padding
            margin = {top: 10, right: 25, bottom: 30, left: 30}
            var height = 400 - margin.top - margin.bottom;
            var width = 750 - margin.left - margin.right;
            var padding = 40;
            // maybe use for legend
            Colours1 = { "France":"red", "Germany":"purple", "Korea":"gray", 
            "Netherlands":"orange", "Portugal":"green", "Great Britain":"blue"}
            
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
                .style("fill", function(d, i){
                    if(i<9){
                        return "red"
                    }
                    if(i > 8 & i< 14){
                        return "purple"
                    }
                    if(i > 13 & i< 23){
                        return "grey"
                    }
                    if(i > 22 &i< 30){
                        return "orange"
                    }
                    if(i > 29 & i< 39){
                        return "green"
                    }
                    if(i > 38 & i< 47){
                        return "blue"
                    }
                    
                })
                // get x and y values for circles
                .attr("cx", function(d) {
                    return xScale(d[1]);
                })
                .attr("cy", function(d){
                    return  yScale(d[0]);
                })
                .attr("r", 5)
                
            // add x-axis
            svg.append("g")
                .attr("class", "axis") 
                .attr("transform", "translate("+[ 0, height - margin.bottom - margin.top]+")")
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
                .attr("y", margin.top)
                .style("text-anchor", "end")
                .text("Consumer Satisfaction")

            var legend = svg.selectAll(".legend")
                .data(Object.keys(Colours1))
                .enter()
                .append("g")
                .attr("class", "legend")
                .attr("transform", function(d, i) {
                  return "translate(0," + i * 20 + ")";
                });
              
              // draw legend colored rectangles
            legend.append("rect")
                .attr("x", width - padding)
                .attr("width", 18)
                .attr("height", 18)
                .style("fill", function(d, i){
                    if(i==0){
                        return "red"
                    }
                    if(i==1){
                        return "purple"
                    }
                    if(i==2){
                        return "gray"
                    }
                    if(i==3){
                        return "orange"
                    }
                    if(i==4){
                        return "green"
                    }
                    if(i==5){
                        return "blue"
                    }
                })
            legend.append("text")
                .attr("x", width - margin.top)
                .attr("y", 9)
                // .attr("dy", ".35em")
                .style("text-anchor", "end")
                .text(function(d) {
                  return d;
                });
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