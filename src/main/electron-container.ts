
import { Injector, StaticProvider } from '@angular/core';
import { Logger } from '@bitblit/ratchet/dist/common/logger';

import {MainWindowFactory} from './main-window-factory';
import {ApplicationConstants} from './application-constants';

export class ElectronContainer {
  private static CONTAINER: Injector;
  public static PROVIDERS: StaticProvider[] = [
    { provide: MainWindowFactory, deps: [] }
  ];

  private constructor() {}

  public static getContainer(): Injector {
    if (!ElectronContainer.CONTAINER) {
      // Start up the container
      Logger.info('Building container');
      Logger.info('NodeJS version is %s', process.version);
      Logger.info('Chromium version is %s', process.versions['chrome']);
      Logger.info('Build info is %j', ApplicationConstants.getBuildInfo());

      ElectronContainer.CONTAINER = Injector.create(ElectronContainer.PROVIDERS);
      Logger.silly('Finished building container');
    }

    return ElectronContainer.CONTAINER;
  }

  public static get(token: any, notFoundValue?: any): any {
    return ElectronContainer.getContainer().get(token, notFoundValue);
  }
}
