/*
 *
 * Match class
 * 
*/
module.exports = class match { 
    constructor() {
        this.players = [];
    }
    addPlayer(player) {
        this.players.push(player);
        return player;
    }
}