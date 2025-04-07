import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthSelectionComponent } from './components/auth-selection/auth-selection.component';
import { LoginUserComponent } from './components/login-user/login-user.component';
import { RegisterUserComponent } from './components/register-user/register-user.component';
import { LoginCompanyComponent } from './components/login-company/login-company.component';
import { RegisterCompanyComponent } from './components/register-company/register-company.component';
import { SharedComponent } from './components/shared/shared.component';


@NgModule({
  declarations: [
    AuthSelectionComponent,
    LoginUserComponent,
    RegisterUserComponent,
    LoginCompanyComponent,
    RegisterCompanyComponent,
    SharedComponent
  ],
  imports: [
    CommonModule,
    AuthRoutingModule
  ],
  exports: [
    AuthSelectionComponent, 
    LoginUserComponent, 
    RegisterUserComponent, 
    LoginCompanyComponent, 
    RegisterCompanyComponent
  ]
})
export class AuthModule { }
