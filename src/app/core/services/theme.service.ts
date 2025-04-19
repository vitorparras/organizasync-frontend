import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private theme = new BehaviorSubject<Theme>(this.getInitialTheme());
  
  // Expose as public observable for components to subscribe to
  public currentTheme$ = this.theme.asObservable();
  
  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  
  // Called at app initialization
  public initTheme(): void {
    this.applyTheme(this.theme.value);
  }
  
  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      return savedTheme;
    }
    
    // Check for system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }
  
  private applyTheme(theme: Theme): void {
    this.renderer.removeClass(document.body, 'light-theme');
    this.renderer.removeClass(document.body, 'dark-theme');
    this.renderer.addClass(document.body, `${theme}-theme`);
    localStorage.setItem('theme', theme);
  }
  
  public toggleTheme(): void {
    const newTheme = this.theme.value === 'light' ? 'dark' : 'light';
    this.theme.next(newTheme);
    this.applyTheme(newTheme);
  }
  
  public setTheme(theme: Theme): void {
    this.theme.next(theme);
    this.applyTheme(theme);
  }
  
  public getCurrentTheme(): Theme {
    return this.theme.value;
  }
  
  // Keeping the old method for backward compatibility
  public getTheme$(): Observable<Theme> {
    return this.theme.asObservable();
  }
}