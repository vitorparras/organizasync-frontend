import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  template: `
    <div class="app-container">
      <router-outlet></router-outlet>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class AppComponent implements OnInit {
  constructor(
    private translateService: TranslateService,
    private themeService: ThemeService
  ) {
    // Initialize i18n
    translateService.addLangs(['en', 'pt-BR']);
    translateService.setDefaultLang('en');
    
    // Try to use browser language or fall back to default
    const browserLang = translateService.getBrowserLang();
    translateService.use(browserLang?.match(/en|pt-BR/) ? browserLang : 'en');
  }
  
  ngOnInit(): void {
    // Initialize theme based on user preference
    this.themeService.initTheme();
  }
}