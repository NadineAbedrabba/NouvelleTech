import { Component, HostListener, signal } from '@angular/core';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { LeftSidebarComponent } from "../../../admin/components/left-sidebar/left-sidebar.component";
import { MainComponent } from "../../../main/main.component";

@Component({
  selector: 'app-entreprise-layout',
  template: `
    <app-left-sidebar 
  [isLeftSidebarCollapsed]="isLeftSidebarCollapsed()" 
  (changeIsLeftSidebarCollapsed)="changeIsLeftSidebarCollapsed($event)">
</app-left-sidebar>

<app-main 
  [isLeftSidebarCollapsed]="isLeftSidebarCollapsed()" 
  [screenWidth]="screenWidth()">
</app-main>
  `,
  styleUrls: ['./admin-layout.component.css'],
  standalone:true,
  imports: [LeftSidebarComponent, RouterModule, LeftSidebarComponent, MainComponent]
})
export class AdminLayoutComponent {
  isCollapsed = false;

  isLeftSidebarCollapsed = signal<boolean>(false);
  screenWidth = signal<number>(window.innerWidth);

  constructor(private router: Router, private route: ActivatedRoute) {}

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
    if (this.screenWidth() < 768) {
      this.isLeftSidebarCollapsed.set(true);
    }
  }

  ngOnInit(): void {
    this.isLeftSidebarCollapsed.set(this.screenWidth() < 768);

    // Gérer le paramètre de navigation persistSidebar
    this.route.queryParams.subscribe(params => {
      if (params['persistSidebar'] === 'true') {
        this.isLeftSidebarCollapsed.set(false);
      }
    });
  }

  // Méthode pour gérer la navigation tout en maintenant le side bar
  navigateWithSidebar(): void {
    // Ne fait rien car nous voulons que le side bar persiste
  }

  changeIsLeftSidebarCollapsed(isLeftSidebarCollapsed: boolean): void {
    this.isLeftSidebarCollapsed.set(isLeftSidebarCollapsed);
  }
}