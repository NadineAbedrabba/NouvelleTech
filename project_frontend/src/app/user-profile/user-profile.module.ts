import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { UserProfileComponent } from './user-profile.component';
import { EnhancedLoginUserComponent } from './enhanced-login-user.component';
import { WelcomeToastComponent } from './welcome-toast/welcome-toast.component';
import { LoginWrapperComponent } from './login-wrapper.component';

import { UserService } from './user.service';
import { LoginHandlerService } from './login-handler.service';
import { LoginSuccessService } from './login-success.service';
import { AuthInterceptorService } from './auth-interceptor.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    UserProfileComponent,
    EnhancedLoginUserComponent,
    WelcomeToastComponent,
    LoginWrapperComponent
  ],
  exports: [
    UserProfileComponent,
    EnhancedLoginUserComponent,
    WelcomeToastComponent,
    LoginWrapperComponent
  ],
  providers: [
    UserService,
    LoginHandlerService,
    LoginSuccessService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ]
})
export class UserProfileModule { }
