import { Component, HostListener, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EntrepriseLeftSidebarComponent } from '../left-sidebar/entreprise-left-sidebar.component';
import { LeftSidebarComponent } from "../../../admin/components/left-sidebar/left-sidebar.component";
import { MainComponent } from "../../../main/main.component";

@Component({
  selector: 'app-entreprise-layout',
  template: `
    <ap-left-sidebar 
  [isLeftSidebarCollapsed]="isLeftSidebarCollapsed()" 
  (changeIsLeftSidebarCollapsed)="changeIsLeftSidebarCollapsed($event)">
</ap-left-sidebar>

<app-main 
  [isLeftSidebarCollapsed]="isLeftSidebarCollapsed()" 
  [screenWidth]="screenWidth()">
</app-main>
  `,
  styleUrls: ['./entreprise-layout.component.css'],
  standalone:true,
  imports: [LeftSidebarComponent, RouterModule, EntrepriseLeftSidebarComponent, MainComponent]
})
export class EntrepriseLayoutComponent {
  isCollapsed = false;


  isLeftSidebarCollapsed = signal<boolean>(false);
    screenWidth = signal<number>(window.innerWidth);
  
    @HostListener('window:resize')
    onResize() {
      this.screenWidth.set(window.innerWidth);
      if (this.screenWidth() < 768) {
        this.isLeftSidebarCollapsed.set(true);
      }
    }
  
    ngOnInit(): void {
      this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);
    }
  
    changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
      this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
    }
}