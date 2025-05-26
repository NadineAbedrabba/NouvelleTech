import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';  // Import AppComponent;
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthModule } from './auth/auth.module';
import { CommonModule, NgIf } from '@angular/common';
import { DetailRestoComponent } from './detail-resto/detail-resto.component';

@NgModule({
  declarations: [ 
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,  // Import BrowserModule for bootstrapping the application
    RouterModule,
    FormsModule,
    AuthModule,
    CommonModule,
    NgIf, 
    AppComponent,
  ],
  bootstrap: [],  // Declare that AppComponent should be bootstrapped
})
export class AppModule {}