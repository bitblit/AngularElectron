import { Injectable } from '@angular/core';

import { ElectronService } from 'ngx-electron';
import { Logger } from '@bitblit/ratchet/dist/common/logger';
import { No } from '@bitblit/ratchet/dist/common/no';

@Injectable()
export class ElectronCommunicationService {
  private enabled: boolean = null;

  constructor(private electronService: ElectronService) {
    this.initialize().then(No.op);
  }

  public async publishDataToApp(data: any): Promise<void> {
    if (this.electronService.isElectronApp) {
      // Could also use .send(xx) here to not get a return value
      const v: any = this.electronService.ipcRenderer.sendSync('web-to-app-data', data);
      Logger.info('Rval is %j %j', data.returnValue, v);
    } else {
      Logger.error('Not sending %j to electron - not an electron app', data);
    }
  }

  async initialize(): Promise<void> {
    if (this.electronService.isElectronApp) {
      Logger.info('Setting up listener');
      this.electronService.ipcRenderer.on('app-to-web-data', (event, arg) => {
        this.receiveAppDataFromElectron(arg);
      });
    } else {
      Logger.info('Not running inside Electron - not starting monitor data pump');
      this.enabled = false;
    }
  }

  private receiveAppDataFromElectron(wrapper: any): void {
    Logger.info('Received app data :  %j ', wrapper);
  }
}
