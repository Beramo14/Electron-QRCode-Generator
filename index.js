const{app, BrowserWindow, ipcMain, dialog} = require('electron');
const logger = require("electron-log");
const qrcode = require('qrcode');
const path = require("path");
const fs = require("fs");
const XLSX = require("xlsx");

let mainWindow;

function createWindow(){
    mainWindow = new BrowserWindow({
        title: 'QRCode Generator',
        width: 700,
        height: 400,
        resizable: false,
        webPreferences: {
            nodeIntegration: false,
            preload: path.join(__dirname, "preload.js")
        }
    });


    // mainWindow.loadURL(`file://${__dirname}/static/index.html`);
    mainWindow.loadFile(path.join(__dirname, "static/index.html"));
    mainWindow.on('closed', () =>{
        logger.info("--- Main Window is on closed ---");
        mainWindow = null;
    });
    mainWindow.openDevTools();
    mainWindow.removeMenu();

    ipcMainEventHandler(mainWindow);

}


app.allowRendererProcessReuse = true;
app.on('ready', () =>{
    logger.info("--- application is on ready ---");
    createWindow();
});
app.on('window-all-closed', () => {
    logger.info("--- application is on closed ---");
    app.quit()
});




function ipcMainEventHandler(mainWindow){
    var qrGenerateOption = {
        errorCorrectionLevel: 'L',
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

    var qrSaveErrorDialogOption = {
        type: "error",
        message: "파일저장에 실패하였습니다."
    }

    /*---------- 이미지 생성후 preview로 전달 ----------*/
    ipcMain.on('QRCodeCh',(event, arg) => {
        logger.log("Target Text : " + arg);
        qrcode.toDataURL(arg, qrGenerateOption, function(err, arg){
            event.sender.send("QRCodeCh", arg);
        });
    });

    /*---------- QR코드 이미지 저장 ----------*/
    ipcMain.on('QRCodeSaveCh', (event, qrTargetText, qrSaveFileNm) => {
        qrSaveFileNm = (qrSaveFileNm)? qrSaveFileNm + ".png" : qrTargetText + ".png";
        logger.log("Save QR Image : " + qrTargetText, qrSaveFileNm);

        qrSaveDialogOption.defaultPath = qrSaveFileNm;
        var path = dialog.showSaveDialogSync(mainWindow, qrSaveDialogOption);
        if(path != undefined){
            logger.log("Image save SUCCESS! : " + path);
            qrcode.toFile(path, qrTargetText, qrGenerateOption, function(err){
                if(err){
                    logger.error(err);
                    dialog.showMessageBoxSync(mainWindow, qrSaveErrorDialogOption);
                    throw err;
                } else {
                    var dialogStatus = dialog.showMessageBoxSync(mainWindow, qrSaveSuccessDialogOption);
                }
            });
        } else if(path == undefined){
            logger.log("Path not selected. (qrTargetText : " + qrTargetText + ",  qrSaveFileNm : " + qrSaveFileNm + ")");
        }
    });

    
    var excelFileSelectDialogOption = {
        filters: [{name: "엑셀 파일", extensions: ['xlsx', 'xlsm', 'xls']}]
    };

    /*---------- 일괄 Excel파일 선택 ----------*/
    ipcMain.on('ExcelFileSelectAndReadCh', (event) => {
        var path = dialog.showOpenDialogSync(mainWindow, excelFileSelectDialogOption);
        if(path != undefined){
            logger.log("Excel Path : " + path[0]);
            var resultMap = {};

            var workbook = XLSX.readFile(path[0]);
            var workSheet = workbook.Sheets[workbook.SheetNames[0]];
            var jsonData = XLSX.utils.sheet_to_json(workSheet);
            logger.log(jsonData);

            resultMap.jsonData = jsonData;
            resultMap.filePath = path[0];

            event.returnValue = resultMap;
        } else {
            event.returnValue = "FileNotSelect";
        }
    });



    ipcMain.on('QRCodeBatchSaveCh', (event, qrInfoList) => {
        logger.log(qrInfoList);
        const path = dialog.showOpenDialogSync(mainWindow, {
            properties: ['openDirectory']
        });
        if(path != null){
            logger.log("path : " + path);
            for(var row of qrInfoList){
                logger.log(row["URL 또는 텍스트"], row["저장 파일 명"]);
                var savePath = path[0] + row["저장 파일 명"] + ".png";
                qrcode.toFile(savePath, row["URL 또는 텍스트"], qrGenerateOption);
            }
        }
    });

}


