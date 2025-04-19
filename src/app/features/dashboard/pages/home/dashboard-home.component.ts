import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    PageHeaderComponent
  ],
  template: `
    <div class="dashboard-home">
      <app-page-header 
        [title]="'dashboard.welcome'"
        [showActions]="false"
      ></app-page-header>
      
      <div class="stats-cards">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="material-icons">assignment</i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">12</h3>
            <p class="stat-label">{{ 'dashboard.pendingTasks' | translate }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="material-icons">check_circle</i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">24</h3>
            <p class="stat-label">{{ 'dashboard.completedTasks' | translate }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="material-icons">work</i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">5</h3>
            <p class="stat-label">{{ 'dashboard.projects' | translate }}</p>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">
            <i class="material-icons">event</i>
          </div>
          <div class="stat-content">
            <h3 class="stat-value">8</h3>
            <p class="stat-label">{{ 'dashboard.upcomingEvents' | translate }}</p>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2 class="section-title">{{ 'dashboard.recentActivity' | translate }}</h2>
        <div class="activity-list">
          <div class="activity-item">
            <div class="activity-icon">
              <i class="material-icons">person_add</i>
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ 'dashboard.newUserAdded' | translate }}</p>
              <span class="activity-time">2 {{ 'common.hoursAgo' | translate }}</span>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon">
              <i class="material-icons">edit</i>
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ 'dashboard.projectUpdated' | translate }}</p>
              <span class="activity-time">5 {{ 'common.hoursAgo' | translate }}</span>
            </div>
          </div>
          
          <div class="activity-item">
            <div class="activity-icon">
              <i class="material-icons">assignment_turned_in</i>
            </div>
            <div class="activity-content">
              <p class="activity-text">{{ 'dashboard.taskCompleted' | translate }}</p>
              <span class="activity-time">1 {{ 'common.dayAgo' | translate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-home {
      padding: 0.5rem;
    }
    
    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .stat-card {
      background-color: var(--card-bg);
      border-radius: 8px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      box-shadow: var(--shadow);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: var(--shadow-hover);
      }
      
      .stat-icon {
        width: 50px;
        height: 50px;
        background-color: rgba(var(--primary-color-rgb), 0.1);
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
        
        i {
          color: var(--primary-color);
          font-size: 24px;
        }
      }
      
      .stat-content {
        flex: 1;
      }
      
      .stat-value {
        font-size: 1.75rem;
        font-weight: 700;
        margin: 0 0 0.25rem;
        color: var(--text-color);
      }
      
      .stat-label {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0;
      }
    }
    
    .section {
      background-color: var(--card-bg);
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
      box-shadow: var(--shadow);
    }
    
    .section-title {
      font-size: 1.25rem;
      font-weight: 600;
      margin: 0 0 1.5rem;
      color: var(--text-color);
    }
    
    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .activity-item {
      display: flex;
      align-items: center;
      padding: 0.75rem;
      border-radius: 8px;
      background-color: var(--background);
      
      .activity-icon {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgba(var(--primary-color-rgb), 0.1);
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
        
        i {
          color: var(--primary-color);
          font-size: 20px;
        }
      }
      
      .activity-content {
        flex: 1;
      }
      
      .activity-text {
        font-size: 0.875rem;
        margin: 0 0 0.25rem;
        color: var(--text-color);
      }
      
      .activity-time {
        font-size: 0.75rem;
        color: var(--text-secondary);
      }
    }
    
    @media (max-width: 768px) {
      .stats-cards {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class DashboardHomeComponent {}