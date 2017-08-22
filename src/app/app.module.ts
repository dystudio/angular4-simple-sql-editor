import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { TextAreaHtmlStringModule } from './text-area-html-string-example/text-area-html-string-example.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    TextAreaHtmlStringModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
