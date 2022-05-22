class Asia {
    
    constructor(state) {
        console.log(state.width);
        console.log(state.height);
        
        this.perGDPmap  = [[]] ;

        state.pergdp_e.map( d=> {
            this.perGDPmap[d.Country] = [
                d.X2003 ,d.X2004, d.X2005, d.X2006, 
                d.X2007, d.X2008, d.X2009, d.X2010, d.X2011,
                d.X2012, d.X2013 ,d.X2014, d.X2015, d.X2016, 
                d.X2017, d.X2018, d.X2019, d.X2020, d.X2021
            ]
        })
        console.log(this.perGDPmap)
        this.asia_size = this.perGDPmap["China"].length 
        this.asia_year_list = d3.range(0, this.asia_size).map( d => d + 2003);
        
        this.perGDPmap_2  = [[]] ;
        d3.csv("./data/pergdp_eur_actual.csv", d=> {
            this.perGDPmap_2[d.Country] = [
                {"year": 2003, "pergdp":d.X2003},
                {"year": 2004, "pergdp":d.X2004},{"year": 2005, "pergdp":d.X2005},
                {"year": 2006, "pergdp":d.X2006},{"year": 2007, "pergdp":d.X2007},
                {"year": 2008, "pergdp":d.X2008},{"year": 2009, "pergdp":d.X2009},
                {"year": 2010, "pergdp":d.X2010},{"year": 2011, "pergdp":d.X2011},
                {"year": 2012, "pergdp":d.X2012},{"year": 2013, "pergdp":d.X2013},
                {"year": 2014, "pergdp":d.X2014},{"year": 2015, "pergdp":d.X2015},
                {"year": 2016, "pergdp":d.X2016},{"year": 2017, "pergdp":d.X2017},
                {"year": 2018, "pergdp":d.X2018},{"year": 2019, "pergdp":d.X2019},
                {"year": 2020, "pergdp":d.X2020},{"year": 2021, "pergdp":d.X2021}
            ]
        })
        
        this.color = d3.scaleOrdinal()
                    .domain([1,2,3,4,5])
                    .range(d3.schemeReds[5]);

        const zoom = d3.zoom()
            .scaleExtent([1, 2])
            .on("zoom", zoomed);
        
        

        var dataTime = d3.range(0, this.asia_size).map( d => d + 2003);
        console.log("dataTime:", dataTime)
        
        this.sliderTime = d3.sliderBottom()
            .min(0)
            .max(this.asia_size - 1)
            .step(1)
            .width(state.width * 3/4 - 20)
            .tickFormat(i => dataTime[i])
            .ticks(this.asia_size)
            .handle(d3.symbol().type(d3.symbolCircle))
            .fill("#69b3a2")
            .on('onchange', val => {
                console.log(val)
                d3.select("#tipDiv-asia").selectAll('circle').attr("r",0);

                clearInterval(state.asia_timer)
                
                state.playing_a = false;
                state.asia_i = val;
                state.asia.changeColor(state);  
                
                d3.select('#year_asia').text(this.asia_year_list[state.asia_i]);  
                    
                d3.selectAll(".cir_asia_"+this.asia_year_list[state.asia_i])
                        .transition()
                        .duration(300)
                        .attr("r",7);
            });

        var gTime = d3.select('div#slider-asia')
            .append('svg')
            .attr('width', state.width - 200)
            .attr('height', 80)
            .append('g')
            .attr('transform', 'translate(30,15)')
            
        
        gTime.call(this.sliderTime);

        var Tooltip = d3.select("#asia")
            .append("div")
            .style("opacity", 0)
            .attr("id", "tipDiv-asia")
            
        
        this.svg = d3.select("#asia")
            .append("svg")
            // .attr("viewBox", [0, 0, state.width, state.height])
            .attr("width",state.width)
            .attr("height",state.height)
            //.attr("viewBox", [0, 0, 980, 650])
            // .attr("width",980)
            // .attr("height",650)
            .attr("class", "svg-asia")
            .on("click", event => {
                reset(event)}
            );

        
        const g = this.svg.append("g");
        
        var projection = d3.geoMercator()
                .scale(440)
                .center([170,-20])
                .translate([state.width,state.height]);

        var pathGenerator = d3.geoPath(projection);

        g.selectAll("path")
            .data(state.world.features, d => d.properties.admin)
            .enter().append("path")
            .attr("d", pathGenerator);

        const countries = g.append("g")
            .selectAll("path.countries")
            .data(state.world.features, d => d.properties.admin)
            .join("path")
            .attr("class", "countries")
            .attr("fill",d => { 
                if(this.perGDPmap[d.properties.admin] != undefined) {
                    if (this.perGDPmap[d.properties.admin][0] == 'NA') {
                        return "LightGray";
                    } else {
                        return this.color(this.perGDPmap[d.properties.admin][0]);
                    }
                } else {
                    return "LightGray";
                }
            })
            .attr("d", d => pathGenerator(d))
            .attr("stroke", "gray")
            .on("click", event=> {
                clicked(event, event.target.__data__, this.perGDPmap_2);
            })
        
        countries.append("title")
            .text(d => d.properties.admin);

        this.svg.append("text")
            .attr("x", 400)
            .attr("y", 40)
            .style("font-size", "45px")
            .attr("id","year_asia")
            .text(this.asia_year_list[state.asia_i]);
        
        var legend = d3.legendColor()
            .scale(this.color)
            .title("Miliary Spending per GDP")
            .labels(["less than 1%",
                     "1% to 2%",
                     "2% to 3%",
                     "3% to 4%",
                     "larger than 4%"]);

        this.svg.append("g")
            .attr("transform", "translate(20, 400)")
            .call(legend);

    
        function reset(event) {

            var tipDiv = d3.select("#tipDiv-asia")
            tipDiv.selectAll("g").remove();
            tipDiv.selectAll("svg").remove();
            tipDiv.selectAll("h2").remove();
            tipDiv.selectAll("path").remove();
            tipDiv.style("opacity", 0)

            countries.attr("stroke-width", 1);
            var svg = d3.select("#asia").select("SVG");
            svg.selectAll(".state_name").remove();
            
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity,
                d3.zoomTransform(svg.node()).invert([state.width / 2, state.height / 2])
            );

            state.num_asia_selected = 1;
        }

        function clicked(event, d, gdpmap) {
            
            const [[x0, y0], [x1, y1]] = pathGenerator.bounds(d);
            //const [[x0, y0], [x1, y1]] = [[80,20],[100,40]]
            console.log(pathGenerator.bounds(d));
            console.log(-(x0 + x1) / 2);
            console.log(-(y0 + y1) / 2);
            state.stateselected = d.properties.admin;
            

            event.stopPropagation();
            
            countries.attr("stroke-width", 1);
            d3.select(event.target).attr("stroke-width", 3)
            
            var svg = d3.select("#asia").select("SVG");
            svg.selectAll(".state_name").remove();
            
            // svg.transition().duration(750).call(
            //     zoom.transform,
            //     d3.zoomIdentity
            //         .translate(state.width / 2, state.height / 2)
            //         //.scale(Math.min(2, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
            //         .scale(1.0)
            //         .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
            //     d3.pointer(event, svg.node())
            // );
            console.log("clicked, num_eur_sel: ", state.num_asia_selected)


            var tipDiv = d3.select("#tipDiv-asia")
            if (state.num_asia_selected == 3) {
                state.num_asia_selected = 1;
                tipDiv.selectAll("g").remove();
                tipDiv.selectAll("svg").remove();
                tipDiv.selectAll("h2").remove();
                tipDiv.selectAll("path").remove();
            }
            
            tipDiv.attr("width", 300)
                .attr("height", 200)
                .style("top", state.drag_y_asia + "px")
                .style("left", state.drag_x_asia + "px")
                .style("position","absolute")
                .style("border","5px solid black")
                .style("opacity",0.8)
                .style("background-color","whitesmoke")
                .style("padding-left","10px")
                
            tipDiv.append("h2")
                .text(state.stateselected)
                .style("font-size", 18)
            
            var dragHandler = d3.drag()
                .on("drag", function (d) {
                    console.log("asia tip d:", d)
                    //state.drag_y_asia = d.y+200
                    state.drag_y_asia = d.sourceEvent.pageY
                    state.drag_x_asia = d.x+100
                    console.log("state.drag_y_asia", state.drag_y_asia)
                    console.log("state.drag_x_asia", state.drag_x_asia)
                    d3.select(this)
                        .style("top", state.drag_y_asia  + "px")
                        .style("left", state.drag_x_asia + "px");
                });

            dragHandler(tipDiv);

            var tipSVG = tipDiv.append("svg")
                .attr("width", 300 )
                .attr("height", 200 )
        
            var x_tooltip = d3.scaleLinear()
                .domain(d3.extent(gdpmap[state.stateselected], d => parseInt(d.year)))
                .range([ 30, 250 ]);
            
            tipSVG.append("g")
                .attr("transform", "translate(0," + 160 + ")")
                .call(d3.axisBottom(x_tooltip))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("transform", "rotate(-65)");

            var y_tooltip = d3.scaleLinear()
                .domain(d3.extent(gdpmap[state.stateselected], d => parseFloat(d.pergdp)))
                .range([ 160, 10 ]);    
            
            console.log("Vietnam, extent",d3.extent(gdpmap["Vietnam"], d => parseFloat(d.pergdp)))

            tipSVG.append("g")
                .attr("transform", "translate(30," + 0 + ")")
                .call(d3.axisLeft(y_tooltip));
            
            console.log(state.stateselected, gdpmap[state.stateselected])
            
            tipSVG.append("path")
                .datum(gdpmap[state.stateselected])
                .attr("fill", "none")
                .attr("stroke", "#69b3a2")
                .attr("stroke-width", 4)
                .attr("d", d3.line()
                  .x(d => x_tooltip(parseInt(d.year)))
                  .y(d => y_tooltip(parseFloat(d.pergdp)))
                )
            
            var dot = tipSVG
                .selectAll('circle')
                .data(gdpmap[state.stateselected])
                .enter()
                .append('circle')
                  .attr("cx", d=> x_tooltip(parseInt(d.year)))
                  .attr("cy", d=> { return y_tooltip(parseFloat(d.pergdp))})
                  .attr("r", 0)
                  .style("fill", "#69b3a2")
                  .attr("class", d=> "cir_asia_" + d.year)
            
            d3.selectAll(".cir_asia_" + state.asia.asia_year_list[state.asia_i])
                .attr("r",7)
            
            state.num_asia_selected += 1;
        }
        
        function zoomed(event) {
            const {transform} = event;
            g.attr("transform", transform);
            //g.attr("stroke-width", 1 / transform.k);   
        }

    }

    changeColor(state) {
        this.svg.selectAll("path.countries")
            .transition()
            .duration(500)
            .attr("fill",d => { 
                if(this.perGDPmap[d.properties.admin] != undefined) {
                    if (this.perGDPmap[d.properties.admin][state.asia_i] =='NA') {
                        return "LightGray";
                    } else {
                        return this.color(this.perGDPmap[d.properties.admin][state.asia_i]);
                    }
                } else {
                    return "LightGray";
                }
            })
        this.sliderTime.silentValue(state.asia_i)
    }

    animate(state) {
        var timer;  // create timer object
        var year_list = this.asia_year_list
        var asia_max = this.asia_size
        d3.select('#play-asia')  
            .on('click', function() { 
                
                if(state.playing_a == false) {  
                    timer = setInterval(function() {
                    d3.select("#tipDiv-asia").selectAll('circle').attr("r",0);
                    
                    if(state.asia_i < asia_max) {  
                        state.asia_i +=1;  
                    } else {
                        state.asia_i = 0;  
                    }
                    
                    state.asia.changeColor(state);  
                    
                    d3.select('#year_asia').text(year_list[state.asia_i]);  
                    
                    d3.selectAll(".cir_asia_"+year_list[state.asia_i])
                        .transition()
                        .duration(300)
                        .attr("r",7);

                }, 1000);
                state.asia_timer = timer
                state.playing_a = true;   
                } 
        });

        d3.select('#stop-asia')  
          .on('click', function() {  
            if(state.playing_a == true) {  
                clearInterval(state.asia_timer);   
                state.playing_a = false;
            } 
        });
    }
}
export { Asia };