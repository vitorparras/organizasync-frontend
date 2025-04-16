import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '@core/application/users/user.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { InputComponent } from '@shared/ui/input/input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  protected userService = inject(UserService);
  private router = inject(Router);

  protected registerForm = this.fb.group(
    {
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  private passwordMatchValidator(form: any) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      const errors = confirmPassword.errors || {};
      if (errors['passwordMismatch']) {
        delete errors['passwordMismatch'];
        confirmPassword.setErrors(Object.keys(errors).length ? errors : null);
      }
    }

    return null;
  }

  protected isFieldInvalid(field: string): boolean {
    const control = this.registerForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  protected getFieldErrorMessage(field: string): string {
    const control = this.registerForm.get(field);

    if (!control || !control.errors) {
      return '';
    }

    if (field === 'name') {
      if (control.errors['required']) {
        return 'O nome é obrigatório';
      }
      if (control.errors['minlength']) {
        return 'O nome deve ter pelo menos 3 caracteres';
      }
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

    if (field === 'confirmPassword') {
      if (control.errors['required']) {
        return 'A confirmação de senha é obrigatória';
      }
      if (control.errors['passwordMismatch']) {
        return 'As senhas não coincidem';
      }
    }

    return '';
  }

  protected onSubmit(): void {
    if (this.registerForm.invalid) {
      return;
    }

    const { name, email, password } = this.registerForm.value;

    this.userService
      .createUser({
        name: name!,
        email: email!,
        plainPassword: password!,
      })
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/auth/login']);
        }
      });
  }
}
