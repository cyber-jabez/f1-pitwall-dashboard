const { contextBridge } = require('electron')

contextBridge.exposeInMainWorld('isElectron', true)
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  version: process.versions.electron,
})

