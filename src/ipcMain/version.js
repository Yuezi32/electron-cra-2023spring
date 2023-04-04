const { ipcMain } = require('electron')

ipcMain.handle('getElectronVersion', () => {
    return process.versions.electron
})