import eventBus from '../Libraries/EventBus.js';
import MatchDisplay from './historyMatch.js';

const historyDisplay = Vue.component('history-display', {
    name: 'history-display',
    components: {
        MatchDisplay
    },
    template: `
        <div class="history">
            <history-match v-for="(match, index) in getHistory" :key="match.id" ref="historyMatch" :match="match" :players="getPlayers[index]"></history-match>
        </div>
    `,
    data() {
        return {
            
        }
    },
    computed: {
        css: function() {
            return `
                <style>
                    .history {
                        padding: 30px;
                        display: grid;
                        grid-template-rows: repeat(10, max-content);
                        grid-row-gap: 25px;
                        overflow-y: scroll;
                    }
                    .historyMatch {
                        display: grid;
                        grid-template-rows: max-content max-content;
                        grid-row-gap: 10px;
                        font-family: Consolas;
                        border-radius: 10px;
                        background: #222;
                    }
                    .match-top-info {
                        display: grid;
                        grid-template-columns: 100px 1fr max-content;
                    }
                    .historyMatch:hover {
                        cursor: pointer;
                        background: #252525;
                    }
                    .match-won {
                        color: #4FAF57;
                        margin: auto;
                        padding: 20px;
                    }
                    .match-lost {
                        color: #B22F2F;
                        margin: auto;
                        padding: 20px;
                    }
                    .match-title {
                        margin-top: auto;
                        margin-bottom: auto;
                    }
                    .match-id {
                        font-size: 0.9em;
                        color: #999;
                        margin: auto;
                        padding: 20px;
                    }
                    .match-map {
                        font-size: 1.2em;
                        color: #fff;
                    }
                    .match-info {
                        font-size: 0.9em;
                        color: #999;
                    }
                    .match-player-details-collapsed {
                        display: grid;
                        grid-template-columns: 55px 1fr 1fr;
                        grid-column-gap: 25px;
                    }
                    .match-player-details {
                        display: grid;
                        grid-template-rows: max-content 1fr max-content;
                        grid-column-gap: 15px;
                    }
                    .team1collapsed {
                        color: #ccc;
                        font-size: 0.9em;
                        padding-left: 20px;
                        padding-bottom: 20px;
                    }
                    .team2collapsed {
                        color: #ccc;
                        font-size: 0.9em;
                        padding-right: 20px;
                        padding-bottom: 20px;
                    }
                    .team1collapsed .championName {
                        color: #999 !important;
                    } 
                    .team2collapsed .championName {
                        color: #999 !important;
                        text-align: right;
                    }
                    .player-left {
                        display: grid;
                        grid-template-columns: max-content 1fr;
                        grid-column-gap: 10px;
                    }
                    .player-right {
                        display: grid;
                        grid-template-columns: 1fr max-content;
                        grid-column-gap: 10px;
                    }
                    .highlightPlayer {
                        color: #3082C5;
                    }
                    .player-left-expanded {
                        display: grid;
                        grid-template-rows: max-content max-content;
                        grid-row-gap: 5px;
                        font-size: 1.1em;
                    }
                    .player-right-expanded {
                        font-size: 1.1em;
                        grid-row-gap: 5px;
                    }
                    .player-history-details-top {
                        display: grid;
                        grid-template-columns: max-content 1fr;
                        grid-column-gap: 10px;
                        color: #fff;
                    }
                    .player-left-expanded .championName {
                        color: #ccc !important;
                    }
                    .player-right-expanded .championName {
                        color: #ccc !important;
                        text-align: right;
                    }
                    .player-history-details-bottom {
                        display: grid;
                        grid-template-rows: repeat(6, max-content);
                        grid-column-gap: 10px;
                        color: #ccc;
                        font-size: 0.9em;
                    }
                    .historyKDA, .matchPlayerReceived, .matchPlayerShielding, .matchPlayerHealing, .matchPlayerSelfHeal {
                        display: grid;
                        grid-template-columns: max-content 1fr;
                        grid-column-gap: 10px;
                    }
                    .team1, .team2 {
                        display: grid;
                        grid-template-columns: repeat(5, minmax(200px, 300px));
                        grid-column-gap: 25px;
                        padding: 20px;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .textRight {
                        text-align: right;
                    }
                    .statText {
                        color: #999;
                    }
                    .verticalDivider {
                        background: #999;
                        margin-bottom: 20px;
                        width: 1px;
                        margin-left: auto;
                        margin-right: auto;
                    }
                    .horizontalDivider {
                        background: #999;
                        height: 1px;
                        margin-left: 20px;
                        margin-right: 20px;
                    }
                </style>
            `
        },
        getHistory: function() { return this.$store.getters.getAllMatches },
        getPlayers: function() { return this.$store.getters.getPlayers }
    },
    mounted() {
        $('head').append(this.css);
        eventBus.$on("collapseOtherProgressResults", () => {
            const historyMatches = this.$refs.historyMatch;
            historyMatches.forEach((match) => {
                match.setCollapse(true);
            });
        });
    },
    methods: {
        
    }
});

export default historyDisplay;