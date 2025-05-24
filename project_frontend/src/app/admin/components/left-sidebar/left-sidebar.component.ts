import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.css']
})
export class LeftSidebarComponent {
  @Input() isLeftSidebarCollapsed: boolean = false;
  @Output() changeIsLeftSidebarCollapsed = new EventEmitter<boolean>();
  items = [
    { routeLink: 'dashboard', icon: 'fal fa-home', label: 'Dashboard' },
    { routeLink: 'restaurants', icon: 'fal fa-hourglass-half', label: 'Inscriptions en attente' },
    { routeLink: 'pages', icon: 'fal fa-utensils', label: 'Restaurants' },
    
  ];

  toggleCollapse(): void {
    this.changeIsLeftSidebarCollapsed.emit(!this.isLeftSidebarCollapsed);
  }

  closeSidenav(): void {
    this.changeIsLeftSidebarCollapsed.emit(true);
  }

  trackByIndex(index: number): number {
    return index;
  }
}