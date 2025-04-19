import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  template: `
    <div *ngIf="isLoading" class="loading-overlay" [class.fullscreen]="fullscreen">
      <div class="spinner-container">
        <div class="spinner"></div>
        <p *ngIf="message" class="message">{{ message | translate }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(var(--background-rgb), 0.7);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      
      &.fullscreen {
        position: fixed;
      }
    }
    
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid rgba(var(--primary-color-rgb), 0.2);
      border-radius: 50%;
      border-top-color: var(--primary-color);
      animation: spin 1s ease-in-out infinite;
    }
    
    .message {
      margin-top: 1rem;
      color: var(--text-color);
      font-size: 0.875rem;
    }
    
    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() isLoading = false;
  @Input() message = '';
  @Input() fullscreen = false;
}