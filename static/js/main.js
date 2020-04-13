
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
    if(qrcodeTarget){
        ipcRenderer.send("QRCodeSaveCh", qrcodeTarget);
    }
});


/*---------- QR 이미지 출력 ----------*/
ipcRenderer.on("QRCodeCh", (event, arg) => {
    var qrImg = document.querySelector("#qr-img");
    qrImg.setAttribute("src", arg);
    qrImg.removeAttribute("style");
});


/*---------- 단일생성 클릭 ----------*/
document.querySelector("#single-generate-button").addEventListener('click', () => {
    logger.info("Single generate btn clicked");
    document.querySelector("#batch-generate").style.display = 'none';
    document.querySelector("#single-generate").style.display = 'block';
});
/*---------- 일괄생성 클릭 ----------*/
document.querySelector("#batch-generate-button").addEventListener('click', () => {
    logger.log("Batch generate btn clicked");
    document.querySelector("#single-generate").style.display = 'none';
    document.querySelector("#batch-generate").style.display = 'block';
});

function qrInfoInputReset(){
    document.querySelector("#thisQrText").value = null;
    document.querySelector("#thisQrFileNm").value = null;
}