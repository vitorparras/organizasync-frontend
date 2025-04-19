import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule
  ],
  template: `
    <div class="page-header">
      <div class="page-header-title">
        <h1>{{ title | translate }}</h1>
        <p *ngIf="subtitle" class="subtitle">{{ subtitle | translate }}</p>
      </div>
      
      <div *ngIf="showActions" class="page-header-actions">
        <ng-content></ng-content>
        
        <button *ngIf="showBackButton" class="btn-back" (click)="onBackClick()">
          <i class="material-icons">arrow_back</i>
          {{ 'common.back' | translate }}
        </button>
        
        <button *ngIf="showAddButton" class="btn-add" (click)="onAddClick()">
          <i class="material-icons">add</i>
          {{ addButtonText | translate }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-color);
      flex-wrap: wrap;
      gap: 1rem;
    }
    
    .page-header-title {
      h1 {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 0;
        color: var(--text-color);
      }
      
      .subtitle {
        font-size: 0.875rem;
        color: var(--text-secondary);
        margin: 0.25rem 0 0;
      }
    }
    
    .page-header-actions {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
    
    .btn-back, .btn-add {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;
    }
    
    .btn-back {
      background-color: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-color);
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
    
    .btn-add {
      background-color: var(--primary-color);
      color: white;
      border: none;
      
      &:hover {
        background-color: var(--primary-color-hover);
      }
      
      i {
        font-size: 20px;
      }
    }
    
    @media (max-width: 576px) {
      .page-header {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .page-header-actions {
        width: 100%;
        justify-content: flex-end;
      }
    }
  `]
})
export class PageHeaderComponent {
  @Input() title = '';
  @Input() subtitle?: string;
  @Input() showBackButton = false;
  @Input() showAddButton = false;
  @Input() showActions = true;
  @Input() addButtonText = 'common.add';
  
  @Output() backClick = new EventEmitter<void>();
  @Output() addClick = new EventEmitter<void>();
  
  onBackClick(): void {
    this.backClick.emit();
  }
  
  onAddClick(): void {
    this.addClick.emit();
  }
}