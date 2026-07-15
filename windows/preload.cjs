const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("timegazeNative", {
  platform: process.platform,
  updatePresentation(payload) {
    ipcRenderer.send("window-mode", payload);
  },
  onRestore(callback) {
    if (typeof callback !== "function") return;
    ipcRenderer.on("restore-from-tray", () => callback());
  },
});
