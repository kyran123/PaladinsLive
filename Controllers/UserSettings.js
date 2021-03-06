const settings = require('electron-store');

class userSettings {
    //Initialize
    initialize() {
        this.settings = new settings();
    }
    //Authenticate this application
    authenticate(value) {
        this.settings.set('auth', value);
    }
    //See if application is already authenticated
    isAuthenticated() {
        if(this.settings.has('auth.devId')) {
            return true;
        }
        return false;
    }
    //Add an user to the list of favorite users
    addUser(user) {
        this.settings.set(`user.${user.id}`, user.name);
    }
    //remove an user from the favorites list
    removeUser(id) {
        this.settings.delete(`user.${id}`);
    }
    //Get favorited users
    getUsers(callback) {
        if(this.settings.has('user')) {
            callback({
                result: true,
                users: this.settings.get('user')
            });
        } else {
            callback({
                result: false,
                msg: 'Setting \'user\' not found'
            });
        }
    }
    //Check if setting exists
    //[PARAM 1] A string of setting name
    hasSetting(setting, callback) {
        if(this.settings.has(setting)) {
            callback(true);
        }
        callback(false)
    }
    //Get a specified setting
    //[PARAM 1] A string of the setting name
    //[PARAM 2] Callback function
    async getSetting(setting, callback) {
        if(this.settings.has(setting)) {
            callback({
                result: true,
                setting: this.settings.get(setting)
            });
        } else {
            callback({
                result: false,
                msg: 'Setting: ' + setting + ' not found.'
            });
        }
        
    }
    //Set a NEW specified setting
    //[PARAM 1] A string of the setting name
    //[PARAM 2] A string of the setting value (It can be json or whatever, but stringify it first!)
    setSetting(location, value, callback) {
        settings.set(location, value);
    }
}

module.exports = new userSettings();