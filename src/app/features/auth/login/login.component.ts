import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '@core/application/auth/auth.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { InputComponent } from '@shared/ui/input/input.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  protected authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  protected loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  protected isFieldInvalid(field: string): boolean {
    const control = this.loginForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  protected getFieldErrorMessage(field: string): string {
    const control = this.loginForm.get(field);

    if (!control || !control.errors) {
      return '';
    }

    if (field === 'email') {
      if (control.errors['required']) {
        return 'O e-mail é obrigatório';
      }
      if (control.errors['email']) {
        return 'Formato de e-mail inválido';
      }
    }

    if (field === 'password') {
      if (control.errors['required']) {
        return 'A senha é obrigatória';
      }
      if (control.errors['minlength']) {
        return 'A senha deve ter pelo menos 6 caracteres';
      }
    }

    return '';
  }

  protected onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login({ email: email!, password: password! }).subscribe(success => {
      if (success) {
        // Redireciona para a URL de retorno ou para o dashboard
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/profile';
        this.router.navigateByUrl(returnUrl);
      }
    });
  }
}
