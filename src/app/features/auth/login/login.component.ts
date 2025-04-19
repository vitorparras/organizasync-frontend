import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { KeycloakService } from 'keycloak-angular';
import { ThemeToggleComponent } from '../../../shared/components/theme-toggle/theme-toggle.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ThemeToggleComponent
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  loginError = '';
  
  constructor(
    private formBuilder: FormBuilder,
    private keycloakService: KeycloakService,
    public translateService: TranslateService
  ) { }
  
  ngOnInit(): void {
    // Check if already authenticated
    const isLoggedIn = this.keycloakService.isLoggedIn();
    if (isLoggedIn) {
      this.keycloakService.loadUserProfile().then(() => {
        window.location.href = '/';
      });
    }
    
    // Initialize form
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }
    
    this.isLoading = true;
    this.loginError = '';
    
    // Use Keycloak login
    this.keycloakService.login({
      redirectUri: window.location.origin
    }).catch(error => {
      console.error('Login error:', error);
      this.isLoading = false;
      this.loginError = this.translateService.instant('auth.loginFailed');
    });
  }
  
  // Helper to mark all form controls as touched
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  // Change language
  changeLanguage(lang: string): void {
    this.translateService.use(lang);
  }
}
