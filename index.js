const{app, BrowserWindow, ipcMain, dialog} = require('electron');
const qrcode = require('qrcode');
const path = require("path");
const fs = require("fs");

let mainWindow;

function createWindow(){
    mainWindow = new BrowserWindow({
        title: 'QRCode Generator',
        width: 660,
        height: 370,
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

    ipcMainEventHandler(mainWindow);

}

app.on('ready', () =>{
    createWindow();
});

app.allowRendererProcessReuse = true;



function ipcMainEventHandler(mainWindow){
    var qrGenerateOption = {
        errorCorrectionLevel:'L',
        type: 'image/png',
        scale: 19,
        margin: 5
    }

    var qrSaveDialogOption = {
        title: "Save Qr Image",
        filters: [{name: "이미지 형식", extensions: ['png']}]
    }

    var qrSaveSuccessDialogOption = {
        type: "info",
        message: "파일저장에 성공하였습니다."
    }


    ipcMain.on('QRCodeCh',(event, arg) => {
        console.log("Target Text : " + arg);
        qrcode.toDataURL(arg, qrGenerateOption, function(err, arg){
            event.sender.send("QRCodeCh", arg);
        });
    });

    ipcMain.on('QRCodeSaveCh', (event, arg) => {
        console.log("" + arg);
        var path = dialog.showSaveDialogSync(mainWindow, qrSaveDialogOption);
        console.log(path);
        qrcode.toFile(path, arg, qrGenerateOption, function(err){
            if(err) throw err;
            var dialogStatus = dialog.showMessageBoxSync(mainWindow, qrSaveSuccessDialogOption);
            console.log(dialogStatus);
        })
    });

}