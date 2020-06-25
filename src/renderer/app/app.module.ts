
import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {AppComponent} from "./app.component";
import {NgxElectronModule} from "ngx-electron";
import {ElectronCommunicationService} from './service/electron-communication.service';
import {Test1Component} from './component/test1/test1.component';
import {Test2Component} from './component/test2/test2.component';
import {AppRoutingModule} from './app-routing.module';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        NgxElectronModule,
        AppRoutingModule
    ],
    declarations: [
        AppComponent,
        Test1Component,
        Test2Component
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
