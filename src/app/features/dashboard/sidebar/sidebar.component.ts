import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService, User } from '../../../core/services/auth.service';
import { ThemeService, Theme } from '../../../core/services/theme.service';

// Interface for sidebar navigation items
interface NavItem {
  label: string;
  route?: string;
  icon: string;
  children?: NavItem[];
  expanded?: boolean;
  roles?: string[];  // Roles allowed to see this item
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  template: `
    <aside class="sidebar" [class.open]="isOpen">
      <div class="sidebar-header">
        <div class="logo-container">
          <h1 class="logo">{{ 'app.shortTitle' | translate }}</h1>
        </div>
        <button class="close-button" (click)="onToggleSidebar()" aria-label="Close sidebar">
          <i class="material-icons">close</i>
        </button>
      </div>
      
      <div class="user-info" *ngIf="currentUser">
        <div class="user-avatar">
          {{ userInitials }}
        </div>
        <div class="user-details">
          <h3 class="user-name">{{ currentUser.name }}</h3>
          <p class="user-role">{{ 'roles.' + primaryRole | translate }}</p>
        </div>
      </div>
      
      <nav class="nav-menu">
        <ul class="nav-list">
          <li *ngFor="let item of navigationItems" class="nav-item" 
              [class.has-children]="item.children?.length"
              [class.expanded]="item.expanded"
              [class.active]="isActive(item)">
              
            <a *ngIf="item.route && !item.children?.length" 
               [routerLink]="item.route" 
               class="nav-link"
               (click)="closeOnMobile()">
              <i class="material-icons">{{ item.icon }}</i>
              <span class="nav-label">{{ item.label | translate }}</span>
            </a>
            
            <a *ngIf="!item.route || item.children?.length" 
               class="nav-link" 
               (click)="toggleSubMenu(item)">
              <i class="material-icons">{{ item.icon }}</i>
              <span class="nav-label">{{ item.label | translate }}</span>
              <i *ngIf="item.children?.length" class="material-icons expand-icon">
                {{ item.expanded ? 'expand_less' : 'expand_more' }}
              </i>
            </a>
            
            <ul *ngIf="item.children?.length" class="sub-menu" [class.expanded]="item.expanded">
              <li *ngFor="let child of item.children" class="sub-menu-item" [class.active]="isActive(child)">
                <a [routerLink]="child.route" class="sub-menu-link" (click)="closeOnMobile()">
                  <i class="material-icons">{{ child.icon }}</i>
                  <span>{{ child.label | translate }}</span>
                </a>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      
      <div class="sidebar-footer">
        <button class="theme-toggle" (click)="toggleTheme()">
          <i class="material-icons">{{ isDarkTheme ? 'light_mode' : 'dark_mode' }}</i>
          <span>{{ (isDarkTheme ? 'common.lightMode' : 'common.darkMode') | translate }}</span>
        </button>
        
        <button class="logout-button" (click)="logout()">
          <i class="material-icons">logout</i>
          <span>{{ 'auth.logout' | translate }}</span>
        </button>
      </div>
    </aside>
  `,
  styles: [`
    .sidebar {
      width: 250px;
      height: 100vh;
      background-color: var(--card-bg);
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 100;
      transform: translateX(-100%);
      transition: transform 0.3s ease;
      
      &.open {
        transform: translateX(0);
      }
    }
    
    .sidebar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem;
      border-bottom: 1px solid var(--border-color);
    }
    
    .logo {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--primary-color);
      margin: 0;
    }
    
    .close-button {
      background: none;
      border: none;
      color: var(--text-secondary);
      cursor: pointer;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
        color: var(--text-color);
      }
      
      i {
        font-size: 20px;
      }
    }
    
    .user-info {
      padding: 1rem;
      display: flex;
      align-items: center;
      border-bottom: 1px solid var(--border-color);
    }
    
    .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: var(--primary-color);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 1rem;
      margin-right: 0.75rem;
    }
    
    .user-details {
      flex: 1;
      min-width: 0;
    }
    
    .user-name {
      font-size: 0.875rem;
      font-weight: 600;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: var(--text-color);
    }
    
    .user-role {
      font-size: 0.75rem;
      color: var(--text-secondary);
      margin: 0.25rem 0 0;
    }
    
    .nav-menu {
      flex: 1;
      overflow-y: auto;
      padding: 0.5rem 0;
    }
    
    .nav-list {
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .nav-item {
      &.active > .nav-link {
        color: var(--primary-color);
        background-color: rgba(var(--primary-color-rgb), 0.1);
      }
      
      &.has-children.expanded {
        > .sub-menu {
          max-height: 500px;
          opacity: 1;
        }
      }
    }
    
    .nav-link {
      display: flex;
      align-items: center;
      padding: 0.75rem 1rem;
      color: var(--text-color);
      text-decoration: none;
      position: relative;
      cursor: pointer;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.03);
      }
      
      i {
        margin-right: 0.75rem;
        font-size: 1.25rem;
      }
      
      .expand-icon {
        margin-left: auto;
        margin-right: 0;
        font-size: 1.25rem;
        transition: transform 0.2s ease;
      }
    }
    
    .sub-menu {
      list-style: none;
      margin: 0;
      padding: 0;
      max-height: 0;
      overflow: hidden;
      opacity: 0;
      transition: max-height 0.3s ease, opacity 0.3s ease;
      
      &.expanded {
        max-height: 500px;
        opacity: 1;
      }
    }
    
    .sub-menu-item {
      &.active > .sub-menu-link {
        color: var(--primary-color);
        background-color: rgba(var(--primary-color-rgb), 0.05);
      }
    }
    
    .sub-menu-link {
      display: flex;
      align-items: center;
      padding: 0.625rem 1rem 0.625rem 2.75rem;
      color: var(--text-color);
      text-decoration: none;
      font-size: 0.875rem;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.03);
      }
      
      i {
        margin-right: 0.5rem;
        font-size: 1rem;
        opacity: 0.7;
      }
    }
    
    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .theme-toggle, .logout-button {
      display: flex;
      align-items: center;
      padding: 0.625rem 1rem;
      border: none;
      background: none;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.2s;
      width: 100%;
      text-align: left;
      
      i {
        margin-right: 0.75rem;
      }
    }
    
    .theme-toggle {
      color: var(--text-color);
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
    
    .logout-button {
      color: var(--error-color);
      
      &:hover {
        background-color: rgba(var(--error-color-rgb), 0.05);
      }
    }
    
    @media (min-width: 769px) {
      .sidebar {
        transform: translateX(0);
        
        &:not(.open) {
          transform: translateX(-100%);
        }
      }
      
      .close-button {
        display: none;
      }
    }
  `]
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isOpen = true;
  @Output() toggleSidebar = new EventEmitter<void>();
  
  currentUser: User | null = null;
  isDarkTheme = false;
  
  // Navigation structure
  navigationItems: NavItem[] = [
    {
      label: 'dashboard.home',
      route: '/dashboard',
      icon: 'home'
    },
    {
      label: 'dashboard.projects',
      icon: 'folder',
      children: [
        {
          label: 'dashboard.projectsList',
          route: '/dashboard/projects',
          icon: 'list'
        },
        {
          label: 'dashboard.createProject',
          route: '/dashboard/projects/create',
          icon: 'add'
        }
      ]
    },
    {
      label: 'dashboard.tasks',
      icon: 'task',
      children: [
        {
          label: 'dashboard.tasksList',
          route: '/dashboard/tasks',
          icon: 'list'
        },
        {
          label: 'dashboard.createTask',
          route: '/dashboard/tasks/create',
          icon: 'add'
        }
      ]
    },
    {
      label: 'dashboard.calendar',
      route: '/dashboard/calendar',
      icon: 'calendar_today'
    },
    {
      label: 'dashboard.reports',
      route: '/dashboard/reports',
      icon: 'assessment'
    },
    {
      label: 'dashboard.settings',
      route: '/dashboard/settings',
      icon: 'settings',
      roles: ['admin']
    }
  ];
  
  private destroy$ = new Subject<void>();
  private currentRoute = '';
  
  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {}
  
  ngOnInit(): void {
    // Subscribe to auth state changes
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        
        // Filter navigation items based on user roles
        this.filterNavigationItems();
      });
    
    // Subscribe to theme changes
    this.themeService.currentTheme$
      .pipe(takeUntil(this.destroy$))
      .subscribe((theme: Theme) => {
        this.isDarkTheme = theme === 'dark';
      });
    
    // Subscribe to router events to highlight current route
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe((event: any) => {
        this.currentRoute = event.url;
        this.expandActiveParent();
      });
    
    // Expand the active parent menu on init
    this.currentRoute = this.router.url;
    this.expandActiveParent();
  }
  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }
  
  logout(): void {
    this.authService.logout();
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  toggleSubMenu(item: NavItem): void {
    item.expanded = !item.expanded;
  }
  
  isActive(item: NavItem): boolean {
    if (item.route) {
      return this.currentRoute === item.route;
    }
    return false;
  }
  
  closeOnMobile(): void {
    // Close sidebar on navigation on mobile devices
    if (window.innerWidth < 768) {
      this.toggleSidebar.emit();
    }
  }
  
  get userInitials(): string {
    if (!this.currentUser) return '';
    
    return this.currentUser.firstName.charAt(0) + 
           (this.currentUser.lastName ? this.currentUser.lastName.charAt(0) : '');
  }
  
  get primaryRole(): string {
    if (!this.currentUser || !this.currentUser.roles.length) {
      return 'user';
    }
    
    // Admin is considered the highest role
    if (this.currentUser.roles.includes('admin')) {
      return 'admin';
    }
    
    return this.currentUser.roles[0];
  }
  
  private expandActiveParent(): void {
    // Find and expand the parent of the active route
    for (const item of this.navigationItems) {
      if (item.children?.length) {
        // Check if any child is active
        const hasActiveChild = item.children.some(child => this.currentRoute === child.route);
        
        // Expand if a child is active or if parent itself is active
        item.expanded = hasActiveChild || this.isActive(item);
      }
    }
  }
  
  private filterNavigationItems(): void {
    if (!this.currentUser) return;
    
    // Filter navigation items based on user roles
    this.navigationItems.forEach(item => {
      if (item.roles?.length) {
        // Hide items that require roles the user doesn't have
        const hasRequiredRole = item.roles.some(role => 
          this.currentUser?.roles.includes(role)
        );
        
        if (!hasRequiredRole) {
          // We can't directly remove from the array during iteration
          // So we'll mark it as hidden
          (item as any).hidden = true;
        } else {
          (item as any).hidden = false;
        }
      }
      
      // Also check children
      if (item.children?.length) {
        item.children = item.children.filter(child => {
          if (!child.roles?.length) return true;
          
          return child.roles.some(role => 
            this.currentUser?.roles.includes(role)
          );
        });
      }
    });
    
    // Now filter out hidden items
    this.navigationItems = this.navigationItems.filter(item => !(item as any).hidden);
  }
}