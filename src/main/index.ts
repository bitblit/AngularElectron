import { app, BrowserWindow } from 'electron';
import { Logger } from '@bitblit/ratchet/dist/common/logger';
import { Injector } from '@angular/core';
import { ElectronContainer } from './electron-container';
import { MainWindowFactory } from './main-window-factory';

Logger.info('Starting main file, app version is %s', app.getVersion());

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow = null;

async function createMainWindow(): Promise<BrowserWindow> {
  const container: Injector = ElectronContainer.getContainer();
  // Create and Register the main window
  return container.get(MainWindowFactory).fetchOrCreateMainWindow();
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  //if (process.platform !== 'darwin') {
  //  app.quit()
  //}
  app.quit();
});

app.on('activate', () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    createMainWindow().then((win) => {
      mainWindow = win;
    });
  }
});

// create main BrowserWindow when electron is ready
app.on('ready', () => {
  createMainWindow().then((win) => {
    mainWindow = win;
  });
});

/*
import { app, BrowserWindow } from 'electron'

const isDevelopment = process.env.NODE_ENV !== 'production';

let mainWindow : BrowserWindow;

function createMainWindow() {
    const window: BrowserWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }

});

    // Set url for `win`
    // points to `webpack-dev-server` in development
    // points to `index.html` in production
    const url = isDevelopment
        ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
        : `file://${__dirname}/index.html`;

    if (isDevelopment) {
        window.webContents.openDevTools();
    }

    window.loadURL(url);

    window.on('closed', () => {
        mainWindow = null;
    });

    window.webContents.on('devtools-opened', () => {
        window.focus();
        setImmediate(() => {
            window.focus();
        })
    });

    return window;
}

app.on('window-all-closed', () => {
    // On macOS it is common for applications to stay open
    // until the user explicitly quits
    //if (process.platform !== 'darwin') app.quit()
    app.quit();
});

app.on('activate', () => {
    // On macOS it is common to re-create a window
    // even after all windows have been closed
    if (mainWindow === null){
        mainWindow = createMainWindow();
    }
});

// Create main BrowserWindow when electron is ready
app.on('ready', () => {
    mainWindow = createMainWindow();
});


 */
