const { app, BrowserWindow } = require('electron');
const ipcMain = require('electron').ipcMain;
const logger = require("electron-log");

class wrapper {
    constructor() {
        //Basic handling of browser window functionality
        //Quitting the application
        ipcMain.on("quit", (event, data) => { app.quit(); });
        //Closing the focused window
        ipcMain.on("closeFocusedWindow", (event, data) => { BrowserWindow.getFocusedWindow().close(); });
        //Closing all windows
        ipcMain.on("closeAllWindows", (event, data) => { BrowserWindow.getAllWindows().close(); });
        //Closing specific window
        ipcMain.on("closeWindow", (event, data) => { this.getSpecifiedWindow(data.name).close(); });
        //Show specific window
        ipcMain.on("showWindow", (event, data) => { this.getSpecifiedWindow(data.name).show(); });
        //Show all windows
        ipcMain.on("showAll", (event, data) => { BrowserWindow.getAllWindows().show(); });
        //Minimize focused window
        ipcMain.on("minimize", (event, data) => { BrowserWindow.getFocusedWindow().minimize(); });
        //Minimize all windows
        ipcMain.on("minimizeAll", (event, data) => { BrowserWindow.getAllWindows().minimize(); });
        //Maximize focused window
        ipcMain.on("maximize", (event, data) => { BrowserWindow.getFocusedWindow().maximize(); });
        //Maximize all windows
        ipcMain.on("maximizeAll", (event, data) => { BrowserWindow.getAllWindows().maximize(); });

        //Authenticate user
        ipcMain.on("authenticate", (event, data) => { 
            this.authenticate(data); 
            this.showMainScreen();
        });

        //Get live match details
        ipcMain.on("showLiveMatch", (event, data) => {
            this.paladins.getLiveMatchData(data.id, (res) => {
                event.sender.send("showLiveMatchData", res);
            });
        }); 

        //Get match history
        ipcMain.on("showMatchHistory", (event, data) => {
            this.paladins.getMatchHistory(data.id, (res) => {
                event.sender.send("showMatchHistoryData", res);
            });
        });

        //Get players
        ipcMain.on("searchUser", (event, data) => {
            this.paladins.getPlayers(data.user, (res) => {
                event.sender.send("showUsers", res);
            });
        }); 

        //Add player to favorites list
        ipcMain.on("updateFavorite", (event, data) => {
            if(data.value) {
                this.addFavorite(event, data.user);
            } else {
                this.removeFavorite(event, data.user.id);
            }
        });

        //Get favorites list
        ipcMain.on("getFavorites", (event, data) => {
            this.getFavorites(event);
        });

        
		logger.info('[IpcWrapper.js] Initialized');
    }
    getSpecifiedWindow(name) { return BrowserWindow.getAllWindows().forEach((window) => { if(window.name === name) return window; }); }
    showSetup() { BrowserWindow.getFocusedWindow().webContents.send("showSetup"); }
}


module.exports = new wrapper();