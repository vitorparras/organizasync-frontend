import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ThemeService, Theme } from '../../../../core/services/theme.service';
import { LoadingSpinnerComponent } from '../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    LoadingSpinnerComponent
  ],
  template: `
    <div class="login-container">
      <app-loading-spinner [isLoading]="isLoading" [message]="'auth.loggingIn' | translate"></app-loading-spinner>
      
      <div class="language-switcher">
        <button 
          class="language-btn" 
          [class.active]="translateService.currentLang === 'pt-BR'" 
          (click)="changeLanguage('pt-BR')"
        >
          PT
        </button>
        <button 
          class="language-btn" 
          [class.active]="translateService.currentLang === 'en'" 
          (click)="changeLanguage('en')"
        >
          EN
        </button>
      </div>
      
      <div class="login-box">
        <div class="login-header">
          <h1 class="app-title">{{ 'app.title' | translate }}</h1>
          <button 
            class="theme-toggle" 
            (click)="toggleTheme()" 
            aria-label="Toggle theme"
          >
            <i class="material-icons">{{ isDarkTheme ? 'light_mode' : 'dark_mode' }}</i>
          </button>
        </div>
        
        <h2 class="login-title">{{ 'auth.login' | translate }}</h2>
        
        <div *ngIf="errorMessage" class="error-message">
          {{ errorMessage | translate }}
        </div>
        
        <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">{{ 'auth.email' | translate }}</label>
            <div class="input-container">
              <i class="material-icons input-icon">email</i>
              <input 
                type="email" 
                id="email" 
                formControlName="email" 
                placeholder="{{ 'auth.emailPlaceholder' | translate }}"
                [class.invalid]="isInvalid('email')"
              >
            </div>
            <div class="error-text" *ngIf="isInvalid('email')">
              <span *ngIf="loginForm.get('email')?.errors?.['required']">
                {{ 'auth.emailRequired' | translate }}
              </span>
              <span *ngIf="loginForm.get('email')?.errors?.['email']">
                {{ 'auth.emailInvalid' | translate }}
              </span>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">{{ 'auth.password' | translate }}</label>
            <div class="input-container">
              <i class="material-icons input-icon">lock</i>
              <input 
                [type]="showPassword ? 'text' : 'password'" 
                id="password" 
                formControlName="password" 
                placeholder="{{ 'auth.passwordPlaceholder' | translate }}"
                [class.invalid]="isInvalid('password')"
              >
              <button 
                type="button" 
                class="password-toggle" 
                (click)="togglePasswordVisibility()"
              >
                <i class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</i>
              </button>
            </div>
            <div class="error-text" *ngIf="isInvalid('password')">
              <span *ngIf="loginForm.get('password')?.errors?.['required']">
                {{ 'auth.passwordRequired' | translate }}
              </span>
              <span *ngIf="loginForm.get('password')?.errors?.['minlength']">
                {{ 'auth.passwordMinLength' | translate }}
              </span>
            </div>
          </div>
          
          <div class="form-group check">
            <div class="checkbox-container">
              <input type="checkbox" id="remember" formControlName="rememberMe">
              <label for="remember">{{ 'auth.rememberMe' | translate }}</label>
            </div>
            <a href="#" class="forgot-link">{{ 'auth.forgotPassword' | translate }}</a>
          </div>
          
          <button 
            type="submit" 
            class="login-button" 
            [disabled]="loginForm.invalid || isLoading"
          >
            {{ 'auth.logIn' | translate }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background-color: var(--background);
      padding: 1.5rem;
      position: relative;
    }
    
    .language-switcher {
      position: absolute;
      top: 1rem;
      right: 1rem;
      display: flex;
      gap: 0.5rem;
    }
    
    .language-btn {
      background: none;
      border: 1px solid var(--border-color);
      border-radius: 4px;
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      cursor: pointer;
      color: var(--text-color);
      transition: background-color 0.2s, color 0.2s;
      
      &.active {
        background-color: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }
      
      &:hover:not(.active) {
        background-color: rgba(0, 0, 0, 0.05);
      }
    }
    
    .login-box {
      width: 100%;
      max-width: 450px;
      background-color: var(--card-bg);
      border-radius: 12px;
      box-shadow: var(--shadow);
      padding: 2rem;
    }
    
    .login-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }
    
    .app-title {
      font-size: 1.5rem;
      color: var(--primary-color);
      margin: 0;
    }
    
    .theme-toggle {
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-color);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      transition: background-color 0.2s;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.05);
      }
      
      i {
        font-size: 24px;
      }
    }
    
    .login-title {
      font-size: 1.75rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 1.5rem;
      text-align: center;
    }
    
    .error-message {
      background-color: rgba(var(--error-color-rgb), 0.1);
      color: var(--error-color);
      padding: 0.75rem 1rem;
      border-radius: 4px;
      margin-bottom: 1.5rem;
      font-size: 0.875rem;
      border-left: 3px solid var(--error-color);
    }
    
    .form-group {
      margin-bottom: 1.5rem;
      
      label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        color: var(--text-color);
      }
      
      &.check {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    
    .input-container {
      position: relative;
      display: flex;
      align-items: center;
    }
    
    .input-icon {
      position: absolute;
      left: 1rem;
      color: var(--text-secondary);
      font-size: 20px;
    }
    
    input[type="email"],
    input[type="password"],
    input[type="text"] {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 2.5rem;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      font-size: 0.875rem;
      transition: border-color 0.2s, box-shadow 0.2s;
      background-color: var(--input-bg);
      color: var(--text-color);
      
      &:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 2px rgba(var(--primary-color-rgb), 0.2);
        outline: none;
      }
      
      &.invalid {
        border-color: var(--error-color);
      }
      
      &::placeholder {
        color: var(--text-secondary);
        opacity: 0.7;
      }
    }
    
    .password-toggle {
      position: absolute;
      right: 0.75rem;
      background: none;
      border: none;
      cursor: pointer;
      color: var(--text-secondary);
      padding: 0.25rem;
      
      &:hover {
        color: var(--text-color);
      }
    }
    
    .error-text {
      font-size: 0.75rem;
      color: var(--error-color);
      margin-top: 0.5rem;
    }
    
    .checkbox-container {
      display: flex;
      align-items: center;
      
      input[type="checkbox"] {
        margin-right: 0.5rem;
        cursor: pointer;
      }
      
      label {
        font-size: 0.875rem;
        margin-bottom: 0;
        cursor: pointer;
      }
    }
    
    .forgot-link {
      font-size: 0.875rem;
      color: var(--primary-color);
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
    
    .login-button {
      width: 100%;
      padding: 0.875rem;
      background-color: var(--primary-color);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
      
      &:hover:not(:disabled) {
        background-color: var(--primary-color-hover);
      }
      
      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;
  isDarkTheme = false;
  
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    public translateService: TranslateService,
    private themeService: ThemeService
  ) {
    // Initialize theme
    this.themeService.initTheme();
    
    // Check current theme
    this.themeService.currentTheme$.subscribe(theme => {
      this.isDarkTheme = theme === 'dark';
    });
    
    // Create login form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }
  
  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.errorMessage = '';
    
    const { email, password, rememberMe } = this.loginForm.value;
    
    this.authService.login({ email, password, rememberMe })
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.message || 'auth.loginError';
          console.error('Login error:', error);
        }
      });
  }
  
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  
  changeLanguage(lang: string): void {
    this.translateService.use(lang);
  }
  
  isInvalid(controlName: string): boolean {
    const control = this.loginForm.get(controlName);
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}