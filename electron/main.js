// electron/main.js
// Proceso principal de Electron.
// Levanta el backend Express embebido y abre la ventana del frontend.

const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const isDev = process.env.NODE_ENV === "development";

// El backend se carga en este mismo proceso para mantener todo embebido
// y para que la OPENAI_API_KEY nunca sea visible al renderer.
const { startServer } = require("../backend/server");

let mainWindow = null;
let backendInstance = null;

async function createWindow() {
  // 1) Arranca backend en puerto libre
  backendInstance = await startServer();
  const backendPort = backendInstance.port;

  // 2) Ventana principal estilo app creativa (frameless con drag region en CSS)
  mainWindow = new BrowserWindow({
    width: 1240,
    height: 820,
    minWidth: 1024,
    minHeight: 720,
    backgroundColor: "#080808",        // level_1
    frame: false,
    titleBarStyle: "hidden",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  // 3) IPC: el renderer puede preguntar el puerto del backend
  ipcMain.handle("backend:get-port", () => backendPort);

  // 4) Window controls (close / minimize / maximize) — para frameless window
  ipcMain.handle("window:minimize", () => mainWindow?.minimize());
  ipcMain.handle("window:maximize", () => {
    if (!mainWindow) return;
    mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize();
  });
  ipcMain.handle("window:close", () => mainWindow?.close());

  // 5) Carga frontend
  if (isDev) {
    await mainWindow.loadURL("http://localhost:5173");
    mainWindow.webContents.openDevTools({ mode: "detach" });
  } else {
    await mainWindow.loadFile(path.join(__dirname, "..", "frontend", "dist", "index.html"));
  }

  mainWindow.once("ready-to-show", () => mainWindow.show());
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (backendInstance) backendInstance.close();
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
