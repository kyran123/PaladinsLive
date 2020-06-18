const axios = require('axios');
const moment = require('moment');
const md5 = require('md5');

let Match = require('../Models/Match.js');
let Player = require('../Models/Player.js');
const { nextTick } = require('process');
const { resolve } = require('path');

class PaladinsAPI {
    constructor() {
        this.apiLink = 'http://api.paladins.com/paladinsapi.svc';
        this.methods = {
            test: 'testsessionJson',
            create: 'createsessionJson',
            player: 'getplayerJson',
            playerStatus: 'getplayerstatusJson',
            liveMatch: 'getmatchplayerdetailsJson',
            queueStats: 'getqueuestatsJson',
            matchHistory: 'getmatchhistoryJson',
            matchDetails: 'getmatchdetailsbatchJson'
        }
    }
    //Session
    //Session is basically an id that identifies this machine for the api
    //Every 15 minutes this session needs to be renewed

    //Checks if the session is valid
    async isSessionValid() {
        //Create new promise and return it
        return new Promise((resolve, reject) => {
            //Check if session variable is already empty, and then return false
            if(this.session == null) return resolve(false);
            //If session variable is not empty, use the testsessionJson method to verify if it's still valid
            axios.get(`${this.apiLink}/${this.methods.test}/${this.user.devId}/${this.getSignature('testsession')}/${this.session}/${this.timeStamp()}`)
            .then((result) => {
                //If it's invalid, resolve with false parameter
                if(result.data.startsWith("Invalid")) return resolve(false);
                //If we get here, it's valid and we can resolve with true parameter
                return resolve(true);
            })
            .catch((err) => {
                console.log("[PaladinsAPI.js]:isSessionValid() error: " + err);
            });
        });
    }
    //Gets the latest session IF NEEDED
    getSessionIfNeeded() {      
        return new Promise(async (resolve, reject) => {
            try {
                //Check if there is an session stored and is correct
                const result = await this.isSessionValid();
                //Check if session if valid and then resolve
                if(result) resolve(true);
                //No valid session so create a new session
                const sessionResult = await axios.get(`${this.apiLink}/${this.methods.create}/${this.user.devId}/${this.getSignature('createsession')}/${this.timeStamp()}`)
                this.session = sessionResult.data.session_id;
                resolve(true);
            }
            catch (err) {
                console.log("[PaladinsAPI.js]:getSessionIfNeeded() " + err);
                reject();
            }            
        });
    }
    //Get signature needed for the requests
    getSignature(method) {
        return md5(`${this.user.devId}${method}${this.user.authKey}${this.timeStamp()}`);
    }
    //Gets the current time stamp
    timeStamp() {
        return moment.utc().format("YYYYMMDDHHmmss");
    }

    //Live match data
    // 1) I have to get the player status. See if they are in an actual live match and get the id of said match
    // 2) Get the live match stats
    // 3) Get the player ranks
    // 4) Get the player queue stats (casual & ranked) with the said champion

    //Get actual paladins data
    async getLiveMatchData(playerId, callback) {
        try {
            await this.getSessionIfNeeded();
            const matchData = await axios.get(`${this.apiLink}/${this.methods.playerStatus}/${this.user.devId}/${this.getSignature('getplayerstatus')}/${this.session}/${this.timeStamp()}/${playerId}`);
            //Check player status
            //0 - offline
            //1 - In lobby
            //2 - Champion selection
            //3 - In game
            //4 - Online (player may be blocking data if this shows up)
            //5 - Unknown
            const userStatus = matchData.data[0].status;
            const matchId = matchData.data[0].Match;
            if(userStatus === 0) callback({ result: false, msg: "User is offline" });
            if(userStatus === 1) callback({ result: false, msg: "User is in lobby" });
            if(userStatus === 2) callback({ result: false, msg: "User is in champion select screen" });
            if(userStatus === 4 || userStatus === 5) callback({ result: false, msg: "User has data hidden" });
            if(userStatus === 3) {
                const matchStats = await axios.get(`${this.apiLink}/${this.methods.liveMatch}/${this.user.devId}/${this.getSignature('getmatchplayerdetails')}/${this.session}/${this.timeStamp()}/${matchId}`);                
                this.match = new Match(
                    matchStats.data[0].Queue,
                    matchStats.data[0].mapGame,
                    matchStats.data[0].playerRegion
                );
                for(var i = 0; i < matchStats.data.length; i++) {
                    await this.getPlayerData(matchStats.data[i], i);
                }
                this.match.getAverages();
                this.match.calculateWinchance();
                callback({ match: this.match, result: true });
            }
        }
        catch (err) {
            console.dir(err, {depth: null});
            console.log("[PaladinsAPI.js]:getLiveMatchData() " + err); 
        }
    }
    
    //Get actual player information
    async getPlayerData(playerInfo, index) {
        try {
            //Create new player object
            //Add player object to the match player list
            const playerObj = this.match.addPlayer(new Player(
                index,
                playerInfo.playerId,
                playerInfo.playerName, 
                playerInfo.Account_Level, 
                playerInfo.taskForce,
                playerInfo.ChampionId, 
                playerInfo.ChampionName
            ));
            //Get the player rank
            const player = await axios.get(`${this.apiLink}/${this.methods.player}/${this.user.devId}/${this.getSignature('getplayer')}/${this.session}/${this.timeStamp()}/${playerObj.id}`)
                                    .catch((err) => { console.log("[PaladinsAPI.js]:getPlayerData() get player - error: " + err); });
            //Get the player data in a JS object
            const PlayerJSobject = player.data[0];
            //Check if user is KBM
            if(PlayerJSobject.Tier_RankedKBM > 0) {
                playerObj.setPlayerRank(
                    PlayerJSobject.Tier_RankedKBM, 
                    PlayerJSobject.RankedKBM.Points, 
                    PlayerJSobject.RankedKBM.Wins, 
                    PlayerJSobject.RankedKBM.Losses, 
                    PlayerJSobject.RankedKBM.Leaves, 
                    PlayerJSobject.Wins, 
                    PlayerJSobject.Losses, 
                    PlayerJSobject.Leaves
                );
            }
            //Check if user is Controller
            if(PlayerJSobject.Tier_RankedController > 0) {
                playerObj.setPlayerRank(
                    PlayerJSobject.Tier_RankedController,
                    PlayerJSobject.RankedController.Points,
                    PlayerJSobject.RankedController.Wins,
                    PlayerJSobject.RankedController.Losses,
                    PlayerJSobject.RankedController.Leaves,
                    PlayerJSobject.Wins,
                    PlayerJSobject.Losses,
                    PlayerJSobject.Leaves
                )
            }
            //Check if player does have data hidden
            if(PlayerJSobject === undefined) {
                playerObj.setPlayerRank(
                    '?', 
                    '?', 
                    '?', 
                    '?', 
                    '?', 
                    "?", 
                    "?", 
                    "?"
                );
            }

            //Get casual queue stat for player
            const casual = await axios.get(`${this.apiLink}/${this.methods.queueStats}/${this.user.devId}/${this.getSignature('getqueuestats')}/${this.session}/${this.timeStamp()}/${playerObj.id}/424`);
            const casualChampions = casual.data;
            casualChampions.forEach((champion) => {
                //check if data is for the champion the user has chosen
                if(champion.ChampionId == playerObj.championId) {
                    //Only called once we found the right champion
                    playerObj.setPlayerCasualChampion(
                        champion.Assists,
                        champion.Kills,
                        champion.Deaths,
                        champion.Losses,
                        champion.Wins,
                        champion.Matches,
                        champion.Gold
                    );
                }
            });
            

            //Get ranked queue stat for player
            const ranked = await axios.get(`${this.apiLink}/${this.methods.queueStats}/${this.user.devId}/${this.getSignature('getqueuestats')}/${this.session}/${this.timeStamp()}/${playerObj.id}/428`);
            const rankedChampions = ranked.data;
            rankedChampions.forEach((champion) => {
                 //check if data is for the champion the user has chosen
                if(champion.ChampionId == playerObj.championId) {
                    //Only called once we found the right champion
                    playerObj.setPlayerRankedChampion(
                        champion.Assists,
                        champion.Kills,
                        champion.Deaths,
                        champion.Losses,
                        champion.Wins,
                        champion.Matches,
                        champion.Gold
                    );
                }
            });
           
            playerObj.validate();
        }
        catch(err) {
            console.log("[PaladinsAPI.js]:getPlayerData() " + err);
        }
    }

    //Get match history
    async getMatchHistory(playerId, callback) {
        try {
            await this.getSessionIfNeeded();
            const playerHistory = await axios.get(`${this.apiLink}/${this.methods.matchHistory}/${this.user.devId}/${this.getSignature('getmatchhistory')}/${this.session}/${this.timeStamp()}/${playerId}`);
            let matchIds = '';
            for(var i = 0; i < 5; i++) {
                matchIds += playerHistory.data[i].Match;
                if(i < 4) {
                    matchIds += ",";
                }
            }
            const matchHistory = await axios.get(`${this.apiLink}/${this.methods.matchDetails}/${this.user.devId}/${this.getSignature('getmatchdetailsbatch')}/${this.session}/${this.timeStamp()}/${matchIds}`);
            let matches = [];
            let match = [];
            let lastId = matchHistory.data[0].Match;
            matchHistory.data.forEach((player) => {
                if(lastId !== player.Match) {
                    lastId = player.Match;
                    matches.push(match);
                    match = [];
                }
                match.push(player);
            });
            matches.push(match);
            callback({ result: true, history: matches });
        }
        catch(err) {
            console.log("[PaladinsAPI.js]:getMatchHistory() " + err); 
        }
    }
}

module.exports = new PaladinsAPI();