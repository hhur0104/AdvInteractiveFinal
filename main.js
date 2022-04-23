  const width = window.innerWidth * 0.7;
  const height = window.innerHeight * 0.7;
  
  let stateselected="none";
  let stroke_width_original = 0;
  let selected_1 = false;
  let selected_2 = false;
  let selected_3 = false;
  let selected_4 = false;
  let selected_5 = false;
  let europe = [];


Promise.all([
    d3.json("./data/world-110m.geo.json")
   ]).then(([geojson]) => {
    world = geojson;

    initEurope();
   });

function initEurope() {
    //const width = d3.select("#europe").node().getBoundingClientRect().width
    //const height = d3.select("#europe").node().getBoundingClientRect().height
    console.log(width);
    console.log(height);

    const zoom = d3.zoom()
      .scaleExtent([1, 2])
      .on("zoom", zoomed);

    const svg = d3.select("#europe")
      .append("svg")
      .attr("viewBox", [0, 0, width, height])
      .attr("width",width)
      .attr("height",height)
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
            .scale(400)
            .center([95,30]) // Pan north 40 degrees
            .translate([width,height]);

    var pathGenerator = d3.geoPath(projection);

    g.selectAll("path")
      .data(world.features, d => d.properties.brk_name)
      .enter().append("path")
      .attr("d", pathGenerator);

    const countries = g.append("g")
        .selectAll("path.countries")
        .data(world.features, d => d.properties.brk_name)
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
            d3.zoomTransform(svg.node()).invert([width / 2, height / 2])
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
    stateselected = d.properties.brk_name;
    console.log(stateselected);
    

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
        .text(stateselected)
        .attr("class","state_name");
    
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity
        .translate(width / 2, height / 2)
        //.scale(Math.min(2, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height)))
        .scale(1.2)
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
  