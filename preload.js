window.ipcRenderer = require('electron').ipcRenderer;
const logger = require('electron-log');
window.logger = logger;
logger.log("Preloaded!");