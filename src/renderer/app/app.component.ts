import { Component, ViewEncapsulation } from '@angular/core';

import './styles.scss';
import { ElectronCommunicationService } from './service/electron-communication.service';
import { Logger } from '@bitblit/ratchet/dist/common/logger';

@Component({
  selector: '#app',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {
  constructor(private ecs: ElectronCommunicationService) {
    Logger.info('Got %s', ecs);
  }
}
