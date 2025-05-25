import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginSuccessService } from '../login-success.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-welcome-toast',
  templateUrl: './welcome-toast.component.html',
  styleUrls: ['./welcome-toast.component.scss'],
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('toastAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class WelcomeToastComponent implements OnInit {
  welcomeMessage: string | null = null;

  constructor(private loginSuccessService: LoginSuccessService) {}

  ngOnInit(): void {
    this.loginSuccessService.welcomeMessage$.subscribe(message => {
      this.welcomeMessage = message;
    });
  }

  closeToast(): void {
    this.loginSuccessService.clearWelcomeMessage();
  }
}
