import { Europe } from "./Europe.js";
import { Asia } from "./Asia.js";
import { MiddleEast } from "./MiddleEast.js";
  
let stroke_width_original = 0;
let selected_1 = false;
let selected_2 = false;
let selected_3 = false;
let selected_4 = false;
let selected_5 = false;

// let world = [];

let europe, asia, mideast;

let state = {
    world : [],
    pergdp_e : [],
    europe_i : 0,
    europe_size: 0,
    playing: false,
    stateselected:"none",
    width : window.innerWidth * 0.7,
    height : window.innerHeight * 0.7,
};

Promise.all([
    d3.json("./data/world-110m.geo.json"),
    d3.csv("./data/pergdp_europe.csv")
   ]).then(([geojson, pergdp_e]) => {
    state.world = geojson;
    state.pergdp_e = pergdp_e;
    console.log(state.pergdp_e);
    init();
   });

function init() {
    europe = new Europe(state);
    asia = new Asia(state);
    mideast = new MiddleEast(state);

    animateEurope();
    // setGlobalState({europe_i : +1});
}

function animateEurope() {
    var timer;  // create timer object
    
    d3.select('#play-europe')  
      .on('click', function() {  
        if(state.playing == false) {  
          timer = setInterval(function() {
            if(state.europe_i < state.europe_size) {  
                state.europe_i +=1;  
            } else {
                state.europe_i = 0;  
            }
            europe.draw(state);  
            //d3.select('#clock').html(attributeArray[currentAttribute]);  // update the clock
          }, 1000);
          d3.select(this).html('stop');  
          state.playing = true;   
        } else {    
          clearInterval(timer);   
          d3.select(this).html('play');   
          state.playing = false;   
        }
    });
}

