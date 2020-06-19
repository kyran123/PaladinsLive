const {
    contextBridge,
    ipcRenderer
} = require("electron");

const validChannels = [
    "quit",
    "closeFocusedWindow",
    "closeAllWindows",
    "closeWindow",
    "showWindow",
    "showAll",
    "minimize",
    "minimizeAll",
    "maximize",
    "maximizeAll",
    "showSetup",
    "showLiveMatch",
    "authenticate",
    "showLiveMatchData",
    "showMatchHistory",
    "showMatchHistoryData",
    "searchUser",
    "showUsers",
    "addToFavorites",
    "getFavorites",
    "showFavorites",
    "removeFromFavorites",
    "vertical",
    "normal",
    "compact"
];
window.onload = () => {
    // Expose protected methods that allow the renderer process to use
    // the ipcRenderer without exposing the entire object
    contextBridge.exposeInMainWorld("API", {
            //IPC renderer functionality
            receive: (channel, func) => { 
                if(validChannels.includes(channel)) {
                    ipcRenderer.on(channel, (event, ...args) => func(...args));
                }
            },
            send: (channel, data) => {
                if(validChannels.includes(channel)) {
                    ipcRenderer.send(channel, data);
                }
            }
        }
    );
}
