const { app, BrowserWindow, shell } = require('electron')
const path = require('path')
const fs = require('fs')
const { fork } = require('child_process')

let mainWindow = null
let apiProcess = null

function getBackendScriptPath() {
  const candidates = [
    path.join(__dirname, '../f1-live-api/src/index.js'),
    path.join(app.getAppPath(), 'f1-live-api/src/index.js'),
    path.join(process.resourcesPath, 'f1-live-api/src/index.js'),
  ]
  for (const p of candidates) {
    if (fs.existsSync(p)) return p
  }
  return candidates[0]
}

// Start background F1 Live API Daemon silently
function startBackendDaemon() {
  try {
    const apiScript = getBackendScriptPath()
    const apiCwd = path.dirname(path.dirname(apiScript))
    apiProcess = fork(apiScript, [], {
      cwd: apiCwd,
      env: { ...process.env, PORT: '3001' },
      stdio: 'ignore',
      windowsHide: true,
    })
    console.log('[Electron] Background F1 Live API daemon started on port 3001 at:', apiScript)
  } catch (err) {
    console.error('[Electron] Failed to start backend daemon:', err)
  }
}

function stopBackendDaemon() {
  if (apiProcess) {
    try {
      apiProcess.kill()
      console.log('[Electron] Backend daemon stopped')
    } catch {
      // ignore
    }
    apiProcess = null
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    title: 'Scuderia Ferrari // F1 Pit Wall Command Cockpit',
    width: 1440,
    height: 900,
    minWidth: 1200,
    minHeight: 760,
    backgroundColor: '#07080C',
    autoHideMenuBar: true,
    icon: path.join(__dirname, '../public/favicon.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false, // Allows local file to query localhost:3001 without CORS restriction
    },
  })

  // Open external links in default system browser
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url)
      return { action: 'deny' }
    }
    return { action: 'allow' }
  })

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173')
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

// Single instance lock (prevent opening multiple duplicate windows)
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()
    }
  })

  app.whenReady().then(() => {
    startBackendDaemon()
    createWindow()

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })

  app.on('window-all-closed', () => {
    stopBackendDaemon()
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('will-quit', () => {
    stopBackendDaemon()
  })
}
