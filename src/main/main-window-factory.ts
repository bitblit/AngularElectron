import { Logger } from '@bitblit/ratchet/dist/common/logger';
import { BrowserWindow, globalShortcut, ipcMain, Menu } from 'electron';
import { StringRatchet } from '@bitblit/ratchet/dist/common/string-ratchet';
import { ApplicationConstants } from './application-constants';
import MenuItemConstructorOptions = Electron.MenuItemConstructorOptions;
import { autoUpdater, UpdateCheckResult } from 'electron-updater';
import AutoLaunch from 'auto-launch';
import IpcMainEvent = Electron.IpcMainEvent;

export class MainWindowFactory {
  private _mainWindow: Electron.BrowserWindow = null;
  private autoLauncher: AutoLaunch;

  constructor() {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const autoLaunchCfg: any = {
      name: 'AngularElectron',
      hidden: false,
    };
    this.autoLauncher = new AutoLaunch(autoLaunchCfg);
  }

  public async fetchOrCreateMainWindow(): Promise<Electron.BrowserWindow> {
    if (!this._mainWindow) {
      Logger.info('Creating main window');
      const newWindow: BrowserWindow = new BrowserWindow({ webPreferences: { nodeIntegration: true, webSecurity: false } });

      // Set url for `win`
      // points to `webpack-dev-server` in development
      // points to `index.html` in production
      const url: string = ApplicationConstants.isDevelopment()
        ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
        : `file://${__dirname}/index.html`;

      await newWindow.loadURL(url);

      // Always check for an update
      Logger.info('Window created - checking for update');
      const res: UpdateCheckResult = await autoUpdater.checkForUpdatesAndNotify();
      Logger.info('Update check returned %j', res);

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
      ipcMain.on('web-to-app-data', (event) => this.handleBrowserSyncEvent(event));

      this._mainWindow = newWindow;
    }
    return this._mainWindow;
  }

  public handleBrowserSyncEvent(event: IpcMainEvent): void {
    Logger.info('Got browser event : %j', event);

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
              Logger.info('Sending message to window (i: %j, w: %j)', item, focusedWindow);
              this._mainWindow.webContents.send('app-to-web-data', { msg: 'test1', time: new Date() });
            },
          },
          {
            type: 'separator',
          },
          {
            label: 'Updates',
            submenu: [
              {
                label: 'Update application',
                accelerator: 'CmdOrCtrl+U',
                click: (item, focusedWindow) => {
                  Logger.info('Update upp (i: %j, w: %j)', item, focusedWindow);
                  this.cmdUpdateSelf();
                },
              },
            ],
          },
          {
            label: 'Configuration',
            submenu: [
              {
                label: 'Enable AutoStart',
                click: (item, focusedWindow) => {
                  Logger.info('Auto-start E (i: %j, w: %j)', item, focusedWindow);
                  this.cmdEnableAutoStart();
                },
              },
              {
                label: 'Disable AutoStart',
                click: (item, focusedWindow) => {
                  Logger.info('Auto-start D (i: %j, w: %j)', item, focusedWindow);
                  this.cmdDisableAutoStart();
                },
              },
              {
                type: 'separator',
              },
            ] as MenuItemConstructorOptions[],
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

  private cmdDisableAutoStart(): void {
    this.setAutoStart(false).then((result) => Logger.info('Disable autostart returned enabled=%s', result));
  }

  private cmdEnableAutoStart(): void {
    this.setAutoStart(true).then((result) => Logger.info('Enable autostart returned enabled=%s', result));
  }

  public async setAutoStart(newValue: boolean): Promise<boolean> {
    Logger.info('Setting auto-start to %s', newValue);
    if (newValue) {
      const toggleVal: any = this.autoLauncher.enable();
      Logger.info('Enable returned %s', toggleVal);
    } else {
      const toggleVal: any = this.autoLauncher.disable();
      Logger.info('Enable returned %s', toggleVal);
    }

    const updated: boolean = await this.autoLauncher.isEnabled();

    if (updated !== newValue) {
      Logger.warn('Failed to update setting of auto-start (value is %s)', updated);
    }
    return updated;
  }

  private cmdUpdateSelf(): void {
    Logger.info('Calling check for updates on auto-updater');
    autoUpdater.checkForUpdatesAndNotify().then((res) => {
      Logger.info('Check for updates returned %s', res);
    });
  }
}
