import eventBus from '../Libraries/EventBus.js';

const mainMenu = Vue.component('main-menu', {
    name: 'main-menu',
    template: `
        <div class="mainMenu">
            <div class="menuSearchContainer">
                <input type="text" v-model="searchValue"  class="menuSearch" placeholder="Search player" @keyup.enter="submit" />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" @click="submit">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>
            <div class="searchResults">
                <div v-for="user in getSearchedUsers" :key="user.player_id" class="searchResult">
                    <div class="searchName">{{user.playerName}}</div>
                    <div class="showCurrentMatch noselect" @click="showLiveMatch(user.player_id)">Live</div>
                    <div class="showHistory noselect" @click="showHistory(user.player_id)">History</div>
                    <div v-show="!user.isFavorite" class="favoriteToggle noselect addToFavorites" @click="updateFavorite(user, !user.isFavorite)">
                        <span class="material-icons">star_outline</span>
                    </div>
                    <div v-show="user.isFavorite" class="favoriteToggle noselect addToFavorites" @click="updateFavorite(user, !user.isFavorite)">
                        <span class="material-icons" @click="updateFavorite(user, !user.isFavorite)">star</span>
                    </div>
                </div>
            </div>
            <div></div>
            <div class="divider"></div>
            <div class="favoritesList">
                <div v-for="userId in Object.keys(getFavorites)" :key="userId" class="searchResult">
                    <div class="searchName">{{getFavorites[userId]}}</div>
                    <div class="showCurrentMatch noselect" @click="showLiveMatch(userId)">Live</div>
                    <div class="showHistory noselect" @click="showHistory(userId)">History</div>
                    <div class="favoriteToggle noselect addToFavorites" @click="removeFavorite(userId)">
                        <span class="material-icons" @click="updateFavorite(user, !user.isFavorite)">star</span>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            searchValue: ''
        }
    },
    computed: {
        css: function() {
            return `
                <style>
                    .mainMenu {
                        height: calc(100vh - 20px);
                        min-width: 350px;
                        max-width: 450px;
                        background: #252525;
                        display: grid;
                        grid-template-rows: max-content max-content 1fr 2px max-content;
                        grid-row-gap: 5px;
                        padding: 5px;
                        padding-top: 10px;
                        font-family: Consolas;
                    }
                    .menuSearchContainer {
                        background: #1E1E1E; 
                        border-radius: 5px;   
                        margin: 15px;                 
                    }
                    .menuSearchContainer svg {
                        margin: auto;
                        position: relative;
                        width: 20px;
                        height: 20px;
                        color: #ccc;
                        float: right;
                        padding: 10px;
                        padding-left: 5px;
                    }
                    .menuSearchContainer svg:hover {
                        color: #fff;
                        cursor: pointer;
                    }
                    .menuSearch {
                        width: calc(100% - 50px);
                        padding: 10px;
                        padding-left: 10px;
                        padding-right: 5px;
                        font-size: 1.05em;
                        background: transparent;
                        color: #ccc;
                        font-family: Consolas;
                        border: none;
                        text-overflow: ellipsis;
                    }
                    .menuSearch:focus {
                        outline: none;
                    }
                    .searchResults {
                        display: grid;
                        grid-template-rows: repeat(auto-fit, 30px);
                        grid-row-gap: 5px;
                        padding-top: 0px !important;
                        padding: 15px;
                    }
                    .favoritesList {
                        display: grid;
                        grid-template-rows: repeat(auto-fit, 30px);
                        grid-row-gap: 5px;
                        padding: 15px;
                        color: #fff;
                        max-height: 20vh;
                    }
                    .searchResult {
                        display: grid;
                        grid-template-columns: 1fr min-content min-content min-content;
                        grid-gap: 5px;
                        color: #fff;
                        font-size: 15px;
                    }
                    .searchName {
                        line-height: 30px;
                    }
                    .showCurrentMatch {
                        padding-left: 10px;
                        padding-right: 10px;
                        color: #FFF;
                        font-weight: 500;
                        border-radius: 5px;
                        line-height: 30px;
                    }
                    .showCurrentMatch:hover {
                        cursor: pointer;
                        background: rgba(162,221,235);
                        color: #000;
                    }
                    .showHistory {
                        padding-left: 10px;
                        padding-right: 10px;
                        color: #bbb;
                        line-height: 30px;
                        border-radius: 5px; 
                    }
                    .showHistory:hover {
                        cursor: pointer;
                        color: #fff;
                        background: #303030;
                    }
                    .favoriteToggle {
                        padding-left: 10px;
                        padding-right: 10px;
                        color: #bbb;
                        display: grid;
                        border-radius: 5px; 
                    }
                    .favoriteToggle span {
                        font-size: 1.2em;
                        text-align: center;
                        vertical-align: bottom;
                        margin-top: auto;
                        margin-bottom: auto;                       
                    }
                    .favoriteToggle:hover {
                        cursor: pointer;
                        color: #fff;
                        background: #303030;
                    }
                    .divider {
                        margin-left: 5px;
                        margin-right: 5px;
                        height: 2px;
                        background: #181818;
                        border-radius: 2px;
                    }
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
        submit() {
            window.API.send("searchUser", { user: this.searchValue });
            this.searchValue = '';
        },
        updateFavorite(user, value) {
            user.isFavorite = !user.isFavorite;
            window.API.send("updateFavorite", {
                user: {
                    id: user.player_id,
                    name: user.hz_player_name,
                },
                value: value
            });
        },
        removeFavorite(userId) {
            this.getSearchedUsers.forEach((user) => {
                if(parseInt(user.player_id) == parseInt(userId)) {
                    user.isFavorite = false;
                }
            });
            window.API.send("updateFavorite", {
                user: {
                    id: userId
                },
                value: false
            });
        },
        showLiveMatch(userId) {
            window.API.send("showLiveMatch", { id: userId });
        },
        showHistory(userId) {
            window.API.send("showMatchHistory", { id: userId });
        }
    }
});

export default mainMenu;