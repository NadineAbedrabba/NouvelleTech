import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';  // Import AppComponent;
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
     // Declare the AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,  // Import BrowserModule for bootstrapping the application
    RouterModule,
    FormsModule,
  ],
  bootstrap: [],  // Declare that AppComponent should be bootstrapped
})
export class AppModule {}

