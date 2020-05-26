var jsonData = {};
var filePath = "";

/*---------- QRCode 단일 생성 ----------*/
document.querySelector("#QRCode-generate-button").addEventListener('click', () => {
    var qrcodeTarget = document.querySelector("#url-input").value;
    if(qrcodeTarget){
        qrInfoInputReset();
        ipcRenderer.send("QRCodeCh", qrcodeTarget);
        document.querySelector('#thisQrText').value = qrcodeTarget;
    }
});

/*---------- 현재 QRCode 이미지파일로 저장 ----------*/
document.querySelector('#qr-image-save').addEventListener('click', () =>{
    var qrcodeTarget = document.querySelector("#thisQrText").value;
    var qrcodeFileNm = document.querySelector("#thisQrFileNm").value;

    if(qrcodeTarget){
        ipcRenderer.send("QRCodeSaveCh", qrcodeTarget, qrcodeFileNm);
    }
});


/*---------- QR 이미지 출력 ----------*/
ipcRenderer.on("QRCodeCh", (event, arg) => {
    var qrImg = document.querySelector("#qr-img");
    var qrcodeTarget = document.querySelector("#url-input").value;
    qrImg.setAttribute("src", arg);
    qrImg.setAttribute("alt", qrcodeTarget);
    qrImg.removeAttribute("style");
});


/*---------- 단일생성 클릭 ----------*/
document.querySelector("#single-generate-button").addEventListener('click', () => {
    logger.info("Single generate btn clicked");
    document.querySelector("#batch-generate").style.display = 'none';
    document.querySelector("#qr-batch-save").style.display = 'none';
    document.querySelector("#single-generate").style.display = 'block';
});
/*---------- 일괄생성 클릭 ----------*/
document.querySelector("#batch-generate-button").addEventListener('click', () => {
    logger.log("Batch generate btn clicked");
    document.querySelector("#single-generate").style.display = 'none';
    document.querySelector("#qr-batch-save").style.display = 'inline-block';
    document.querySelector("#batch-generate").style.display = 'block';
});

document.querySelector("#excel-select-button").addEventListener('click', () => {
    logger.log("Excel select button clicked");
    var result = ipcRenderer.sendSync("ExcelFileSelectAndReadCh");
    logger.log("Excel load result : ", result);
    if(result != "FileNotSelect"){
        jsonData = result.jsonData;
        filePath = result.filePath;
        
        logger.log("jsonData : ", jsonData);
        logger.log("filePath : ", filePath);

        $("#qr-target-list-table > tbody").html("");
        for(const row of jsonData){
            var rowKeys = Object.keys(row);
            $("#qr-target-list-table > tbody").append("<tr><td>"+row[rowKeys[0]]+"</td><td>"+row[rowKeys[1]]+"</td></tr>");
        }
        $("#qr-target-list-table").show();

        /* qr list item click event handle */
        $("#table-tbody > tr").click(qrcodeListItemClickHendler);
    }
});



document.querySelector("#qr-batch-save").addEventListener('click', () => {
    if(filePath){
        ipcRenderer.send('QRCodeBatchSaveCh', jsonData);
    }
});



function qrcodeListItemClickHendler(){
    var td = $(this).children("td");
    if(td.length == 2){
        logger.log("Clicked QRCode target Text : ", td[0].innerText);
        logger.log("Clicked QRCode save file name : ", td[1].innerText);
        var qrTargetText = td[0].innerText;
        var qrSaveFileNm = td[1].innerText;
        if(qrTargetText){
            qrInfoInputReset();
            ipcRenderer.send("QRCodeCh", qrTargetText);
            $("#thisQrText").val(qrTargetText);
            $("#thisQrFileNm").val(qrSaveFileNm);
        }
    }
}


function qrInfoInputReset(){
    document.querySelector("#thisQrText").value = null;
    document.querySelector("#thisQrFileNm").value = null;
}