import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { EditorComponent } from './editor/editor.component';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    EditorComponent
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }