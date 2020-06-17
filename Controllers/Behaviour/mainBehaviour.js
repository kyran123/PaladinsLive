$("#Minimize").click(() => {
    window.API.send("minimize", {});
});
$("#Maximize").click(() => {
    window.API.send("maximize", {});
});
$("#close").click(() => {
    window.API.send("quit", {});
});

window.onload = () => {
    $(".showCurrentMatch").click((event) => {
        const userId = $(event.target).parent().attr("id");
        window.API.send("showLiveMatch", {
            id: userId
        });
    });
    window.API.receive("showLiveMatchData", (data) => {
        console.log(data);
        new dataHandler(data);
    });
}

class dataHandler {
    constructor(data) {
        if(!data.result) {
            //User not in game
            console.log(data.msg);
        } else {
            this.refresh();
            this.showMatchInfo(data.match);
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
}
/*
{
    queue: "424", 
    map: "LIVE Ascension Peak", 
    region: "Europe", 
    players: [{
        championCasualAverageAssists: "9.18"
        championCasualAverageDeaths: "10.26"
        championCasualAverageKills: "11.96"
        championCasualGold: 183197
        championCasualsAssists: 624
        championCasualsDeaths: 698
        championCasualsKills: 813
        championCasualsLosses: 35
        championCasualsMatches: 68
        championCasualsWinPer: "48.53"
        championCasualsWins: 33
        championId: 2481
        championName: "Moji"
        championRankedAssists: 0
        championRankedAverageAssists: 0
        championRankedAverageDeaths: 0
        championRankedAverageKills: 0
        championRankedDeaths: 0
        championRankedGold: 0
        championRankedKills: 0
        championRankedLosses: 0
        championRankedMatches: 0
        championRankedWinPer: 0
        championRankedWins: 0
        globalLeavePer: 0
        globalLosses: 0
        globalWinPer: 0
        globalWins: 0
        globalleaves: 0
        id: "718149275"
        level: 73
        name: "luiskmoxx"
        nr: 0
        queueData: {
            424: "Casual Siege"
            425: "Practice Siege"
            428: "Ranked"
            445: "Test Maps"
            452: "Casual Onslaught"
            453: "Practice Onslaught"
            469: "Casual TDM"
            470: "Practice TDM"
        }
        rank: 0
        rankData: {
            1: "Bronze 5", 
            2: "Bronze 4", 
            3: "Bronze 3", 
            4: "Bronze 2", 
            5: "Bronze 1", 
            6: "Silver 5", 
            7: "Silver 4", 
            8: "Silver 3", 
            9: "Silver 2", 
            10: "Silver 1", 
            11: "Gold 5", 
            12: "Gold 4", 
            13: "Gold 3", 
            14: "Gold 2", 
            15: "Gold 1", 
            16: "Platinum 5", 
            17: "Platinum 4", 
            18: "Platinum 3", 
            19: "Platinum 2", 
            20: "Platinum 1", 
            21: "Diamond 5", 
            22: "Diamond 4", 
            23: "Diamond 3", 
            24: "Diamond 2", 
            25: "Diamond 1", 
            26: "Master", 
            27: "Grandmaster"
        }
        rankedLeavePer: 0
        rankedLeaves: 0
        rankedLosses: 0
        rankedWinPer: 0
        rankedWins: 0
        team: 2
        tp: 0
    }
]
*/