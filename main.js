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
    europe = new Europe(state, setGlobalState);
    asia = new Asia(state, setGlobalState);
    mideast = new MiddleEast(state, setGlobalState);
}

// function draw() {
//     europe.draw(state);
// }

function setGlobalState(nextState) {
    state = {...state, ...nextState};
    draw();
}
