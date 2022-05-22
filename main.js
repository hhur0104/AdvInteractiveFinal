import { Europe } from "./Europe.js";
import { Asia } from "./Asia.js";
import { MiddleEast } from "./MiddleEast.js";
  
let europe, asia, asia2;

let state = {
    world : [],
    pergdp_e : [],
    europe_i : 0,
    asia_i : 0,
    asia2_i : 0,
    europe_size: 0,
    num_eur_selected: 1,
    num_asia_selected: 1,
    num_asia2_selected: 1,
    playing: false,
    playing_a:false,
    playing_a2:false,
    stateselected:"none",
    width : window.innerWidth * 0.7,
    height : window.innerHeight * 0.7,
};

Promise.all([
    d3.json("./data/world-110m.geo.json"),
    d3.csv("./data/pergdp_eur_cat.csv"),
    d3.csv("./data/pergdp_asia2_cat.csv")
   ]).then(([geojson, pergdp_e, pergdp_me]) => {
    state.world = geojson;
    state.pergdp_e = pergdp_e;
    state.pergdp_me = pergdp_me;
    init();
   });

function init() {
    europe = new Europe(state);
    asia = new Asia(state);
    asia2 = new MiddleEast(state);

    state.europe = europe;
    state.asia = asia;
    state.asia2 = asia2;

    europe.animate(state);
    asia.animate(state);
    asia2.animate(state);
    // setGlobalState({europe_i : +1});
}
