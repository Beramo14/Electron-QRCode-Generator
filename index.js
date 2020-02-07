const{app, BrowserWindow} = require('electron');

let mainWindow;

function createWindow(){
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        resizable: false
    });

    mainWindow.loadURL(`file://${__dirname}/static/index.html`);
    mainWindow.on('closed', () =>{
        mainWindow = null;
    });
    mainWindow.openDevTools();
    mainWindow.removeMenu();
}

app.on('ready', () =>{
    createWindow();
});