import { Injectable, signal, effect } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSignal = signal<Theme>('light');

  public theme = this.themeSignal.asReadonly();

  constructor() {
    // Inicializar com preferência do usuário ou sistema
    this.initTheme();

    // Efeito para atualizar o atributo data-theme no documento
    effect(() => {
      document.documentElement.setAttribute('data-theme', this.themeSignal());
    });
  }

  private initTheme(): void {
    // Verificar preferência salva
    const savedTheme = localStorage.getItem('theme') as Theme | null;

    if (savedTheme) {
      this.themeSignal.set(savedTheme);
    } else {
      // Verificar preferência do sistema
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.themeSignal.set(prefersDark ? 'dark' : 'light');
    }
  }

  toggleTheme(): void {
    const newTheme = this.themeSignal() === 'light' ? 'dark' : 'light';
    this.themeSignal.set(newTheme);
    localStorage.setItem('theme', newTheme);
  }

  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
    localStorage.setItem('theme', theme);
  }
}
