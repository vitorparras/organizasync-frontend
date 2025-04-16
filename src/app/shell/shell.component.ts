import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '@core/application/auth/auth.service';
import { ToastComponent } from '@shared/ui/toast/toast.component';
import { ButtonComponent } from '@shared/ui/button/button.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent, ToastComponent],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss'],
})
export class ShellComponent {
  protected authService = inject(AuthService);
  protected currentYear = new Date().getFullYear();
}
