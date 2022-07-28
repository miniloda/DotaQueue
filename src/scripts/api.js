let input = document.querySelector('input');
let parent = document.getElementsByClassName('results-container')[0];
input.addEventListener("keypress", function(e){
    if(e.key === "Enter"){
        parent.innerHTML = '';
        let query = input.value;
        getData(query, function(err, data) {
            if (err) {
                console.log(err);
            } else {
               let name, id, activePlayers;
               res =  findTeam(query, data);
               if(res === false){
                let h1 = document.createElement('h1');
                h1.innerHTML = "Team not found";
                parent.appendChild(h1);
                return;
               }
               console.log(res)
               name = res['name'];
               team_id = res['id'];
               searchPlayers(team_id, function(active){
                    activePlayers = active;
                     console.log(activePlayers);
                     let h1 = document.createElement('h1');
                h1.innerHTML = name;
                parent.appendChild(h1);
                for(const player of activePlayers){
                    let player_id = player.account_id;
                    playerSearch(player_id, function(data){
                    let personaName = document.createElement('h2')
                    personaName.innerHTML = data.profile.name;
                    let playerName = document.createElement('h3')
                    playerName.innerHTML = data.profile.name;
                    let accountID = document.createElement('p')
                    accountID.innerHTML = player.account_id;
                    let avatar = document.createElement('img');
                    avatar.src = data.profile.avatarfull;
                    let playerDiv = document.createElement('div');
                    playerDiv.appendChild(personaName);
                    // playerDiv.appendChild(playerName);
                    playerDiv.appendChild(accountID);
                    playerDiv.appendChild(avatar);
                    parent.appendChild(playerDiv);
                    });
                }
               });
            }
        })
    }
});


function getData(url, callback) {
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
        if (String(data[i].name).toLowerCase() === team.toLowerCase()) {
            let name = data[i].name;
            let id = data[i].team_id;
            let logo = data[i].logo;
            console.log(data[i].name);
            console.log(data[i]);
            return {
                name,id, logo}
                ;
        }
    }
    return teamFound;

}
function searchPlayers(team_id, callback){
    console.log(team_id)
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