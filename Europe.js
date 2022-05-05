class Europe {
    
    constructor(state) {
        console.log(state.width);
        console.log(state.height);
        
        this.perGDPmap  = [[]] ;

        state.pergdp_e.map( d=> {
            this.perGDPmap[d.Country] = [
                d.X2012, d.X2013 ,d.X2014, d.X2015, d.X2016, 
                d.X2017, d.X2018, d.X2019, d.X2020, d.X2021
            ]
        })
        console.log("perGDP: ", this.perGDPmap)
        state.europe_size = this.perGDPmap["Italy"].length 
        
        this.perGDPmap_2  = [[]] ;
        d3.csv("./data/pergdp_eur_actual.csv", d=> {
            this.perGDPmap_2[d.Country] = [
                {"year": 2012, "pergdp":d.X2012},
                {"year": 2013, "pergdp":d.X2013},
                {"year": 2014, "pergdp":d.X2014},
                {"year": 2015, "pergdp":d.X2015},
                {"year": 2016, "pergdp":d.X2016},
                {"year": 2017, "pergdp":d.X2017},
                {"year": 2018, "pergdp":d.X2018},
                {"year": 2019, "pergdp":d.X2019},
                {"year": 2020, "pergdp":d.X2020},
                {"year": 2021, "pergdp":d.X2021}
            ]
        })
        // this.color = d3.scaleThreshold()
        //             .domain([0,1,2,3,4,5,6,7,8])
        //             .range(d3.schemeReds[9])   

        this.color = d3.scaleOrdinal()
                    .domain([1,2,3,4,5])
                    .range(d3.schemeReds[5]);

        const zoom = d3.zoom()
            .scaleExtent([1, 2])
            .on("zoom", zoomed);
        
        //var dataTime = d3.range(0, 10).map( d => d + 2012);
        var dataTime = d3.range(0, 10).map(d => d);

        var sliderTime = d3.sliderBottom()
            .min(d3.min(dataTime))
            .max(d3.max(dataTime))
            .step(1)
            .width(300)
            .tickValues(d3.range(2012,2021).map(d => d))
            .on('onchange', val => {
                state.slider_time 
              //d3.select('p#value-time').text(d3.timeFormat('%Y')(val));
            });
        var gTime = d3.select('div#slider-europe')
            .append('svg')
            .attr('width', 500)
            .attr('height', 100)
            .append('g')
            .attr('transform', 'translate(30,30)');
        
        
        
        gTime.call(sliderTime);

        var Tooltip = d3.select("#europe")
            .append("div")
            .style("opacity", 0)
            .attr("id", "tipDiv-eur")
            
        
        this.svg = d3.select("#europe")
            .append("svg")
            // .attr("viewBox", [0, 0, state.width, state.height])
            .attr("width",state.width)
            .attr("height",state.height)
            //.attr("viewBox", [0, 0, 980, 650])
            // .attr("width",980)
            // .attr("height",650)
            .attr("class", "svg-europe")
            .on("click", event => {
                reset(event)}
            );

        const g = this.svg.append("g");
        
        var projection = d3.geoMercator()
                .scale(400)
                .center([90,30]) 
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
    
        // countries.call(zoom);
        
        //  svg.append("g")
        //      .attr("transform", "translate(750,0)")
        //      .append(() => legend({color, title: "Income Group", width: 400}))
        
        this.svg.append("text")
            .attr("x", 20)
            .attr("y", state.height - 50)
            .style("font-size", "45px")
            .attr("id","year_eur")
            .text(state.europe_year_list[state.europe_i]);
        
        this.svg.selectAll(".tick")
            .on("click", onLegendClick);
    
        function reset(event) {

            var tipDiv = d3.select("#tipDiv-eur")
            tipDiv.selectAll("g").remove();
            tipDiv.selectAll("svg").remove();
            tipDiv.selectAll("h2").remove();
            tipDiv.selectAll("path").remove();
            tipDiv.style("opacity", 0)

            countries.attr("stroke-width", 1);
            var svg = d3.select("#europe").select("SVG");
            svg.selectAll(".state_name").remove();
            
            svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity,
                d3.zoomTransform(svg.node()).invert([state.width / 2, state.height / 2])
            );
        }

        function onLegendClick(event, d) {
            var value = d3.select(this).text()
            if (value == "1. High income: OECD" && !selected_1) {
            selected_1 = true;    
            } else if (value == "1. High income: OECD" && selected_1) {
            selected_1 = false;
            } 
            if (value == "2. High income: nonOECD" && !selected_2) {
            selected_2 = true;    
            } else if (value == "2. High income: nonOECD" && selected_2) {
            selected_2 = false;
            }
            if (value == "3. Upper middle income" && !selected_3) {
            selected_3 = true;    
            } else if (value == "3. Upper middle income" && selected_3) {
            selected_3 = false;
            }
            if (value == "4. Lower middle income" && !selected_4) {
            selected_4 = true;    
            } else if (value == "4. Lower middle income" && selected_4) {
            selected_4 = false;
            }
            if (value == "5. Low income" && !selected_5) {
            selected_5 = true;    
            } else if (value == "5. Low income" && selected_5) {
            selected_5 = false;
            }
        
            // d3.selectAll("path.countries").filter(function(d) {
            //   return d.properties.income_grp != value;
            // }).attr("fill", "gray");
            
            // d3.selectAll("path.countries").attr("fill",function(d) {     
            //   if(d.properties.income_grp!= value) {
            //     return "gray";
            //   } else {
            //     return color(d.properties.income_grp);
            //   }
            // })
        
            var selection = updateSelection(selected_1, selected_2, selected_3, selected_4, selected_5)
            console.log(selection);
            d3.selectAll("path.countries").attr("fill",function(d) {     
            //console.log(d)
            if(selection.includes(d.properties.admin)) {
                return color(d.properties.income_grp);
            } else {
                // check if everythin is false
                if (!selected_1 && !selected_2 && !selected_3 && !selected_4 && !selected_5) {
                return color(d.properties.income_grp);
                } else {
                return "gray";
                }
            }
            })
        };

        function clicked(event, d, gdpmap) {
            console.log(d);
            const [[x0, y0], [x1, y1]] = pathGenerator.bounds(d);
            //const [[x0, y0], [x1, y1]] = [[80,20],[100,40]]
            console.log(pathGenerator.bounds(d));
            console.log(-(x0 + x1) / 2);
            console.log(-(y0 + y1) / 2);
            state.stateselected = d.properties.admin;

            // if else statement
            //  then translate at the bottom.

            event.stopPropagation();
            
            countries.attr("stroke-width", 1);
            d3.select(event.target).attr("stroke-width", 3)
            
            var svg = d3.select("#europe").select("SVG");
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
            console.log(event)

            var tipDiv = d3.select("#tipDiv-eur")
            tipDiv.selectAll("g").remove();
            tipDiv.selectAll("svg").remove();
            tipDiv.selectAll("h2").remove();
            tipDiv.selectAll("path").remove();
            tipDiv.attr("width", 300)
                .attr("height", 200)
                .style("top", state.drag_y + "px")
                .style("left", state.drag_x + "px")
                // .style("top", event.layerY + 200 + "px")
                // .style("left", event.layerX + 300 +"px")
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
                    state.drag_y_eur = d.y+200
                    state.drag_x_eur = d.x+250
                    d3.select(this)
                        .style("top", state.drag_y_eur  + "px")
                        .style("left", state.drag_x_eur + "px");
                });

            dragHandler(tipDiv);

            var tipSVG = tipDiv.append("svg")
                .attr("width", 300 )
                .attr("height", 200 )
                
            //   .append("g")
            //     .attr("transform",
            //           "translate(" + margin.left + "," + margin.top + ")");
            
            var x_tooltip = d3.scaleLinear()
                .domain(d3.extent(gdpmap[state.stateselected], d => d.year))
                .range([ 30, 250 ]);
            
            tipSVG.append("g")
                .attr("transform", "translate(0," + 160 + ")")
                .call(d3.axisBottom(x_tooltip))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("transform", "rotate(-65)");

            var y_tooltip = d3.scaleLinear()
                .domain(d3.extent(gdpmap[state.stateselected], d => d.pergdp))
                //.domain([0,6])
                .range([ 160, 10 ]);    
            
            tipSVG.append("g")
                .attr("transform", "translate(30," + 0 + ")")
                .call(d3.axisLeft(y_tooltip));
            
            tipSVG.append("path")
                .datum(gdpmap[state.stateselected])
                .attr("fill", "none")
                .attr("stroke", "#69b3a2")
                .attr("stroke-width", 4)
                .attr("d", d3.line()
                  .x(d => x_tooltip(d.year))
                  .y(d => y_tooltip(d.pergdp))
                )
            
            var dot = tipSVG
                .selectAll('circle')
                .data(gdpmap[state.stateselected])
                .enter()
                .append('circle')
                  .attr("cx", d=> x_tooltip(d.year))
                  .attr("cy", d=> y_tooltip(d.pergdp))
                  .attr("r", 0)
                  .style("fill", "#69b3a2")
                  .attr("id", d=> "cir_" + d.year)
            
            d3.select("#cir_"+state.europe_year_list[state.europe_i])
                .attr("r",7)
            
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
                    if (this.perGDPmap[d.properties.admin][state.europe_i] =='NA') {
                        return "LightGray";
                    } else {
                        return this.color(this.perGDPmap[d.properties.admin][state.europe_i]);
                    }
                } else {
                    return "LightGray";
                }
            })
    }

    animate(state, europe) {
        var timer;  // create timer object
        
        d3.select('#play-europe')  
          .on('click', function() {  
            if(state.playing == false) {  
              timer = setInterval(function() {
                d3.select("#tipDiv-eur").selectAll('circle').attr("r",0);
                if(state.europe_i < state.europe_size) {  
                    state.europe_i +=1;  
                } else {
                    state.europe_i = 0;  
                }
                
                europe.changeColor(state);  
                
                d3.select('#year_eur').text(state.europe_year_list[state.europe_i]);  
                
                d3.select("#cir_"+state.europe_year_list[state.europe_i])
                    .transition()
                    .duration(300)
                    .attr("r",7);

              }, 1000);
              
              state.playing = true;   
            } 
        });

        d3.select('#stop-europe')  
          .on('click', function() {  
            if(state.playing == true) {  
                clearInterval(timer);   
               
              state.playing = false;   
            } 
        });
    }
}
export { Europe };