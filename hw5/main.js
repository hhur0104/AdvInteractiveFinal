var presidentData = [];   
var lookup = [];
   
/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
Promise.all([
    
    d3.csv("./presidents.csv"), 
   
    ]).then(([president]) => {
        presidentData = president;
        
        presidentData.map(function(d) {
            lookup[d.Name] = [d.Height, d.Weight]
        })

        drawTable();
});


function drawTable() {
    const table = d3.select("#container")
      .append("table")
      .style("width","60%")

    headers = table.selectAll(".header")
      .data(presidentData.columns)
      .join("th")
      .attr("class","header")
      .text(cols => cols)
      .style("border-bottom","solid whitesmoke")
      .style("text-align","left")

    rows = table.selectAll(".row")
      .data(presidentData)
      .join("tr")
      .attr("class","row")
      .attr("id",row => row.Name)


    cells = rows.selectAll(".cell")
      .data(row => Object.values(row))
      .join("td")
      .text(cell => cell)
    
}

function showInfo() {
    let input_val = document.getElementById("name-input").value
    document.getElementById('height').innerText = "Height: ".concat(lookup[input_val][0])
    document.getElementById('weight').innerText = "Weight: ".concat(lookup[input_val][1])
    d3.select("#"+input_val).attr("class","flash")
}