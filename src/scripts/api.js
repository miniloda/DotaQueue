const input = document.querySelector('input');
const parent = document.getElementsByClassName('results-container')[0];
const team = document.getElementsByClassName('team-grid')[0];
//    Assign variables for the divs, check html
const imgDiv = document.getElementsByClassName('team-img')[0];
const nameDiv = document.getElementsByClassName('team-name')[0];
const teamInfo = document.getElementsByClassName('team-info')[0];
let APIData;
// TODO: Add matches
// TODO: Add stats
// TODO: Add description
// TODO: Add team stats
window.onload = () => {
    // Get the data from the API for the team once
    getData((err, data)=>
    {
        APIData = data;
    })
}

input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        if (input.value.length == 0 ) {
            return;
        }
        parent.innerHTML = 'Loading...';
        let query = input.value;
               res =  findTeam(query, APIData);
               if(res === false){
                let h1 = document.createElement('h1');
                parent.innerHTML = '';
                h1.innerHTML = "Team not found";
                parent.appendChild(h1);
                return;
               }

               team_id = res['id']; // Find the players using teamID

            //    For the player grid
               searchPlayers(team_id, function(active){
                activePlayers = active;
                //    For the team grid, assign it here
                //    Clean all divs
                parent.innerHTML = '';
                team.innerHTML = '';
                imgDiv.innerHTML = '';
                nameDiv.innerHTML = '';
                teamInfo.innerHTML = '';
            //    For the team grid
            // Assign variables for values
                let teamName = res['name'];
                let teamLosses = res['losses'];
                let teamWins = res['wins'];
                let teamWinRate = res['win_rate'];
                let teamRating = res['rating'];
                let teamLogo = res['logo'];
                let teamTag = res['tag'];
                // Create elements
                let teamNameEl = document.createElement('h2');
                let teamLogoEl = document.createElement('img');
                let teamRatingEl = document.createElement('p');
                let teamWinsEl = document.createElement('p');
                let teamLossesEl = document.createElement('p');
                let teamWinRateEl = document.createElement('p');
                let teamTagEl = document.createElement('p');
                // Add attributes
                teamNameEl.innerHTML = teamName;
                teamLogoEl.src = teamLogo;
                teamRatingEl.innerHTML = `Rating: ${teamRating}`;
                teamWinsEl.innerHTML = `Wins: ${teamWins}`;
                teamLossesEl.innerHTML = `Losses: ${teamLosses}`;
                teamWinRateEl.innerHTML = `Win Rate: ${teamWinRate}%`;
                teamTagEl.innerHTML = teamTag;
                //  Add attributes
                teamLogoEl.style.backgroundColor = "black";
                teamLogoEl.style.width = "100px";
                // Append elements
                console.log(team);
                imgDiv.appendChild(teamLogoEl);
                nameDiv.appendChild(teamNameEl);
                nameDiv.appendChild(teamTagEl);
                teamInfo.appendChild(teamRatingEl);
                teamInfo.appendChild(teamWinsEl);
                teamInfo.appendChild(teamLossesEl);
                teamInfo.appendChild(teamWinRateEl);
                team.appendChild(imgDiv);
                team.appendChild(nameDiv);
                team.appendChild(teamInfo);
                parent.appendChild(team)
                for(const player of activePlayers){
                    // For each player, add a layout which is in the style.css
                    let player_id = player.account_id;
                    playerSearch(player_id, function(data){
                    let personaName = document.createElement('h2')
                    personaName.innerHTML = data.profile.name;
                    let playerName = document.createElement('h3')
                    playerName.innerHTML = data.profile.name;
                    let accountID = document.createElement('p')
                    accountID.innerHTML = player.account_id;
                    let avatar = document.createElement('img');
                    avatar.src = data.profile.avatarmedium;
                    let playerDiv = document.createElement('div');
                    playerDiv.appendChild(personaName);
                    // playerDiv.appendChild(playerName);
                    playerDiv.appendChild(accountID);
                    playerDiv.appendChild(avatar);
                    parent.appendChild(playerDiv);
                    return;
                    });
                }
               });
            }
    return
});


function getData(callback) {
    // Gets the data from OpenDota API
    // Call one time to avoid making duplicate calls
    // REFACTOR: Perform sorting of the name to make it easier to find the team using binary search
    url = "https://api.opendota.com/api/teams/";
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
        if (xhr.status === 200) {
            callback(null, JSON.parse(xhr.responseText));
        } else {
            callback(xhr.statusText);
        }
    };
    xhr.send();
    return true;
}
function findTeam(team, data){
    let teamFound = false;
    for (let i = 0; i < data.length; i++) {
        // get the acronym from a string

        if (String(data[i].name).toLowerCase() === team.toLowerCase().trim() || String(data[i].tag).toLowerCase() === team.toLowerCase().trim()) {
            let name = data[i].name;
            let id = data[i].team_id;
            let logo = data[i].logo_url;
            teamFound = true;
            let rating = data[i].rating;
            let wins = data[i].wins;
            let losses = data[i].losses;
            let tag = data[i].tag;
            let win_rate = ((wins / (wins + losses)) * 100).toFixed(2);
            return {
                name,id, logo, rating, wins, losses, win_rate, tag}
                ;
        }
    }
    return teamFound;

}
function searchPlayers(team_id, callback){
    url = `https://api.opendota.com/api/teams/${team_id}/players`;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {

        if (xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);
            let activePlayers = [];
            for (let i = 0; i < data.length; i++) {
                if (data[i].is_current_team_member === true) {
                    console.log(data[i])
                    activePlayers.push(data[i]);
                }
            }
            callback(activePlayers);
        } else {
            console.log(xhr.statusText);
        }
    }
    xhr.send();
    return true;
}
function playerSearch(account_id, callback){
    url = `https://api.opendota.com/api/players/${account_id}`;
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function() {
        if (xhr.status === 200) {
            let data = JSON.parse(xhr.responseText);
            callback(data);
        } else {
            console.log(xhr.statusText);
        }
    }
    xhr.send();
    return true;
}