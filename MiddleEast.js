class MiddleEast {

    constructor(state, setGlobalState) {
        console.log(state.width);
        console.log(state.height);

        const zoom = d3.zoom()
        .scaleExtent([1, 2])
        .on("zoom", zoomed);

        const svg = d3.select("#asia2")
        .append("svg")
        .attr("viewBox", [0, 0, state.width, state.height])
        .attr("width",state.width)
        .attr("height",state.height)
        .on("click", reset);

        const g = svg.append("g");

        const color = d3.scaleOrdinal()
                    .domain(["1. High income: OECD",
                            "2. High income: nonOECD",
                            "3. Upper middle income",
                            "4. Lower middle income",
                            "5. Low income"])
                    .range(d3.schemeReds[5]);
                    //.range(d3.schemeRdBu[5])
    
        var projection = d3.geoMercator()
                .scale(650)
                .center([100,0]) // Pan north 40 degrees
                .translate([state.width,state.height]);

        var pathGenerator = d3.geoPath(projection);

        g.selectAll("path")
        .data(state.world.features, d => d.properties.brk_name)
        .enter().append("path")
        .attr("d", pathGenerator);

        const countries = g.append("g")
            .selectAll("path.countries")
            .data(state.world.features, d => d.properties.brk_name)
            .join("path")
            .attr("class", "countries")
            .attr("fill",d=>color(d.properties.income_grp))
            .attr("d", d => pathGenerator(d))
            .attr("stroke", "gray")
            .on("click", clicked)
        
        countries.append("title")
        .text(d => d.properties.brk_name);
    
        svg.call(zoom);

    // svg.append("g")
    //      .attr("transform", "translate(750,0)")
    //      .append(() => legend({color, title: "Income Group", width: 400}))
            
        svg.selectAll(".tick")
            .on("click", onLegendClick);
    
        function reset() {
            countries.transition().style("fill", null);
            
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
            if(selection.includes(d.properties.brk_name)) {
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
        state.stateselected = d.properties.brk_name;
        console.log(state.stateselected);
        

        event.stopPropagation();
        
        //countries.attr("stroke", "gray");
        //countries.attr("stroke-width", stroke_width_original);
        countries.transition().style("fill", null);
        d3.select(this).transition().style("fill", "gray");
        
        svg.selectAll(".state_name").remove();
        
        svg.append("text")
            .attr("x", 500)
            .attr("y", 100)
            .style("font-size", "45px")
            .text(state.stateselected)
            .attr("class","state_name");
        
        svg.transition().duration(750).call(
        zoom.transform,
        d3.zoomIdentity
            .translate(state.width / 2, state.height / 2)
            //.scale(Math.min(2, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
            .scale(1.0)
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
        d3.pointer(event, svg.node())
        );
        
    }
    
    function zoomed(event) {
        const {transform} = event;
        g.attr("transform", transform);
        //g.attr("stroke-width", 1 / transform.k);
        
    }
    }
}
export { MiddleEast };