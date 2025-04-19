import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TranslateModule } from '@ngx-translate/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarComponent,
    TranslateModule
  ],
  template: `
    <div class="dashboard-layout">
      <app-sidebar 
        [isOpen]="isSidebarOpen" 
        (toggleSidebar)="toggleSidebar()"
      ></app-sidebar>
      <div class="main-content" [class.sidebar-open]="isSidebarOpen">
        <div class="header">
          <button class="toggle-sidebar-btn" (click)="toggleSidebar()">
            <i class="material-icons">{{ isSidebarOpen ? 'menu_open' : 'menu' }}</i>
          </button>
          <h1 class="page-title">{{ 'app.title' | translate }}</h1>
        </div>
        <div class="content-wrapper">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-layout {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    
    .main-content {
      flex: 1;
      overflow-y: auto;
      padding: 0;
      transition: margin-left 0.3s ease;
    }
    
    .sidebar-open {
      margin-left: 250px;
    }
    
    .header {
      display: flex;
      align-items: center;
      padding: 1rem;
      background-color: var(--primary-color);
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .toggle-sidebar-btn {
      background: transparent;
      border: none;
      color: white;
      cursor: pointer;
      margin-right: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }
    
    .toggle-sidebar-btn:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .content-wrapper {
      padding: 1rem;
    }
    
    @media (max-width: 768px) {
      .sidebar-open {
        margin-left: 0;
      }
    }
  `]
})
export class DashboardLayoutComponent implements OnInit {
  isSidebarOpen = true;
  
  constructor(private themeService: ThemeService) {}
  
  ngOnInit(): void {
    // Initialize theme
    this.themeService.initTheme();
    
    // On mobile, sidebar should be closed by default
    if (window.innerWidth < 768) {
      this.isSidebarOpen = false;
    }
  }
  
  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}