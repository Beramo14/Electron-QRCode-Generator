const{app, BrowserWindow} = require('electron');

let mainWindow;

function createWindow(){
    mainWindow = new BrowserWindow({
        width: 300,
        height: 400
    });

    mainWindow.on('closed', () =>{
        mainWindow = null;
    });
}

app.on('ready', () =>{
    createWindow();
});