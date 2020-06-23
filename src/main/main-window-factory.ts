import { Logger } from '@bitblit/ratchet/dist/common/logger';
import { format as formatUrl } from 'url';
import * as path from 'path';
import {app, BrowserWindow, globalShortcut, ipcMain, Menu} from 'electron';
import { StringRatchet } from '@bitblit/ratchet/dist/common/string-ratchet';
import {ApplicationConstants} from './application-constants';
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;

export class MainWindowFactory {
  private _mainWindow: Electron.BrowserWindow = null;

  constructor() {}

  public async fetchOrCreateMainWindow(): Promise<Electron.BrowserWindow> {
    if (!this._mainWindow) {
      Logger.info('Creating main window');
      const newWindow: BrowserWindow = new BrowserWindow({ webPreferences: { nodeIntegration: true,
          webSecurity: false} });

      // Set url for `win`
      // points to `webpack-dev-server` in development
      // points to `index.html` in production
      const url: string = ApplicationConstants.isDevelopment()
          ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
          : `file://${__dirname}/index.html`;

      await newWindow.loadURL(url);

      newWindow.on('closed', () => {
        this._mainWindow = null;
      });

      newWindow.webContents.on('devtools-opened', () => {
        newWindow.focus();
        setImmediate(() => {
          newWindow.focus();
        });
      });

      // Setup menus and shortcuts
      this.setupApplicationMenu();
      this.setupGlobalShortcuts();

      // Setup ipc channels
      ipcMain.on('web-to-app-data', (event, arg) => this.handleBrowserSyncEvent(event, arg));

      this._mainWindow = newWindow;
    }
    return this._mainWindow;
  }

  public handleBrowserSyncEvent(event: any, arg: any): void {
    Logger.info('Got browser event : %j', arg);

    event.returnValue = {
      time: new Date().getTime(),
      guid: StringRatchet.createType4Guid(),
    };
  }

  private setupGlobalShortcuts(): void {
    try {
      globalShortcut.register('CommandOrControl+1', () => {
        this.cmdOpenDevelopmentConsole();
      });
    } catch (err) {
      Logger.error('Trouble setting up global shortcuts : %s', err, err);
    }
  }

  private async cmdOpenDevelopmentConsole(): Promise<void> {
    const win: BrowserWindow = await this.fetchOrCreateMainWindow();
    win.webContents.openDevTools();
  }


  public setupApplicationMenu(): void {
    Logger.info('Setting up menus');
    const template: MenuItemConstructorOptions[] = [
      {
        label: 'Electron Application',
        submenu: [
          {
            label: 'Test1',
            click: (item, focusedWindow) => {
              Logger.info('Sending message to window');
              this._mainWindow.webContents.send('app-to-web-data', {msg: 'test1', time: new Date()});
            },
          },
          {
            type: 'separator',
          },
          {
            role: 'quit',
          },
        ],
      },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
  }
}
