
document.querySelector("#test-button").addEventListener('click', () => {
    ipcRenderer.send("message-test","https://species.nibr.go.kr/digital/mobile/viewSpecies.do?ktsn=120000042647");
});

ipcRenderer.on("message-test", (event,arg) => {
    var qrImg = document.querySelector("#qr-img");
    qrImg.setAttribute("src",arg);
    qrImg.removeAttribute("style");
});