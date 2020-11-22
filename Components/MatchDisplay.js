import eventBus from '../Libraries/EventBus.js';
import TeamDisplay from './TeamDisplay.js';

const matchDisplay = Vue.component('match-display', {
    name: 'match-display',
    components: {
        TeamDisplay
    },
    template: `
        <div class="matchDisplay">
            <div class="match-title">{{getLiveMatchData.map}} ({{queue[getLiveMatchData.queue]}}, {{getLiveMatchData.region}})</div>
            <team-display :team="1"></team-display>
            <team-display :team="2"></team-display>
        </div>
    `,
    data() {
        return {
            queue: {
                424: 'Casual',
                428: 'Ranked',
                452: 'Onslaught',
                469: 'Team deathmatch'
            }
        }
    },
    computed: {
        css: function() {
            return `
                <style>
                    .matchDisplay {
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        grid-template-rows: max-content 1fr;
                        grid-template-areas: 'title title';
                        font-family: Consolas;
                    }
                    .teamDisplay {
                        height: calc(100% - 60px);
                    }
                    .match-title {
                        text-align: center;
                        height: max-content;
                        color: #ccc;
                        width: 100%;
                        grid-area: title;
                        padding: 20px;
                        padding-bottom: 0px;
                        font-size: 1.2em;
                    }
                    .teamDisplay {
                        display: grid;
                        grid-template-rows: max-content repeat(5, 150px);
                        grid-row-gap: 15px;
                        padding: 30px;
                    }
                    .teamStats {
                        font-family: Consolas;
                        color: #ccc;
                        display: grid;
                        grid-template-columns: max-content 1fr;
                        grid-template-rows: max-content;
                        grid-column-gap: 25px;
                        border-radius: 5px;
                        background: #181818;
                        padding: 25px;
                    }
                    .averageRank {
                        width: 75px;
                        height: 75px;
                        background-size: cover !important;
                        background-repeat: no-repeat !important;
                    }
                    .teamStatContainer {
                        height: 75px;
                        display: grid;
                        grid-template-rows: repeat(3, 25px);
                    }
                    .averageLevel, .averageWinPer, .averageWinChance {
                        height: 25px;
                        font-size: 0.9em;
                        color: #aaa;
                        display: grid;
                        grid-template-columns: minmax(130px, 150px) 1fr;
                        grid-column-gap: 5px;
                        text-align: right;
                    }
                    .averageLevel p, .averageWinPer p, .averageWinChance p {
                        margin: 0;
                        padding-left: 5px;
                        text-align: left;
                        color: #ccc;
                    }
                    .playerContainer {
                        color: #fff;
                        border-radius: 5px;
                        padding: 10px;
                        display: grid;
                        grid-template-columns: 120px max-content 1fr;
                        max-height: 150px;
                        background: rgb(24,24,24);
                        background: linear-gradient(180deg, rgba(24,24,24,1) 0%, rgba(24,24,24,1) 50%, rgba(37,37,37,1) 50%, rgba(37,37,37,1) 100%);
                        grid-column-gap: 10px;
                    }
                    .playerImage {
                        background-size: cover !important;
                        background-repeat: no-repeat !important;
                        height: 130px;
                        border-radius: 5px;
                    }
                    .playerBasics {
                        padding-right: 15px;
                        display: grid;
                        grid-template-rows: min-content min-content 1fr min-content;
                    }
                    .playerName {
                        width: 100%;
                        height: 100% !important;
                        background: rgba(0,0,0,0.2);
                        text-align: center;
                        color: #fff;
                        font-family: Consolas;
                        text-overflow: ellipsis;
                        word-break: break-all;
                    }
                    .playerChampion {
                        color: #ccc;
                        padding-top: 0px;
                        font-size: 0.9em;
                    }
                    .playerLevel {
                        color: #ccc;
                        font-size: 0.9em;
                    }
                    .playerRankContainer {
                        width: min-content;
                    }
                    .playerRank {
                        width: 50px;
                        height: 50px;
                        background-size: cover !important;
                        background-repeat: no-repeat !important;
                    }
                    .playerTP {
                        text-align: center;
                        font-size: 0.9em;
                        color: #ccc;
                        font-family: Consolas;
                    }
                    .playerInfo {
                        display: grid;
                        grid-template-rows: min-content min-content;
                        max-height: 130px;
                    }
                    .playerInfoStats, .championInfoStats {
                        display: grid;
                        grid-template-rows: min-content min-content;
                    }
                    .championInfoStats {
                        padding-top: 10px;
                    }
                    .infoStats {
                        display: grid;
                        grid-template-columns: min-content 1fr;
                        grid-column-gap: 10px;
                        height: min-content;
                        font-size: 0.9em;
                    }
                    .statsContainer {
                        display: grid;
                        grid-template-columns: max-content 1fr;
                    }
                    .statLegend {
                        color: #999;
                        display: grid;
                        grid-template-rows: min-content min-content;
                    }
                    .playerStats {
                        display: grid;
                        grid-template-rows: 1fr 1fr;
                        padding-right: 25px;
                        color: #ccc;
                    }
                    .verticalDivider {
                        background: #999;
                        width: 1px;
                    }
                    .championStats {
                        padding-right: 25px;
                    }
                    .rankedStats {
                        display: grid;
                        grid-template-columns: 1fr 1px 1fr;
                        grid-column-gap: 10px;
                    }
                    .globalStats {
                        display: grid;
                        grid-template-columns: 1fr 1px 1fr;
                        grid-column-gap: 10px;
                    }
                    .championRankedStats, .championGlobalStats {
                        display: grid;
                        grid-template-columns: 1fr 1px 1fr;
                        grid-column-gap: 10px;
                    }
                    .championWL {
                        display: grid;
                        grid-template-columns: 1fr 1fr 1fr;
                        grid-column-gap: 10px;
                    }
                    .stat3 {
                        display: grid;
                        grid-template-columns: 1fr 1fr 1fr;
                        grid-column-gap: 10px;
                    }
                    .stat2 { 
                        display: grid;
                        grid-template-columns: 1fr 1fr;
                        grid-column-gap: 10px;
                    }
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

export default matchDisplay;