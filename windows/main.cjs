const { app, BrowserWindow, ipcMain, Menu, nativeImage, Tray } = require("electron");
const path = require("node:path");

const APP_NAME = "观时 · Timegaze";
const NORMAL_MINIMUM_SIZE = { width: 900, height: 680 };
const COMPACT_SIZE = { width: 340, height: 220 };

let mainWindow = null;
let tray = null;
let normalBounds = null;
let compactMode = false;
let allowQuit = false;
let presentation = {
  compact: false,
  alwaysOnTop: false,
  timerActive: false,
  displayMode: "floating",
  timeText: "",
  language: "zh-CN",
  appName: APP_NAME,
  statusTooltip: "观时 · Timegaze · 点击打开",
};

function iconPath() {
  return path.join(__dirname, "build", "icon.png");
}

function showMainWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  if (normalBounds) mainWindow.setBounds(normalBounds);
  mainWindow.setMinimumSize(NORMAL_MINIMUM_SIZE.width, NORMAL_MINIMUM_SIZE.height);
  mainWindow.setAlwaysOnTop(false);
  compactMode = false;
  mainWindow.show();
  mainWindow.focus();
  mainWindow.webContents.send("restore-from-tray");
}

function quitApplication() {
  allowQuit = true;
  app.quit();
}

function trayLabels() {
  const english = presentation.language === "en";
  return {
    show: english ? "Open Timegaze" : "打开观时",
    quit: english ? "Quit Timegaze" : "退出观时",
  };
}

function updateTray() {
  if (!presentation.timerActive || presentation.displayMode !== "menuBar") {
    if (tray) {
      tray.destroy();
      tray = null;
    }
    return;
  }

  if (!tray) {
    const image = nativeImage.createFromPath(iconPath()).resize({ width: 24, height: 24 });
    tray = new Tray(image);
    tray.on("click", showMainWindow);
    tray.on("double-click", showMainWindow);
  }

  const labels = trayLabels();
  const tooltip = `${presentation.statusTooltip} · ${presentation.timeText}`;
  tray.setToolTip(tooltip.slice(0, 127));
  tray.setContextMenu(Menu.buildFromTemplate([
    { label: presentation.timeText, enabled: false },
    { type: "separator" },
    { label: labels.show, click: showMainWindow },
    { label: labels.quit, click: quitApplication },
  ]));
}

function applyCompactWindow(alwaysOnTop) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.setAlwaysOnTop(Boolean(alwaysOnTop));
  if (compactMode) return;

  normalBounds = mainWindow.getBounds();
  const workArea = mainWindow.getBounds();
  mainWindow.setMinimumSize(320, 190);
  mainWindow.setBounds({
    x: workArea.x + workArea.width - COMPACT_SIZE.width,
    y: workArea.y,
    width: COMPACT_SIZE.width,
    height: COMPACT_SIZE.height,
  });
  compactMode = true;
}

function restoreNormalWindow() {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  mainWindow.setAlwaysOnTop(false);
  mainWindow.setMinimumSize(NORMAL_MINIMUM_SIZE.width, NORMAL_MINIMUM_SIZE.height);
  if (compactMode && normalBounds) mainWindow.setBounds(normalBounds);
  compactMode = false;
}

function applyPresentation(payload) {
  if (!mainWindow || mainWindow.isDestroyed()) return;
  presentation = payload;
  mainWindow.setTitle(payload.appName);
  updateTray();

  if (payload.timerActive && payload.displayMode === "menuBar") {
    restoreNormalWindow();
    if (payload.compact && mainWindow.isVisible()) mainWindow.hide();
    return;
  }

  if (payload.compact) applyCompactWindow(payload.alwaysOnTop);
  else restoreNormalWindow();

  if (!payload.timerActive && !mainWindow.isVisible()) {
    mainWindow.show();
    mainWindow.focus();
  }
}

function isPresentationPayload(value) {
  return value &&
    typeof value === "object" &&
    typeof value.compact === "boolean" &&
    typeof value.alwaysOnTop === "boolean" &&
    typeof value.timerActive === "boolean" &&
    ["floating", "menuBar"].includes(value.displayMode) &&
    typeof value.timeText === "string" &&
    ["zh-CN", "en"].includes(value.language) &&
    typeof value.appName === "string" &&
    typeof value.statusTooltip === "string";
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1120,
    height: 800,
    minWidth: NORMAL_MINIMUM_SIZE.width,
    minHeight: NORMAL_MINIMUM_SIZE.height,
    title: APP_NAME,
    backgroundColor: "#f3efe5",
    icon: iconPath(),
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  Menu.setApplicationMenu(null);
  const pagePath = app.isPackaged
    ? path.join(process.resourcesPath, "app", "index.html")
    : path.join(__dirname, "..", "macos", "app", "index.html");
  mainWindow.loadFile(pagePath);
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
    mainWindow.focus();
  });
  mainWindow.on("close", event => {
    if (!allowQuit && presentation.timerActive && presentation.displayMode === "menuBar") {
      event.preventDefault();
      mainWindow.hide();
    }
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

const hasSingleInstanceLock = app.requestSingleInstanceLock();
if (!hasSingleInstanceLock) {
  app.quit();
} else {
  app.on("second-instance", showMainWindow);
  app.whenReady().then(() => {
    app.setAppUserModelId("local.chenjin.focus.windows");
    ipcMain.on("window-mode", (_event, payload) => {
      if (isPresentationPayload(payload)) applyPresentation(payload);
    });
    createWindow();
  });
}

app.on("activate", () => {
  if (mainWindow) showMainWindow();
  else createWindow();
});

app.on("window-all-closed", () => {
  if (!tray) app.quit();
});

app.on("before-quit", () => {
  allowQuit = true;
});
