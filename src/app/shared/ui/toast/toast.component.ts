import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '@shared/services/toast.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  protected toastService = inject(ToastService);
}
