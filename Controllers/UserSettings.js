const settings = require('electron-settings').default;

class userSettings {
    //Initialize for use
    initialize() {
        //Configure basic file settings
        settings.configure = {
            fileName: 'dev',
            numSpaces: 4
        };
    }
    //Authenticate this application
    authenticate(value) {
        settings.set('auth', value);
    }
    //See if application is already authenticated
    isAuthenticated() {
        if(settings.has('auth.devId')) {
            return true;
        }
        return false;
    }
    //Check if setting exists
    //[PARAM 1] A string of setting name
    hasSetting(setting, callback) {
        if(settings.has(setting)) {
            callback(true);
        }
        callback(false)
    }
    //Get a specified setting
    //[PARAM 1] A string of the setting name
    //[PARAM 2] Callback function
    getSetting(setting, callback) {
        if(settings.has(setting)) {
            callback({
                result: true,
                setting: settings.get(setting)
            })
        }
        callback({
            result: false,
            msg: 'Setting: ' + setting + ' not found.'
        });
    }
    //Set a NEW specified setting
    //[PARAM 1] A string of the setting name
    //[PARAM 2] A string of the setting value (It can be json or whatever, but stringify it first!)
    setSetting(location, value, callback) {
        settings.set(location, value);
    }
}

module.exports = new userSettings();