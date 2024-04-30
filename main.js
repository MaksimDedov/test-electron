// Modules to control application life and create native browser window
const { app, BrowserWindow, BrowserView, WebContentsView } = require('electron')
const path = require('node:path')

const INDEX_FILE = "file://E:/Work/test electron/index.html";

function createMainWindow() {
  return new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    backgroundColor: "#FFFAAA",
    useBrowserView: true
  });
}

function createBrowserWebContentsWindow () {
  try {
    const mainWindow = createMainWindow();
    const myCV = new WebContentsView({});
  
    mainWindow.contentView.addChildView(myCV);
    myCV.webContents.loadURL(INDEX_FILE, {});
    myCV.setBounds({ x: 0, y: 0, width: 300, height: 300 });
  
    // workaround for setAutoResize function
    mainWindow.on("resize", () => {
      const bounds = mainWindow.getBounds();
      myCV.setBounds({
        x: 0,
        y: 0,
        width: bounds.width,
        height: bounds.height,
      });
    });
  }
  catch(err){
    console.error(err);
  }
}

function createBrowserViewWindow () {
  try {
    const mainWindow = createMainWindow();
    const myBV = new BrowserView({ });
		mainWindow.addBrowserView(myBV);

    myBV.setAutoResize({
      width: true,
      height: true,
      horizontal: true,
      vertical: true,
    });
    
    myBV.setBounds({ x: 0, y: 0, width: 300, height: 300 });
    myBV.webContents.loadURL(INDEX_FILE, {});
	} catch (err) {
		console.error(err);
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createBrowserViewWindow();
  createBrowserWebContentsWindow();

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
