// electron/preload.js
// Bridge seguro renderer ↔ main. NO expone Node ni la API key.

const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("opAPI", {
  getBackendPort: () => ipcRenderer.invoke("backend:get-port"),

  // Window controls
  minimize: () => ipcRenderer.invoke("window:minimize"),
  maximize: () => ipcRenderer.invoke("window:maximize"),
  close:    () => ipcRenderer.invoke("window:close"),
});
