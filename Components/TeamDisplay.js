import eventBus from '../Libraries/EventBus.js';

const teamDisplay = Vue.component('team-display', {
    name: 'team-display',
    components: {
    },
    props: ['team'],
    template: `
        <div class="teamDisplay">

            <div class="teamStats">
                <div class="averageRank" :style='{ background: "url(" + ranks[Math.round(getLiveMatchData.teams[team-1].averageRank)] + ")" }'></div>
                <div class="teamStatContainer">
                    <div class="averageLevel">
                            Average level:<p>{{getLiveMatchData.teams[team-1].averageLevel}}</p>
                    </div>
                    <div class="averageWinPer">
                            Average Win %:<p>{{getLiveMatchData.teams[team-1].averageWinPer}}%</p>
                    </div>
                    <div class="averageWinChance">
                            Estimated win %:<p>{{getLiveMatchData.teams[team-1].chance}}%</p>
                    </div>
                </div>
            </div>

            <div v-for="player in getLiveMatchData.players" :key="player.id" v-if="player.team == team" class="playerContainer">
                <div class="playerImage" :style='{ background: "url(../Assets/Images/Champions/" + player.championNameFormatted + ".png)" }'>
                    <div class="playerName noselect" v-if="player.name">{{player.name}}</div>
                    <div class="playerName noselect" v-if="!player.name">Hidden</div>
                </div>
                <div class="playerBasics">
                    <div class="playerChampion noselect">{{player.championName.trim()}}<div :class="'ri r'+player.rank"></div></div>
                    <div class="playerLevel noselect">{{player.level}}</div>
                    <div></div>
                    <div class="playerRankContainer">
                        <div class="playerRank" :style='{ background: "url(../Assets/Images/Ranks/r" + player.rank + ".png)" }'></div>
                        <div class="playerTP" v-if="player.rank > 0">{{player.tp}} TP</div>
                    </div>
                </div>
                <div class="playerInfo">
                    <div class="playerInfoStats">
                        <div classs="legendTitle">Player statistics:</div>
                        <div class="infoStats">
                            <div class="statLegend">
                                <div>Ranked</div>
                                <div>Global</div>
                            </div>
                            <div class="playerStats">
                                <div class="rankedStats">
                                    <div class="stat3">
                                        <div class="rankedWinStat">{{player.rankedWins}}</div>
                                        <div class="rankedLoseStat">{{player.rankedLosses}}</div>
                                        <div class="rankedPerStat">{{player.rankedWinPer}}%</div>
                                    </div>
                                    <div class="verticalDivider"></div>
                                    <div class="stat2">
                                        <div class="rankedLeaves">{{player.rankedLeaves}}</div>
                                        <div class="rankedLeavePer">{{player.rankedLeavePer}}%</div>
                                    </div>
                                </div>
                                <div class="globalStats">
                                    <div class="stat3">
                                        <div class="globalWinStat">{{player.globalWins}}</div>
                                        <div class="globalLoseStat">{{player.globalLosses}}</div>
                                        <div class="globalPerStat">{{player.globalWinPer}}%</div>
                                    </div>
                                    <div class="verticalDivider"></div>
                                    <div class="stat2">
                                        <div class="globalLeaves">{{player.globalLeaves}}</div>
                                        <div class="globalLeavePer">{{player.globalLeavePer}}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="championInfoStats">
                        <div class="legendTitle">Champion statistics:</div>
                        <div class="infoStats">
                            <div class="statLegend">
                                <div>Ranked</div>
                                <div>Global</div>
                            </div>
                            <div class="championStats">
                                <div class="championRankedStats">
                                    <div class="champRankedStats">{{player.championRankedAverageKills}} / {{player.championRankedAverageDeaths}} / {{player.championRankedAverageAssists}}</div>
                                    <div class="verticalDivider"></div>
                                    <div class="championWL">
                                        <div class="champRankedWins">{{player.championRankedWins}}</div>
                                        <div class="champRankedLosses">{{player.championRankedLosses}}</div>
                                        <div class="champRankedWinPer">{{player.championRankedWinPer}}%</div>
                                    </div>
                                </div>
                                <div class="championGlobalStats">
                                    <div class="champCasualStats">{{player.championCasualAverageKills}} / {{player.championCasualAverageDeaths}} / {{player.championCasualAverageAssists}}</div>
                                    <div class="verticalDivider"></div>
                                    <div class="championWL">
                                        <div class="champCasualWins">{{player.championCasualsWins}}</div>
                                        <div class="champCasualLosses">{{player.championCasualsLosses}}</div>
                                        <div class="champCasualWinPer">{{player.championCasualsWinPer}}%</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            ranks: {
                0: '../Assets/Images/Ranks/r0.png',
                1:'../Assets/Images/Ranks/r1.png',
                2:'../Assets/Images/Ranks/r2.png',
                3:'../Assets/Images/Ranks/r3.png',
                4:'../Assets/Images/Ranks/r4.png',
                5:'../Assets/Images/Ranks/r5.png',
                6:'../Assets/Images/Ranks/r6.png',
                7:'../Assets/Images/Ranks/r7.png',
                8:'../Assets/Images/Ranks/r8.png',
                9:'../Assets/Images/Ranks/r9.png',
                10:'../Assets/Images/Ranks/r10.png',
                11:'../Assets/Images/Ranks/r11.png',
                12:'../Assets/Images/Ranks/r12.png',
                13:'../Assets/Images/Ranks/r13.png',
                14:'../Assets/Images/Ranks/r14.png',
                15:'../Assets/Images/Ranks/r15.png',
                16:'../Assets/Images/Ranks/r16.png',
                17:'../Assets/Images/Ranks/r17.png',
                18:'../Assets/Images/Ranks/r18.png',
                19:'../Assets/Images/Ranks/r19.png',
                20:'../Assets/Images/Ranks/r20.png',
                21:'../Assets/Images/Ranks/r21.png',
                22:'../Assets/Images/Ranks/r22.png',
                23:'../Assets/Images/Ranks/r23.png',
                24:'../Assets/Images/Ranks/r24.png',
                25:'../Assets/Images/Ranks/r25.png',
                26:'../Assets/Images/Ranks/r26.png',
                27:'../Assets/Images/Ranks/r27.png'
            }
        }
    },
    computed: {
        css: function() {
            return `
                <style>
                    
                </style>
            `
        },
        getLiveMatchData: function() { return this.$store.getters.getLiveMatchData }
    },
    mounted() {
        $('head').append(this.css);
    },
    methods: {
        
    }
});

export default teamDisplay;