import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSignal = signal<Toast[]>([]);

  public toasts = this.toastsSignal.asReadonly();

  show(toast: Omit<Toast, 'id'>): void {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast: Toast = {
      id,
      title: toast.title,
      description: toast.description,
      variant: toast.variant || 'default',
      duration: toast.duration || 5000,
    };

    this.toastsSignal.update(toasts => [...toasts, newToast]);

    // Auto-remove after duration
    setTimeout(() => {
      this.dismiss(id);
    }, newToast.duration);
  }

  dismiss(id: string): void {
    this.toastsSignal.update(toasts => toasts.filter(t => t.id !== id));
  }

  dismissAll(): void {
    this.toastsSignal.set([]);
  }
}
