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
        state.europe_size = this.perGDPmap["Italy"].length

        const zoom = d3.zoom()
            .scaleExtent([1, 2])
            .on("zoom", zoomed);

        this.svg = d3.select("#europe")
            .append("svg")
            .attr("viewBox", [0, 0, state.width, state.height])
            .attr("width",state.width)
            .attr("height",state.height)
            .on("click", reset);

        const g = this.svg.append("g");

        this.color = d3.scaleOrdinal()
                    .domain([1,2,3,4,5])
                    .range(d3.schemeReds[5]);
                    //.range(d3.schemeRdBu[5])

        var projection = d3.geoMercator()
                .scale(400)
                .center([90,30]) // Pan north 40 degrees
                .translate([state.width,state.height]);

        var pathGenerator = d3.geoPath(projection);

        g.selectAll("path")
            .data(state.world.features, d => d.properties.admin)
            .enter().append("path")
            .attr("d", pathGenerator);

        console.log(this.perGDPmap["Finland"][state.europe_i])
        
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
            .on("click", clicked)
        
        
        
        countries.append("title")
            .text(d => d.properties.admin);
    
        this.svg.call(zoom);

        //svg.append("g")
        //      .attr("transform", "translate(750,0)")
        //      .append(() => legend({color, title: "Income Group", width: 400}))
            
        this.svg.selectAll(".tick")
            .on("click", onLegendClick);
    
        function reset() {
            countries.transition().style("fill", null);
            
            this.svg.selectAll(".state_name").remove();
            
            this.svg.transition().duration(750).call(
                zoom.transform,
                d3.zoomIdentity,
                d3.zoomTransform(this.svg.node()).invert([state.width / 2, state.height / 2])
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

        function clicked(event, d) {

            const [[x0, y0], [x1, y1]] = pathGenerator.bounds(d);
            //const [[x0, y0], [x1, y1]] = [[80,20],[100,40]]
            console.log(pathGenerator.bounds(d));
            console.log(-(x0 + x1) / 2);
            console.log(-(y0 + y1) / 2);
            state.stateselected = d.properties.admin;

            // if else statement
            //  then translate at the bottom.
            console.log(state.stateselected);
            

            event.stopPropagation();
            
            //countries.attr("stroke", "gray");
            //countries.attr("stroke-width", stroke_width_original);
            countries.transition().style("fill", null);
            d3.select(this).transition().style("fill", "gray");
            
            this.svg.selectAll(".state_name").remove();
            
            this.svg.append("text")
                .attr("x", 500)
                .attr("y", 100)
                .style("font-size", "45px")
                .text(state.stateselected)
                .attr("class","state_name");
            
            this.svg.transition().duration(750).call(
            zoom.transform,
            d3.zoomIdentity
                .translate(state.width / 2, state.height / 2)
                //.scale(Math.min(2, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
                .scale(1.0)
                .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
            d3.pointer(event, this.svg.node())
            );
            
        }
        
        function zoomed(event) {
            const {transform} = event;
            g.attr("transform", transform);
            //g.attr("stroke-width", 1 / transform.k);
            
        }

    }

    draw(state) {
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
}
export { Europe };