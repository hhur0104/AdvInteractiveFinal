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
    europe_year_list : ["2012", "2013", "2014", "2015", "2016",
                        "2017", "2018", "2019", "2020", "2021"],
    playing: false,
    stateselected:"none",
    width : window.innerWidth * 0.7,
    height : window.innerHeight * 0.7,
};

Promise.all([
    d3.json("./data/world-110m.geo.json"),
    d3.csv("./data/pergdp_eur_cat.csv")
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

    europe.animate(state, europe);
    // setGlobalState({europe_i : +1});
}
