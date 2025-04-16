import { Component, type OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@core/application/users/user.service';
import { AuthService } from '@core/application/auth/auth.service';
import { ButtonComponent } from '@shared/ui/button/button.component';
import { InputComponent } from '@shared/ui/input/input.component';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, InputComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  protected userService = inject(UserService);
  protected authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected profileForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
  });

  protected passwordForm = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    {
      validators: this.passwordMatchValidator,
    }
  );

  private passwordMatchValidator(form: any) {
    const newPassword = form.get('newPassword');
    const confirmPassword = form.get('confirmPassword');

    if (newPassword.value !== confirmPassword.value) {
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

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.getUserById(userId);

      // Subscribe to user data changes
      this.userService.selectedUser.subscribe(user => {
        if (user) {
          this.profileForm.patchValue({
            name: user.name,
            email: user.email,
          });
        }
      });
    }
  }

  protected isProfileFieldInvalid(field: string): boolean {
    const control = this.profileForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  protected getProfileFieldErrorMessage(field: string): string {
    const control = this.profileForm.get(field);

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

    return '';
  }

  protected isPasswordFieldInvalid(field: string): boolean {
    const control = this.passwordForm.get(field);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  protected getPasswordFieldErrorMessage(field: string): string {
    const control = this.passwordForm.get(field);

    if (!control || !control.errors) {
      return '';
    }

    if (field === 'currentPassword') {
      if (control.errors['required']) {
        return 'A senha atual é obrigatória';
      }
    }

    if (field === 'newPassword') {
      if (control.errors['required']) {
        return 'A nova senha é obrigatória';
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

  protected onUpdateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      return;
    }

    const { name, email } = this.profileForm.value;

    this.userService
      .updateUser({
        id: userId,
        name: name!,
        email: email!,
        isActive: true,
        updatedBy: userId,
      })
      .subscribe();
  }

  protected onChangePassword(): void {
    if (this.passwordForm.invalid) {
      return;
    }

    const userId = this.authService.getUserId();
    if (!userId) {
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.userService
      .changePassword({
        userId,
        currentPassword: currentPassword!,
        newPassword: newPassword!,
      })
      .subscribe(success => {
        if (success) {
          this.passwordForm.reset();
        }
      });
  }
}
