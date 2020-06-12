const axios = require('axios');
const moment = require('moment');
const md5 = require('md5');
const { promises } = require('fs');
const { resolveSoa } = require('dns');
const { session } = require('electron');

let Match = require('../Models/Match.js');
let Player = require('../Models/Player.js');

class PaladinsAPI {
    constructor() {
        this.apiLink = 'http://api.paladins.com/paladinsapi.svc';
        this.methods = {
            test: 'testsessionJson',
            create: 'createsessionJson',
            player: 'getplayerJson',
            playerStatus: 'getplayerstatusJson',
            liveMatch: 'getmatchplayerdetailsJson',
            queueStats: 'getqueuestatsJson'
        }
    }
    //Session
    //Session is basically an id that identifies this machine for the api
    //Every 15 minutes this session needs to be renewed

    //Checks if the session is valid
    isSessionValid() {
        return new promises(async (resolve, reject) => {
            //Check if session is stored here already
            if(this.session != null) {
                //Check if this session is valid
                const sessionResult = await axios.get(`${this.apiLink}/${this.methods.test}/${this.user.devId}/${this.getSignature('testsession')}/${this.session}/${this.timeStamp()}`)
                                                 .catch((err) => { console.log("[PaladinsAPI.js]:isSessionValid() error: " + err); });
                if(sessionResult.data.startsWith("Invalid")) {
                    //Key is invalid
                    resolve({ result: false });
                } else {
                    //Key is valid
                    resolve({ result: true });
                }
            } else {
                //If there is no session stored in the first place
                resolve({ result: false });
            }
        });
    }
    //Gets the latest session IF NEEDED
    getSessionIfNeeded() {
        //Check if there is an session stored and is correct
        const response = this.isSessionValid().catch((err) => { console.log("[PaladinsAPI.js]:getSessionIfNeeded() error: " + err); });
        if(!response.result) {
            //Session is not valid
            //Create new session
            const sessionResult = await axios.get(`${this.apiLink}/${this.methods.create}/${this.user.devId}/${this.getSignature('testsession')}/${this.session}/${this.timeStamp()}`)
                                                .catch((err) => { console.log("[PaladinsAPI.js]:getSessionIfNeeded() error: " + err); });
            this.session = sessionResult.data.session_id;
        }
        //We have a valid session at this point (unless the create session failed, but that SHOULD be caught)
    }
    //Get signature needed for the requests
    getSignature(method) {
        return md5('2497' + method + '02D4F4F24F994280A60F4417C3764288' + timeStamp());
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
    getLiveMatchData(playerId, callback) {

        //Get the player status
        const status = axios.get(`${this.apiLink}/${this.methods.playerStatus}/${this.user.devId}/${this.getSignature('getplayerstatus')}/${this.session}/${this.timeStamp()}/${playerId}`)
                            .catch((err) => { console.log("[PaladinsAPI.js]:getLiveMatchData() player status - error: " + err); });
        const matchId = status.data[0].Match;
        if(matchId === 0) callback({ result: false, msg: "No match found" });
        //Create new match object
        this.match = new Match();
        //Now that we have the match id

        //Get the live match stats
        const matchStats = axios.get(`${this.apiLink}/${this.methods.liveMatch}/${this.user.devId}/${this.getSignature('getmatchplayerdetails')}/${this.session}/${this.timeStamp()}/${matchId}`)
                                .catch((err) => { console.log("[PaladinsAPI.js]:getLiveMatchData() live match stats - error: " + err); });
        //Check if match stats returned any users
        if(Object.keys(matchStats.data).length === 0) { console.log("[PaladinsAPI.js]:getLiveMatchData() match stats array check - error: " + err); };
        matchStats.data.forEach((player, index) => {
            this.getPlayerData(player, index);
        });
    }
    
    //Get actual player information
    getPlayerData(playerInfo, index) {
        //Create new player object
        //Add player object to the match player list
        const playerObj = this.match.addPlayer(new Player(
            index,
            playerInfo.playerId,
            playerInfo.playerName, 
            playerInfo.Account_Level, 
            playerInfo.taskForce,
            playerInfo.ChampionId, 
            playerInfo.ChampionName, 
            playerInfo.Queue, 
            playerInfo.mapGame
        ));

        //Get the player rank
        const player = axios.get(`${this.apiLink}/${this.methods.player}/${this.getSignature('getplayer')}/${this.session}/${this.timeStamp()}/${playerObj.id}`)
                                .catch((err) => { console.log("[PaladinsAPI.js]:getPlayerData() get player - error: " + err); });
        //Get the player data in a JS object
        const PlayerJSobject = JSON.parse(player.data[0]);
        //Check if user is KBM, if not get other data
        console.dir(PlayerJSobject, { depth: null }); // TEMPORARY
        if(PlayerJSobject.Tier_RankedKBM !== undefined) {
            //KBM
            playerObj.setPlayerRank(
                response.data[0].Tier_RankedKBM, 
                response.data[0].RankedKBM.Points, 
                response.data[0].RankedKBM.Wins, 
                response.data[0].RankedKBM.Losses, 
                response.data[0].RankedKBM.Leaves, 
                response.data[0].Wins, 
                response.data[0].Losses, 
                response.data[0].Leaves
            );
        } else {
            //Not KBM
            //TODO: figure out how to get ranked stats for non-kbm ranked players
            playerObj.setPlayerRank(
                '?', 
                '?', 
                '?', 
                '?', 
                '?', 
                response.data[0].Wins, 
                response.data[0].Losses, 
                response.data[0].Leaves
            );            
        }
        //Check if player doesn't have data hidden
        //Doing this after the fact, because the other if statement would have overwritten this data I set here
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

    }
}

module.exports = new PaladinsAPI();