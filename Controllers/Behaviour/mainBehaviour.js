$("#Minimize").click(() => {
    window.API.send("minimize", {});
});
$("#Maximize").click(() => {
    window.API.send("maximize", {});
});
$("#close").click(() => {
    window.API.send("quit", {});
});
favorites = [];
window.onload = () => {
    $(".showCurrentMatch").click((event) => {
        const userId = $(event.target).parent().attr("id");
        window.API.send("showLiveMatch", {
            id: userId
        });
    });
    $(".showHistory").click((event) => {
        const userId = $(event.target).parent().attr("id");
        window.API.send("showMatchHistory", {
            id: userId
        });
    });
    $('#searchBtn').click((event) => {
        var value = $('#search input').val();
        window.API.send("searchUser", {
            user: value
        });
    });


    window.API.receive("showLiveMatchData", (data) => {
        new dataHandler("live", data);
    });
    window.API.receive("showMatchHistoryData", (data) => {
        new dataHandler("history", data);
    });
    window.API.receive("showUsers", (data) => {
        new dataHandler("players", data);
    });
    window.API.receive("showFavorites", (data) => {
        console.log(data);
        //check if no users are saved
        if(!data.result) return;
        new dataHandler("favorites", data);
    });
    

    window.API.send("getFavorites", {});
}

class dataHandler {
    constructor(res, data) {
        switch(res) {
            case "live":
                this.refresh();
                this.showMatchInfo(data.match);
                this.showLiveMatchPanel();
                break;
            case "history":
                this.refresh();
                this.showMatchHistory(data.history);
                this.showHistoryPanel();
                break;
            case "players":
                this.showPlayers(data.players);
                break;
            case "favorites":
                this.showFavorites(data.users);
                break;
            default: 
                console.log(data.msg);

        }
    }
    //refresh() basically resets information that has already been set
    //This is to prevent double information be on top of eachother when the user
    //searches for another live match
    refresh() {
        $("#matchDetails").empty();
        $("#team1Average").removeClass();
        $("#team1Average span").empty();
        $("#team1WinChance").empty();
        $("#team2WinChance").empty();
        $("#team2Average").removeClass();
        $("#team2Average span").empty();
        $("#teamContainer1").empty();
        $("#teamContainer2").empty();
        $("#playerMatchHistory").empty();
    }
    //Returns the queue name of the game
    //Since the API only returns a nr representing the queue
    getQueueName(queue) {
        switch(parseInt(queue)) {
            case 424: return 'Casual';
            case 428: return 'Ranked';
            case 452: return 'Onslaught';
            case 469: return 'Team deathmatch';
            default: return 'Unknown';
        }
    }
    showHistoryPanel() {
        $("#matchContainer").addClass("hidden");
        $("#playerMatchHistory").addClass("show");
        $("#playerMatchHistory").removeClass("hidden");
    }
    showLiveMatchPanel() {
        $("#matchContainer").removeClass("hidden");
        $("#playerMatchHistory").removeClass("show");
        $("#playerMatchHistory").addClass("hidden");

    }
    //Show the match information on screen
    showMatchInfo(data) {
        //Show map, queue and region info
        const map = String(data.map).substr(4);
        const queue = this.getQueueName(data.queue);
        $("#matchDetails").append(map + " (" + queue + ", " + data.region + ")");
        //Show averages
        $("#team1Average").addClass("r" + Math.round(data.teams[0].averageRank));
        $("#team1Average").addClass("ri");
        $("#team1Average span").append(data.teams[0].averageLevel + "<br/>" + data.teams[0].averageWinPer + "%");
        $("#team2Average").addClass("r" + Match.round(data.teams[1].averageRank));
        $("#team2Average").addClass("ri");
        $("#team2Average span").append(data.teams[1].averageLevel + "<br/>" + data.teams[1].averageWinPer + "%");
        $("#team1WinChance").append(data.teams[0].chance.toFixed(2) + "%");
        $("#team2WinChance").append(data.teams[1].chance.toFixed(2) + "%");
        //Loop through players and show them
        data.players.forEach((player, index) => {
            this.addPlayer(player);
        });
    }
    //Show the player information
    addPlayer(player) {
        let fontSize = 0;
        if(player.name.toString().length < 14) fontSize = "1.5em";
        if(player.name.toString().length < 20) fontSize = "1.2em";
        if(player.name.toString().length < 100) fontSize = "1em";

        $("#teamContainer" + player.team).append(
            `<div class="playerContainer">
                <div class="playerImage" style="background:url(../Assets/Images/Champions/${player.championName}.png)">
                    <div class="playerName noselect" style="font-size:${fontSize}">${player.name}</div>
                    <div class="playerChampion noselect">${player.championName.trim()}<div class="ri r${player.rank}"></div></div>
                    <div class="playerLevel noselect">${player.level}</div>
                </div>
                <div class="playerInfo">
                    <div class="playerInfoText">Player info</div>
                    <div class="playerInfoStats">
                        <div class="playerInfoStatsRanked">Ranked</div>
                        <div class="playerInfoStatsGlobal">Global</div>
                        <div class="winrate">
                            <div class="rankedWinStat">${player.rankedWins}</div>
                            <div class="rankedLoseStat">${player.rankedLosses}</div>
                            <div class="rankedPerStat">${player.rankedWinPer}%</div>
                            <div class="globalWinStat">${player.globalWins}</div>
                            <div class="globalLoseStat">${player.globalLosses}</div>
                            <div class="globalPerStat">${player.globalWinPer}%</div>
                        </div>
                        <div class="playerInfoStatDivider"></div>
                        <div class="rankedLeaveStat">
                            <div class="rankedLeaves">${player.rankedLeaves}</div>
                            <div class="rankedLeavePer">${player.rankedLeavePer}%</div>
                        </div>
                        <div class="globalLeaveStat">
                            <div class="globalLeaves">${player.globalLeaves}</div>
                            <div class="globalLeavePer">${player.globalLeavePer}%</div>
                        </div>
                    </div>
                </div>
                <div class="champInfo">
                    <div class="champInfoText">Champion info</div>
                    <div class="champInfoStats">
                        <div class="champInfoStatsRanked">Ranked</div>
                        <div class="champRankedStats">${player.championRankedAverageKills} / ${player.championRankedAverageDeaths} / ${player.championRankedAverageAssists}</div>
                        <div class="champInfoStatsCasual">Casual</div>
                        <div class="champCasualStats">${player.championCasualAverageKills} / ${player.championCasualAverageDeaths} / ${player.championCasualAverageAssists}</div>
                        <div class="champInfoStatDivider"></div>
                        <div class="champRankedWinStat">
                            <div class="champRankedWins">${player.championRankedWins}</div>
                            <div class="champRankedLosses">${player.championRankedLosses}</div>
                            <div class="champRankedWinPer">${player.championRankedWinPer}%</div>
                        </div>
                        <div class="champCasualWinStat">
                            <div class="champCasualWins">${player.championCasualsWins}</div>
                            <div class="champCasualLosses">${player.championCasualsLosses}</div>
                            <div class="champCasualWinPer">${player.championCasualsWinPer}%</div>
                        </div>
                    </div>
                </div>
            </div>`
        );
    }
    //Show the history
    showMatchHistory(matches) {
        $("#matchContainer").addClass("hidden");
        $("#playerMatchHistory").addClass("show");
        //Loop through matches
        matches.forEach((match) => {
            const map = String(match[0].Map_Game).substr(4);
            const queue = this.getQueueName(match[0].match_queue_id);
            $("#playerMatchHistory").append(
                `<div id="${match[0].Match}" class="match">
                    <div class="matchInfoContainer">
                        <div class="matchInfo">${map} (${queue})</div>
                        <div class="matchTime">${match[0].Entry_Datetime}</div>
                    </div>
                    <div class="matchTeam1"></div>
                    <div class="matchTeam2"></div>
                </div>`
            );
            this.addMatch(match);
        });
    }
    //Add the match to the html
    addMatch(match) {
        match.forEach((player) => {
            //Get the damage values formatted correctly
            let damage = (player.Damage_Player < 1000) ? player.Damage_Player : (player.Damage_Player / 1000).toFixed(3);
            let damageTaken = (player.Damage_Taken < 1000) ? player.Damage_Taken : (player.Damage_Taken / 1000).toFixed(3);
            let Shielding = (player.Damage_Mitigated < 1000) ? player.Damage_Mitigated : (player.Damage_Mitigated / 1000).toFixed(3);
            let Healing = (player.Healing < 1000) ? player.Healing : (player.Healing / 1000).toFixed(3);
            let selfHealing = (player.Healing_Player_Self < 1000) ? player.Healing_Player_Self : (player.Healing_Player_Self / 1000).toFixed(3);
            if(player.playerName.length == 0) player.playerName = "Hidden";
            //Append the user to the match
            $(`#${player.Match} .matchTeam${player.TaskForce}`).append(
                `<div class="historyPlayer">
                <div class="matchPlayerHeader">
                    <div class="matchPlayerName">${player.playerName}</div>
                    <div class="matchPlayerChampion">${player.Reference_Name}</div>
                </div>
                <div class="matchPlayerStats">
                    <div class="matchPlayerKDA">
                        ${player.Kills_Player} / ${player.Deaths} / ${player.Assists}
                    </div>
                    <div class="matchPlayerDamage">
                        <span class="material-icons">adjust</span>
                        ${damage}
                    </div>
                    <div class="matchPlayerReceived">
                        <span class="material-icons">flash_on</span>
                        ${damageTaken}
                    </div>
                    <div class="matchPlayerShielding">
                        <span class="material-icons">admin_panel_settings</span>
                        ${Shielding}
                    </div>
                    <div class="matchPlayerHealing">
                        <span class="material-icons">healing</span>
                        ${Healing}
                    </div>
                    <div class="matchPlayerSelfHeal">
                        <span class="material-icons">spa</span>
                        ${selfHealing}
                    </div>
                </div>
            </div>`
            );
        });
    }

    //Show the players found from the username the user has given
    showPlayers(players) {
        $("#searchResults").empty();
        players.forEach((player) => {
            if(player.hz_player_name == null) return;
            if(favorites.some(f => f.id === player.player_id)) return;
            $("#searchResults").append(
                `<div id="p${player.player_id}" class="searchResult">
                    <div class="searchName">${player.Name}</div>
                    <div class="showCurrentMatch noselect">Live</div>
                    <div class="showHistory noselect">History</div>
                    <div class="favoriteToggle noselect addToFavorites">
                        <span class="material-icons">star_outline</span>
                    </div>
                </div>`
            );
            $(`#p${player.player_id}`).click((event) => {
                $("#searchResults").empty();
                const userId = player.player_id;
                const userName = player.Name;
                window.API.send("addToFavorites", {
                    id: userId,
                    name: userName
                });
            });
        });
    }

    //Show favorites
    showFavorites(players) {
        $("#playerFavorites").empty();
        for(var id in players) {
            favorites.push({
                id: id,
                name: players[id]
            });
            $("#playerFavorites").append(
                `<div id="${id}" class="favorite">
                    <div class="favoriteName">${players[id]}</div>
                    <div class="showCurrentMatch noselect">Live</div>
                    <div class="showHistory noselect">History</div>
                    <div class="favoriteToggle noselect">
                        <span class="material-icons">star</span>
                    </div>
                </div>`
            );
            $(`#${id}`).click((event) => {
                favorites.some(f => {
                    if(f.id === id) {
                        favorites.splice(favorites.indexOf(f), 1);
                        return true;
                    }
                    return false;
                });
                window.API.send("removeFromFavorites", {
                    id: id
                });
            });
        }
    }
}