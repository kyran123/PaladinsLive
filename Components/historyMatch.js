import eventBus from '../Libraries/EventBus.js';

const historyMatch = Vue.component('history-match', {
    name: 'history-match',
    props: ['match', 'players'],
    template: `
        <div class="historyMatch" @click="setCollapse(!collapsed)">
            <div class="match-top-info">
                <div class="match-won" v-if="match.isWon">Won</div>
                <div class="match-lost" v-if="!match.isWon">Lost</div>
                <div class="match-title">
                    <div class="match-map">{{match.map}}</div>
                    <div class="match-info">{{queue[match.mode]}} | {{Math.floor(match.duration / 60) + ':' + ('0' + Math.floor(match.duration % 60)).slice(-2)}}</div>
                </div>
                <div class="match-id">{{match.id}}</div>
            </div>
            <div class="match-player-details-collapsed" v-if="collapsed">
                <div></div>
                <div class="team1collapsed">
                    <div v-for="player in players" v-if="player.TaskForce == 1" class="player-left">
                        <div  :class="match.user == player.playerId ? 'highlightPlayer' : ''">{{player.playerName || "Hidden"}}</div>
                        <div class="championName">{{player.Reference_Name}}</div>
                    </div>
                </div>
                <div class="team2collapsed">
                    <div v-for="player in players" v-if="player.TaskForce == 2" class="player-right">
                        <div class="championName">{{player.Reference_Name}}</div>
                        <div  :class="match.user == player.playerId ? 'highlightPlayer' : ''">{{player.playerName || "Hidden"}}</div>
                    </div>
                </div>
            </div>
            <div class="match-player-details" v-if="!collapsed">
                <div class="team1">
                    <div v-for="player in players" v-if="player.TaskForce == 1" class="player-left-expanded">
                        <div class="player-history-details-top">
                            <div  :class="match.user == player.playerId ? 'highlightPlayer' : ''">{{player.playerName || "Hidden"}}</div>
                            <div class="championName">{{player.Reference_Name}}</div>
                        </div>
                        <div class="player-history-details-bottom">
                            <div class="historyKDA">
                                <div class="statText">KDA:</div>
                                <div class="textRight">{{player.Kills_Player}} / {{player.Deaths}} / {{player.Assists}}</div>
                            </div>
                            <div class="matchPlayerReceived">
                                <div class="statText">Damage:</div>
                                <div class="textRight">{{(player.Damage_Taken < 1000) ? player.Damage_Player : (player.Damage_Player / 1000).toFixed(3)}}</div>
                            </div>
                            <div class="matchPlayerShielding">
                                <div class="statText">Damage received:</div>
                                <div class="textRight">{{(player.Damage_Mitigated < 1000) ? player.Damage_Mitigated : (player.Damage_Mitigated / 1000).toFixed(3)}}</div>
                            </div>
                            <div class="matchPlayerShielding">
                                <div class="statText">Shielding</div>
                                <div class="textRight">{{(player.Damage_Mitigated < 1000) ? player.Damage_Mitigated : (player.Damage_Mitigated / 1000).toFixed(3)}}</div>
                            </div>
                            <div class="matchPlayerHealing">
                                <div class="statText">Healing</div>
                                <div class="textRight">{{(player.Healing < 1000) ? player.Healing : (player.Healing / 1000).toFixed(3)}}</div>
                            </div>
                            <div class="matchPlayerSelfHeal">
                                <div class="statText">Self healing</div>
                                <div class="textRight">{{(player.Healing_Player_Self < 1000) ? player.Healing_Player_Self : (player.Healing_Player_Self / 1000).toFixed(3)}}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="verticalDivider"></div>
                <div class="team2">
                    <div v-for="player in players" v-if="player.TaskForce == 2" class="player-right-expanded">
                        <div class="player-history-details-top">
                            <div class="championName">{{player.Reference_Name}}</div>
                            <div  :class="match.user == player.playerId ? 'highlightPlayer' : ''">{{player.playerName || "Hidden"}}</div>
                        </div>
                        <div class="player-history-details-bottom">
                            <div class="historyKDA">
                                <div class="statText">KDA:</div>
                                <div class="textRight">{{player.Kills_Player}} / {{player.Deaths}} / {{player.Assists}}</div>
                            </div>
                            <div class="matchPlayerReceived">
                                <div class="statText">Damage:</div>
                                <div class="textRight">{{(player.Damage_Taken < 1000) ? player.Damage_Player : (player.Damage_Player / 1000).toFixed(3)}}</div>
                            </div>
                            <div class="matchPlayerShielding">
                                <div class="statText">Damage received:</div>
                                <div class="textRight">{{(player.Damage_Mitigated < 1000) ? player.Damage_Mitigated : (player.Damage_Mitigated / 1000).toFixed(3)}}</div>
                            </div>
                            <div class="matchPlayerShielding">
                                <div class="statText">Shielding</div>
                                <div class="textRight">{{(player.Damage_Mitigated < 1000) ? player.Damage_Mitigated : (player.Damage_Mitigated / 1000).toFixed(3)}}</div>
                            </div>
                            <div class="matchPlayerHealing">
                                <div class="statText">Healing</div>
                                <div class="textRight">{{(player.Healing < 1000) ? player.Healing : (player.Healing / 1000).toFixed(3)}}</div>
                            </div>
                            <div class="matchPlayerSelfHeal">
                                <div class="statText">Self healing</div>
                                <div class="textRight">{{(player.Healing_Player_Self < 1000) ? player.Healing_Player_Self : (player.Healing_Player_Self / 1000).toFixed(3)}}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            queue: {
                424: 'Casual',
                428: 'Ranked',
                452: 'Onslaught',
                469: 'Team deathmatch'
            },
            collapsed: true
        }
    },
    computed: {
        getHistory: function() { return this.$store.getters.getAllMatches }
    },
    mounted() {
        $('head').append(this.css);
    },
    methods: {
        setCollapse(value) {
            if(value) {
                this.collapsed = true;
            } else {
                eventBus.$emit("collapseOtherProgressResults");
                this.collapsed = false;
            }
        }
    }
});

export default historyMatch;