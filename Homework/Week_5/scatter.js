// Wiebe Jelsma 12468223

var womenInScience = "http://stats.oecd.org/SDMX-JSON/data/MSTI_PUB/TH_WRXRS.FRA+DEU+KOR+NLD+PRT+GBR/all?startTime=2007&endTime=2015"
var consConf = "http://stats.oecd.org/SDMX-JSON/data/HH_DASH/FRA+DEU+KOR+NLD+PRT+GBR.COCONF.A/all?startTime=2007&endTime=2015"



window.onload = function() {
    var requests = [d3.json(womenInScience), d3.json(consConf)];
    FRA_con = []
    DEU_con = []
    KOR_con = []
    NLD_con = []
    PRT_con = []
    GBR_con = []
    FRA_years = []
    DEU_years = []
    KOR_years = []
    NLD_years = []
    PRT_years = []
    GBR_years = []


    Promise.all(requests).then(function(response) {
        womenInScience = transformResponse(response[0])
        consConf = transformResponse(response[1])
        console.log(womenInScience[0])
        console.log(consConf)
        
        
        for(i = 0; i < 9; i +=1){
            console.log(consConf[i].Country)

            FRA_con.push(consConf[i].datapoint)
            FRA_years.push(consConf[i].time)
        }
        for(i = 9; i < 18; i +=1){
            console.log(consConf[i].Country)

            NLD_con.push(consConf[i].datapoint)
            NLD_years.push(consConf[i].time)
        }
        for(i = 18; i < 27; i +=1){
            console.log(consConf[i].Country)

            PRT_con.push(consConf[i].datapoint)
            PRT_years.push(consConf[i].time)
        }
        for(i = 27; i < 36; i +=1){
            console.log(consConf[i].Country)

            DEU_con.push(consConf[i].datapoint)
            DEU_years.push(consConf[i].time)
        }
        for(i = 36; i < 45; i +=1){
            console.log(consConf[i].Country)
            GBR_con.push(consConf[i].datapoint)
            GBR_years.push(consConf[i].time)
        }
        for(i = 45; i < 54; i +=1){
            console.log(consConf[i].Country)
            KOR_con.push(consConf[i].datapoint)
            KOR_years.push(consConf[i].time)
        }

            
        // console.log(FRA_con)
        // console.log(FRA_years)
        // console.log(KOR_con)
        // console.log(DEU_con)
        // console.log(NLD_con)
        // console.log(GBR_con)
        // console.log(PRT_con)

        // console.log(response[0].dataSets[0].series)
        
        
        // console.log(response[0].dataSets[0].series["0:0"].observations)
        // console.log(response[0].dataSets[0].series["0:1"].observations)
        // console.log(response[0].dataSets[0].series["0:2"].observations)
        // console.log(response[0].dataSets[0].series["0:3"].observations)
        // console.log(response[0].dataSets[0].series["0:4"].observations)
        // console.log(response[0].dataSets[0].series["0:5"].observations)
        
        // console.log(transformResponse(response[1]));
        d3.select("body")
            .append("p").text("Renewable energy of Australia")
            .append("p").text("By: Wiebe Jelsma (12468223)")
            .append("p").text("ADD LINK");           

            margin = {top: 5, right: 10, bottom: 40, left: 60}
            var height = 400 - margin.top - margin.bottom;
            var width = 750 - margin.left - margin.right;
            var barWidth = 15;

            var xScale = d3.scaleLinear()
                // .domain([1960, d3.max(Dates, function (d) {
                //     return d;})])
                // .range([margin.left, width - margin.left - margin.right]);
                .domain([0,200])
                .range([0,200])
            var yScale = d3.scaleLinear()
                // .domain([0, d3.max(Values, function (d) {
                //     return d;})])
                // .range([height - margin.bottom ,margin.bottom]);
                .domain([0,200])
                .range([0,200])

            var xAxis = d3.axisBottom(xScale)                                          
            var yAxis = d3.axisLeft(yScale);

            var svg = d3.select("body")
                .append("svg")
                .attr("width", width + margin.left)
                .attr("height", height + margin.bottom)
                .style("background", "lightyellow")
                .append("g")
            svg.selectAll("circle")
                .data(NLD_con)
                .enter()
                .append("circle")
                .style("fill", "lightgreen")
                .attr("width", barWidth)
                .attr("height", function(d){
                    return yScale(d);
                })

                .attr("x", function(d, i) {
                    // return margin.left + i * (width / Dates.length);
                    return margin.left
                })
                .attr("y", function(d){
                    return yScale(d)
                })
                .attr("r", 5)
                // .attr("width", width / Dates.length)
                .attr("width", width)
                .attr("height", function(d){
                    return height - yScale(d) 
                })
            // try to make x-axis
            svg.append("g")
                .attr("class", "axis") 
                .attr("transform", "translate(0," + height + ")")
                .call(xAxis);
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("x", margin.left)
                .style("text-anchor", "end")
                .text("Women in science");
            // try to make y-axis
            svg.append("g")
                .attr("class", "axis")
                .attr("transform", "translate("+[margin.left, margin.bottom]+")")
                .call(yAxis)
            // try to name the y-axis, was still working on it
            svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", margin.right)
                .style("text-anchor", "end")
                .text("Consumer Satisfaction");
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
}