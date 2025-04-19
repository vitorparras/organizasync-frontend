import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../../core/services/theme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="theme-toggle">
      <button
        class="toggle-button"
        [class.active]="(currentTheme$ | async) === 'light'"
        (click)="toggleTheme()"
      >
        <span *ngIf="(currentTheme$ | async) === 'dark'">☀️</span>
        <span *ngIf="(currentTheme$ | async) === 'light'">🌙</span>
      </button>
    </div>
  `,
  styles: [`
    .theme-toggle {
      display: inline-flex;
      align-items: center;
    }
    
    .toggle-button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2rem;
      padding: 0.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      width: 2rem;
      height: 2rem;
      transition: all 0.3s ease;
    }
    
    .toggle-button:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }
    
    :host-context(.theme-dark) .toggle-button:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  currentTheme$!: Observable<Theme>;
  
  constructor(private themeService: ThemeService) {}
  
  ngOnInit(): void {
    this.currentTheme$ = this.themeService.currentTheme$;
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}