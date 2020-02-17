
document.querySelector("#QRCode-generate-button").addEventListener('click', () => {
    var qrcodeTarget = document.querySelector("#url-input").value;
    ipcRenderer.send("QRCodeCh",qrcodeTarget);
});

ipcRenderer.on("QRCodeCh", (event,arg) => {
    var qrImg = document.querySelector("#qr-img");
    qrImg.setAttribute("src",arg);
    qrImg.removeAttribute("style");
});