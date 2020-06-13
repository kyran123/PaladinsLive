/*
 *
 * Match class
 * 
*/
module.exports = class match { 
    constructor(queue, map_name) {
        this.players = [];
    }
    addPlayer(player) {
        this.players.push(player);
        return player;
    }
    getPlayers() {
        return this.players;
    }
}