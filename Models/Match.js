/*
 *
 * Match class
 * 
*/
module.exports = class match { 
    constructor(queue, map_name, region) {
        this.queue = queue;
        this.map = map_name;
        this.region = region;
        this.players = [];
        this.teams = [];
    }
    addPlayer(player) {
        this.players.push(player);
        return player;
    }
    getPlayers() {
        return this.players;
    }
    getAverages() {
        //Get team total stats
        //We need to get the total stats first so we can later display the averages
        let teamsTotalRankDivide = [0, 0];
        let teamsTotalRank = [0, 0];
        let teamsTotalLevels = [0, 0];

        let teamsTotalChampionDivideCasual = [0, 0];
        let teamsTotalChampionWinPerCasual = [0, 0];
        let teamsTotalChampionDivideRanked = [0, 0];
        let teamsTotalChampionWinPerRanked = [0, 0];
        
        let teamsTotalDivide = [0, 0];
        let teamsTotalWinPer = [0, 0];

        let teamsTotalChampionKills = [0, 0];
        let teamsTotalChampionDeaths = [0, 0];
        let teamsTotalChampionAssists = [0, 0];

        let championCasualsMatches = [0, 0];
        let teamsTotalChampionGames = [0, 0];

        //Loop through all players
        this.players.forEach((player) => {
            const index = (parseInt(player.team) - 1);
            //Add to player rank totals
            if(player.rank > 0) {
                teamsTotalRankDivide[index]++;
                teamsTotalRank[index] += parseInt(player.rank);
            }
            //Add to level totals
            teamsTotalLevels[index] += player.level;
            //Get average casual win per with champion
            if(player.championCasualsMatches > 0) {
                teamsTotalChampionDivideCasual[index]++;
                teamsTotalChampionWinPerCasual[index] += parseInt(player.championCasualsWinPer);
                teamsTotalDivide[index]++;
                teamsTotalWinPer[index] += parseInt(player.championCasualsWinPer);
            }
            //Get average ranked win per with champion
            if(player.championRankedMatches > 0) {
                teamsTotalChampionDivideRanked[index]++;
                teamsTotalChampionWinPerRanked[index] += parseInt(player.championRankedWinPer);
                teamsTotalDivide[index]++;
                teamsTotalWinPer[index] += parseInt(player.championRankedWinPer);
            }
            //Get average champion kills for the player
            if(teamsTotalChampionKills[index] > 0) teamsTotalChampionKills[index] += (parseInt(player.championCasualsKills) + parseInt(player.championRankedKills));
            //Get average champion deaths for the player
            if(teamsTotalChampionDeaths[index] > 0) teamsTotalChampionDeaths[index] += (parseInt(player.championCasualsDeaths) + parseInt(player.championRankedDeaths));
            //Get the average champion assists for the player
            if(teamsTotalChampionAssists[index] > 0) teamsTotalChampionAssists[index] += (parseInt(player.championCasualsAssists) + parseInt(player.championRankedAssists));

            //Get the teams total games with champion played
            if(teamsTotalChampionGames[index] > 0) teamsTotalChampionGames[index] += (parseInt(player.championRankedMatches) + parseInt(championCasualsMatches));
        });

        for(var i = 0; i < 2; i++) {
            this.teams[i] = {
                averageRank: (teamsTotalRank[i] / teamsTotalRankDivide[i]).toFixed(2),
                averageWinPerCasual: (teamsTotalChampionWinPerCasual[i] / teamsTotalChampionDivideCasual[i]).toFixed(2),
                averageWinPerRanked: (teamsTotalChampionWinPerRanked[i] / teamsTotalChampionDivideRanked[i]).toFixed(2),
                averageWinPer: (teamsTotalWinPer[i] / teamsTotalDivide[i]).toFixed(2),
                averageLevel: (teamsTotalLevels[i] / 5).toFixed(2),
                averageKills: (teamsTotalChampionKills[i] / 5).toFixed(2),
                averageDeaths: (teamsTotalChampionDeaths[i] / 5).toFixed(2),
                averageAssists: (teamsTotalChampionAssists[i] / 5).toFixed(2),
                totalGamesPlayed: (teamsTotalChampionGames[i] / 5).toFixed(2)
            }
        }
    }
    calculateWinchance() {
        let team1Chance = parseInt(this.teams[0].averageWinPer) * (parseInt(this.teams[0].totalGamesPlayed) / 100);
        let team2Chance = parseInt(this.teams[1].averageWinPer) * (parseInt(this.teams[1].totalGamesPlayed) / 100);
        team1Chance += parseInt(this.teams[0].averageKills) / 200;
        team2Chance += parseInt(this.teams[1].averageKills) / 200;
        team1Chance += parseInt(this.teams[0].averageDeaths) / 200;
        team2Chance += parseInt(this.teams[1].averageDeaths) / 200;
        team1Chance += parseInt(this.teams[0].averageAssists) / 500;
        team2Chance += parseInt(this.teams[1].averageAssists) / 500;
        team1Chance += parseInt(this.teams[0].averageRank) / 100;
        team2Chance += parseInt(this.teams[1].averageRank) / 100;
        team1Chance += parseInt(this.teams[0].averageLevel) / 100;
        team2Chance += parseInt(this.teams[1].averageLevel) / 100;
        let difference = 0;
        if((team1Chance / 5) > (team2Chance / 5)) {
            difference += (team1Chance - team2Chance) / 2;
            this.teams[0].chance = 50 + difference;
            this.teams[1].chance = 50 - difference;
        } else {
            difference += (team2Chance - team1Chance) / 2;
            this.teams[0].chance = 50 - difference;
            this.teams[1].chance = 50 + difference;
        }
    }
}