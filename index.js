const{app, BrowserWindow, ipcMain} = require('electron');
const qrcode = require('qrcode');
const path = require("path");
const fs = require("fs");
let mainWindow;

function createWindow(){
    mainWindow = new BrowserWindow({
        width: 650,
        height: 400,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, "preload.js")
        }
    });

    console.log(path.join(__dirname, "preload.js"));

    // mainWindow.loadURL(`file://${__dirname}/static/index.html`);
    mainWindow.loadFile(path.join(__dirname, "static/index.html"));
    mainWindow.on('closed', () =>{
        mainWindow = null;
    });
    mainWindow.openDevTools();
    mainWindow.removeMenu();

    ipcMainEventHandler();

}

app.on('ready', () =>{
    createWindow();
});

app.allowRendererProcessReuse = true;

function ipcMainEventHandler(){
    var qrOption = {
        errorCorrectionLevel:'L',
        type: 'image/png',
        scale: 19,
        margin: 5
    }

    ipcMain.on('message-test',(event, arg) => {
        console.log(arg);

        qrcode.toDataURL(arg, qrOption, function(err, arg){
            event.sender.send("message-test", arg);
        });

    });

}