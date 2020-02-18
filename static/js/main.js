
document.querySelector("#QRCode-generate-button").addEventListener('click', () => {
    var qrcodeTarget = document.querySelector("#url-input").value;
    if(qrcodeTarget){
        ipcRenderer.send("QRCodeCh", qrcodeTarget);
        document.querySelector('#thisQrText').value = qrcodeTarget;
    }
});

ipcRenderer.on("QRCodeCh", (event, arg) => {
    var qrImg = document.querySelector("#qr-img");
    qrImg.setAttribute("src",arg);
    qrImg.removeAttribute("style");
});
