/*
Reference:
npm nba package
npm d3-shotchart package
*/
import React from 'react';
import './App.css';
import nba from "nba";
import * as d3 from "d3";
import { court, shots } from "d3-shotchart";
import { hexbin } from "d3-hexbin";

window.d3_hexbin = { 
  hexbin: hexbin 
};
  

var jamesId = nba.findPlayer("LeBron James").playerId;
nba.stats.shots({
  PlayerID: jamesId
})
.then(d => {
  var data = [];
  var temp = d.shot_Chart_Detail;
  for (var i = 0; i < temp.length; i++) {
    var datum = {
      x: temp[i].locX / 10 + 25,
      y: temp[i].locY / 10 + 5,
      shot_made_flag: temp[i].shotMadeFlag
    }
    data.push(datum);
  }
var courtSelection = d3.select("#shot-chart");
var basketballCourt = court().width(1000);
var shotsTaken = shots().shotRenderThreshold(1).displayToolTips(true).displayType("hexbin");
courtSelection.call(basketballCourt);
courtSelection.datum(data).call(shotsTaken);
});

  
function App() {

  return (
    
      <div id="shot-chart">
      </div>
  
  );
  
}

export default App;
