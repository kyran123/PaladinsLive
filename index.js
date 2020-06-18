//Require the electron important things
const { app, BrowserWindow, globalShortcut, remote, electron } = require('electron');
const ipcMain = require('electron').ipcMain;
let screen;


//Libraries
let path;
let url;
let axios;
let dotenv;

//Controllers
let ipcWrapper;
let userSettings;
let paladinsAPI;

//Other variables
let user;

// Keep a global reference of the window objects, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let loadingWindow;
let mainWindow;

//Loading window 
function loadProgram() {
	//Require path to get the preload file, which requires a absolute path
	path = require('path');
	//Calculate size of width and height
	screen = require('electron').screen.getPrimaryDisplay();
	//This window is shown as the program does some work to setup and load
	//libraries, pictures and tries to connect to DB and google api
	loadingWindow = new BrowserWindow({
		width: (screen.bounds.width / 3),
		height: (screen.bounds.height / 3),
		frame: false,
		fullscreenable: false,
		resizable: false,
		show: true,
		backgroundColor: '#1a1a1d',
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, '/Libraries/preload.js')
		}
	});
	loadingWindow.loadFile("Views/Load.html");
	loadingWindow.on('closed', () => { loadingWindow = null; });
	//When program is ready and loaded
	loadingWindow.webContents.once('dom-ready', () => {
		//Call the load program requirements
		loadProgramRequirements();
		//If is in development
		if(process.env.PRODUCTION) {
			//Show dev tools
			loadingWindow.webContents.openDevTools({ mode: "detach" });
		}
		setTimeout(() => {
			//Check if user has stored his api key		
			if(!userSettings.isAuthenticated()) {
				//Show setup for api
				ipcWrapper.showSetup();
			} else {
				//continue starting program
				userSettings.getSetting("auth", (res) => {
					if(res.result) paladinsAPI.user = res.setting;
					showMainScreen();
				});
			}
		}, 2000);
		
	});
}

//Require all the libraries here.
//Do it here because the browser window for the loading screen has been shown to the user now
//So the whole program loading part seems seemless instead of it taking a while to actually launch
function loadProgramRequirements() {
	//Setup IPC communication class
	ipcWrapper = require('./Controllers/IpcWrapper.js');
	//Start actually loading libraries and what not
	//Require all libraries here
	url = require('url');
	axios = require('axios');
	dotenv = require('dotenv').config();


	//Setup all controllers here
	userSettings = require('./Controllers/UserSettings.js');
	userSettings.initialize();

	paladinsAPI = require('./Controllers/PaladinsAPI.js');

	//Setup functions needed withint the ipc wrapper
	ipcWrapper.authenticate = function(data) {
		userSettings.authenticate(data);
		user = data;
		paladinsAPI.user = user;
	}
	ipcWrapper.getAuthentication = function() {
		return userSettings.get('auth', (res) => {
			if(!res.result) return res;
			return {
				devId: res.setting.devId,
				authKey: res.setting.authKey
			}
		});
	}
	ipcWrapper.showMainScreen = function() {
		showMainScreen();
	};
	ipcWrapper.addFavorite = function(event, user) {
		userSettings.addUser(user);
		userSettings.getUsers((res) => {
			event.sender.send("showFavorites", res);
		});
	}
	ipcWrapper.getFavorites = function(event) {
		userSettings.getUsers((res) => {
			event.sender.send("showFavorites", res);
		});
	}
	ipcWrapper.removeFavorite = function(event, id) {
		userSettings.removeUser(id);
		ipcWrapper.getFavorites(event);
	} 
	ipcWrapper.paladins = paladinsAPI;
}

function showMainScreen() {
	//Create new window for the main screen
	mainWindow = new BrowserWindow({
		width: (screen.bounds.width / 1.2),
		height: (screen.bounds.height / 1.2),
		minWidth: (screen.bounds.width / 5),
		minHeight: (screen.bounds.height / 5),
		frame: false,
		fullscreenable: true,
		resizable: true,
		show: false,
		backgroundColor: '#1a1a1d',
		webPreferences: {
			nodeIntegration: false,
			contextIsolation: true,
			enableRemoteModule: false,
			preload: path.join(__dirname, '/Libraries/preload.js')
		}
	});
	//Load html file for setup
	mainWindow.loadFile('Views/main.html');
	//If is in development
	if(process.env.PRODUCTION) {
		//Show dev tools
		mainWindow.webContents.openDevTools({ mode: "detach" });
	}
	//In case the user closes the program before finishing setup
	mainWindow.on('closed', () => {
		// Dereference the window object, usually you would store windows
		// in an array if your app supports multi windows, this is the time
		// when you should delete the corresponding element.
		mainWindow = null;
	});

	mainWindow.on('resize', () => {
		const appSize = mainWindow.getBounds();
		if(appSize.width < ((screen.bounds.width / 3) + 5)) {
			//is vertical layout (e.g. phones)
			mainWindow.webContents.send("vertical");
		}
		else if(appSize.width < ((screen.bounds.width / 2) + 5)) {
			//Only vertical layout of match container
			mainWindow.webContents.send("compact");
		}
		else {
			//normal layout
			mainWindow.webContents.send("normal");
		}
	});

	//When the DOM has loaded
	mainWindow.webContents.once('dom-ready', () => {
		mainWindow.show();
		if(loadingWindow) loadingWindow.close();
	});
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', loadProgram)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
	// On macOS it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (win === null) {
		loadProgram()
	}
});