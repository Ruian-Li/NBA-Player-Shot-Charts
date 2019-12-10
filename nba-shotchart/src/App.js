/*
Reference:
npm nba package
npm d3-shotchart package
*/
import React, { Component } from 'react';
import './App.css';
import nba from "nba";
import * as d3 from "d3";
import { court, shots } from "d3-shotchart";
import { hexbin } from "d3-hexbin";

window.d3_hexbin = { 
  hexbin: hexbin 
};

class App extends Component {

handleClick() {
  var playerName = d3.select("#search-bar").node().value;
  var playerId = nba.findPlayer(playerName).playerId;
  var teamId = nba.findPlayer(playerName).teamId;

nba.stats.shots({
  PlayerID: playerId,
  Season: "2019-20"
})
.then(d => {
  console.log(d);
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

var teamData = [];
nba.stats.commonTeamRoster({
  Season: "2019-20",
  TeamID: teamId
})
.then( d => {
  
  var roster = d.commonTeamRoster;
  console.log(roster);
  var players = [];
  for (var i = 0; i < roster.length; i++) {
    players.push(roster[i].player);
  }
  console.log(players);
  for (var k = 0; k < players.length; k++) {
    if (nba.findPlayer(players[k]) === undefined) {
      continue;
    }
    var id = nba.findPlayer(players[k]).playerId;
    nba.stats.shots({
      PlayerID: id,
      Season: "2019-20"
    })
    .then(d2 => {
      var temp = d2.shot_Chart_Detail;
      for (var j = 0; j < temp.length; j++) {
        var datum = {
          x: temp[j].locX / 10 + 25,
          y: temp[j].locY / 10 + 5,
          shot_made_flag: temp[j].shotMadeFlag
        }
        teamData.push(datum);
    }
  })
  .then(
    d2 => {
      var teamCourtSelection = d3.select("#team-shot-chart");
      var teamBasketballCourt = court().width(1000);
      var teamShotsTaken = shots().shotRenderThreshold(1).displayToolTips(true).displayType("hexbin");
      teamCourtSelection.call(teamBasketballCourt);
      teamCourtSelection.datum(teamData).call(teamShotsTaken);
    }
  );
  }
});
  };

  render() {
    return (
      <div>
      <textarea placeholder="Search NBA Player" id="search-bar" align="center"></textarea>
      <button onClick={this.handleClick}>Submit</button>
      <h3 align="center">Player Data</h3>
      <div id="shot-chart">
      </div>
      <h3 align="center">Team Data</h3>
      <div id="team-shot-chart">
      </div>
    </div>
    );
  }
}

export default App;
