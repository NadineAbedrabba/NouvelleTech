import { CommonModule } from '@angular/common';
import { Component, computed, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent {
  @Input() isLeftSidebarCollapsed!: boolean;
  @Input() screenWidth!: number;
  // Supprimez la computed() car nous gérons directement dans le template
}