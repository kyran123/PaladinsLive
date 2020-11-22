import eventBus from '../Libraries/EventBus.js';

const userDisplay = Vue.component('player-display', {
    name: 'player-display',
    template: `
        <div class="userDisplay">
            
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
                    
                </style>
            `
        },
        getSearchedUsers: function() { return this.$store.getters.getSearchedUsers },
        getFavorites: function() { return this.$store.getters.getFavorites }
    },
    mounted() {
        $('head').append(this.css);
    },
    methods: {
        
    }
});

export default userDisplay;