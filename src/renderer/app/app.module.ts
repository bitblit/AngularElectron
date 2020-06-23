
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {AppComponent} from "./app.component";
import {NgxElectronModule} from "ngx-electron";
import {ElectronCommunicationService} from './service/electron-communication.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        NgxElectronModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [
        ElectronCommunicationService
    ],
    entryComponents: [],
    bootstrap: [
        AppComponent
    ]
})
export class AppModule {}
