import eventBus from '../Libraries/EventBus.js';
import MatchDisplay from './MatchDisplay.js';
import historyDisplay from './historyDisplay.js';

const contentDisplay = Vue.component('content-display', {
    name: 'content-display',
    components: {
        MatchDisplay,
        historyDisplay
    },
    template: `
        <div class="content">
            <match-display v-if="getContentState === 'match'"></match-display>
            <history-display v-if="getContentState === 'history'"></history-display>
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
                    .content {
                        overflow-y: scroll;
                        height: 100vh;
                    }
                </style>
            `
        },
        getContentState: function() { return this.$store.getters.getContentState }
    },
    mounted() {
        $('head').append(this.css);
    },
    methods: {
        
    }
});

export default contentDisplay;