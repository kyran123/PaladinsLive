/*
 *   PLAYER CLASS
*/
module.exports = class Player {
    rankData = {
        1: 'Bronze 5',
        2: 'Bronze 4',
        3: 'Bronze 3',
        4: 'Bronze 2',
        5: 'Bronze 1',
        6: 'Silver 5',
        7: 'Silver 4',
        8: 'Silver 3',
        9: 'Silver 2',
        10: 'Silver 1',
        11: 'Gold 5',
        12: 'Gold 4',
        13: 'Gold 3',
        14: 'Gold 2',
        15: 'Gold 1',
        16: 'Platinum 5',
        17: 'Platinum 4',
        18: 'Platinum 3',
        19: 'Platinum 2',
        20: 'Platinum 1',
        21: 'Diamond 5',
        22: 'Diamond 4',
        23: 'Diamond 3',
        24: 'Diamond 2',
        25: 'Diamond 1',
        26: 'Master',
        27: 'Grandmaster'
    }

    constructor(player_nr, player_id, player_name, player_level, player_team, champion_id, champion_name, queue_id, map_name) {
        //Player variables
        this.nr = (player_nr == null) ? "": player_nr;
        this.id = (player_id == null) ? 0 : player_id;
        this.name = (player_name == null) ? "Data for this player has been set to hidden" : player_name;
        this.level = (player_level == null) ? 0 : player_level;
        this.team = (player_team == null) ? "" : player_team;

        //Champion variables
        this.championId = (champion_id == null) ? 0 : champion_id;
        this.championName = (champion_name == null) ? "" : champion_name;

        //create variables
        this.rank = 0;
        this.tp = 0;
        this.rankedWins = 0;
        this.rankedLosses = 0;
        this.rankedLeaves = 0;
        this.rankedLeavePer = 0;
        this.rankedWinPer = 0;

        this.globalWins = 0;
        this.globalLosses = 0;
        this.globalWinPer = 0;
        this.globalLeaves = 0;
        this.globalLeavePer = 0;

        this.championCasualsAssists = 0;
        this.championCasualsKills = 0;
        this.championCasualsDeaths = 0;
        this.championCasualAverageAssists = 0;
        this.championCasualAverageKills = 0;
        this.championCasualAverageDeaths = 0;
        
        this.championCasualsLosses = 0;
        this.championCasualsWins = 0;
        this.championCasualsMatches = 0;
        this.championCasualsWinPer = 0;
        this.championCasualGold = 0;

        this.championRankedAssists = 0;
        this.championRankedKills = 0;
        this.championRankedDeaths = 0;

        this.championRankedAverageAssists = 0;
        this.championRankedAverageDeaths = 0;
        this.championRankedAverageKills = 0;

        this.championRankedLosses = 0;
        this.championRankedWins = 0;
        this.championRankedMatches = 0;
        this.championRankedWinPer = 0;
        this.championRankedGold = 0;

    }

    setPlayerRank(playerRank, playerTP, playerRankedWins, playerRankedLosses, playerRankedLeaves, playerGlobalWins, playerGlobalLosses, playerGlobalLeaves) {
        this.rank = playerRank;
        this.tp = playerTP;
        this.rankedWins = playerRankedWins;
        this.rankedLosses = playerRankedLosses;
        this.rankedLeaves = playerRankedLeaves;

        this.rankedLeavePer = (playerRankedLeaves === 0 || playerRankedWins === 0 && playerRankedLosses === 0) ? 0 : ((playerRankedLeaves / (playerRankedLosses + playerRankedWins)) * 100).toFixed(2);
        this.rankedWinPer = (playerRankedWins === 0 || playerRankedLosses === 0) ? 0 : ((playerRankedWins / (playerRankedWins + playerRankedLosses)) * 100).toFixed(2);

        this.globalWins = playerGlobalWins;
        this.globalLosses = playerGlobalLosses;

        this.globalWinPer = (playerGlobalWins === 0 && playerGlobalLosses === 0) ? 0 : ((playerGlobalWins / (playerGlobalLosses + playerGlobalWins)) * 100).toFixed(2);
        
        this.globalLeaves = playerGlobalLeaves;

        this.globalLeavePer = (playerGlobalLeaves === 0 || playerGlobalWins === 0 && playerGlobalLosses === 0) ? 0 : ((playerGlobalLeaves / (playerGlobalWins + playerGlobalLosses)) * 100).toFixed(2);
    }

    setPlayerCasualChampion(playerChampionAssists, playerChampionKills, playerChampionDeaths, playerChampionLosses, playerChampionWins, playerChampionMatches, playerChampionGold) {
        this.championCasualsAssists = playerChampionAssists;
        this.championCasualsKills = playerChampionKills;
        this.championCasualsDeaths = playerChampionDeaths;

        this.championCasualAverageAssists = (playerChampionAssists === 0 || playerChampionMatches === 0) ? 0 : (playerChampionAssists / playerChampionMatches).toFixed(2);
        this.championCasualAverageKills = (playerChampionKills === 0 || playerChampionMatches === 0) ? 0 : (playerChampionKills / playerChampionMatches).toFixed(2);
        this.championCasualAverageDeaths = (playerChampionDeaths === 0 || playerChampionMatches === 0) ? 0 : (playerChampionDeaths / playerChampionMatches).toFixed(2);
        
        this.championCasualsLosses = playerChampionLosses;
        this.championCasualsWins = playerChampionWins;
        this.championCasualsMatches = playerChampionMatches;

        this.championCasualsWinPer = (playerChampionWins === 0 || playerChampionMatches === 0) ? 0 : ((playerChampionWins / playerChampionMatches) * 100).toFixed(2);
        
        this.championCasualGold = playerChampionGold;
    }

    setPlayerRankedChampion(playerChampionAssists, playerChampionKills, playerChampionDeaths, playerChampionLosses, playerChampionWins, playerChampionMatches, playerChampionGold) {        
        this.championRankedAssists = playerChampionAssists;
        this.championRankedKills = playerChampionKills;
        this.championRankedDeaths = playerChampionDeaths;

        this.championRankedAverageAssists = (playerChampionAssists === 0) ? 0 : (playerChampionAssists / playerChampionMatches).toFixed(2);
        this.championRankedAverageDeaths = (playerChampionDeaths === 0) ? 0 : (playerChampionDeaths / playerChampionMatches).toFixed(2);
        this.championRankedAverageKills = (playerChampionKills === 0) ? 0 : (playerChampionKills / playerChampionMatches).toFixed(2);

        this.championRankedLosses = playerChampionLosses;
        this.championRankedWins = playerChampionWins;
        this.championRankedMatches = playerChampionMatches;

        this.championRankedWinPer = (playerChampionWins === 0 || playerChampionMatches === 0) ? 0 : ((playerChampionWins / playerChampionMatches) * 100).toFixed(2);
        
        this.championRankedGold = playerChampionGold;
    }

    validate() {
        this.rankedLeavePer = (this.rankedLeavePer == undefined) ? 0 : this.rankedLeavePer;
        this.rankedWinPer = (this.rankedWinPer == undefined) ? 0 : this.rankedWinPer;
        this.globalWinPer = (this.globalWinPer == undefined) ? 0 : this.globalWinPer;
        this.globalLeavePer = (this.globalLeavePer == undefined) ? 0 : this.globalLeavePer;

        this.championCasualAverageAssists = (this.championCasualAverageAssists == undefined) ? 0 : this.championCasualAverageAssists;
        this.championCasualAverageKills = (this.championCasualAverageKills == undefined) ? 0 : this.championCasualAverageKills;
        this.championCasualAverageDeaths = (this.championCasualAverageDeaths == undefined) ? 0 : this.championCasualAverageDeaths;
        this.championCasualsWinPer = (this.championCasualsWinPer == undefined) ? 0 : this.championCasualsWinPer;

        this.championRankedAverageAssists = (this.championRankedAverageAssists ==undefined) ? 0 : this.championRankedAverageAssists;
        this.championRankedAverageDeaths = (this.championRankedAverageDeaths == undefined) ? 0 : this.championRankedAverageDeaths;
        this.championRankedAverageKills = (this.championRankedAverageKills == undefined) ? 0 : this.championRankedAverageKills;
        this.championRankedWinPer = (this.championRankedWinPer == undefined) ? 0 : this.championRankedWinPer;
        this.championRankedWins = (this.championRankedWins == undefined) ? 0 : this.championRankedWins;
        this.championRankedLosses = (this.championRankedLosses == undefined) ? 0 : this.championRankedLosses;
    }
}