// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain, webContents} = require('electron')
const path = require('path')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      webviewTag: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.webContents.on('did-attach-webview', didAttachWebview)

  // Open the DevTools.
  mainWindow.webContents.openDevTools()
}



// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})


let _shouldRemoveTargetHeaders = true
ipcMain.handle('set-should-remove-target-headers', async (event, value) => {
  _shouldRemoveTargetHeaders = !!value
})
function didAttachWebview (event, wc) {
  wc.session.webRequest.onHeadersReceived((details, callback) => {
    let responseHeaders = Object.assign({}, details.responseHeaders)
    if (_shouldRemoveTargetHeaders) {
      let names = [ 'cross-origin-opener-policy' ]
      for (let name of names) {
        delete responseHeaders[name]
      }
    }
    callback({ responseHeaders })
  })
}
