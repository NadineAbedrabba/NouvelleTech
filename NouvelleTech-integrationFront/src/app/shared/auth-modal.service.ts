import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthModalService {
  private showModalSubject = new BehaviorSubject<boolean>(false);
  showModal$ = this.showModalSubject.asObservable();

  constructor() { }

  openModal() {
    this.showModalSubject.next(true);
  }

  closeModal() {
    this.showModalSubject.next(false);
  }
}
