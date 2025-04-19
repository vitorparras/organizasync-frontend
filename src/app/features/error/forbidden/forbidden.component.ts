import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forbidden',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule
  ],
  template: `
    <div class="error-container">
      <div class="error-content">
        <div class="error-icon">
          <i class="material-icons">block</i>
        </div>
        <h1 class="error-code">403</h1>
        <h2 class="error-title">{{ 'errors.forbidden' | translate }}</h2>
        <p class="error-message">{{ 'errors.forbiddenMessage' | translate }}</p>
        <div class="error-actions">
          <a [routerLink]="['/dashboard']" class="btn-primary">
            <i class="material-icons">dashboard</i>
            {{ 'common.backToDashboard' | translate }}
          </a>
          
          <button (click)="logout()" class="btn-secondary">
            <i class="material-icons">logout</i>
            {{ 'auth.logout' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .error-container {
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: var(--background);
      padding: 1rem;
    }
    
    .error-content {
      max-width: 500px;
      text-align: center;
      padding: 2rem;
      background-color: var(--card-bg);
      border-radius: 8px;
      box-shadow: var(--shadow);
    }
    
    .error-icon {
      font-size: 3rem;
      color: var(--warning-color);
      margin-bottom: 1rem;
      
      i {
        font-size: 4rem;
      }
    }
    
    .error-code {
      font-size: 5rem;
      font-weight: 700;
      color: var(--warning-color);
      margin: 0 0 1rem;
      line-height: 1;
    }
    
    .error-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 1rem;
    }
    
    .error-message {
      font-size: 1rem;
      color: var(--text-secondary);
      margin-bottom: 1.5rem;
    }
    
    .error-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
      
      .btn-primary, .btn-secondary {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        border-radius: 4px;
        font-weight: 500;
        text-decoration: none;
        transition: background-color 0.2s;
        
        i {
          font-size: 1.25rem;
        }
      }
      
      .btn-primary {
        background-color: var(--primary-color);
        color: white;
        
        &:hover {
          background-color: var(--primary-color-hover);
        }
      }
      
      .btn-secondary {
        background-color: transparent;
        color: var(--text-color);
        border: 1px solid var(--border-color);
        
        &:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }
      }
    }
  `]
})
export class ForbiddenComponent {
  constructor(private authService: AuthService) {}
  
  logout(): void {
    this.authService.logout();
  }
}