import { Injectable, signal } from '@angular/core';
import { translations } from './translations';

type SupportedLanguage = 'pt' | 'en';

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLanguageSignal = signal<SupportedLanguage>('pt');

  public currentLanguage = this.currentLanguageSignal.asReadonly();

  constructor() {
    // Inicializar com a língua do navegador ou padrão
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
    this.setLanguage(browserLang in translations ? browserLang : 'pt');
  }

  setLanguage(lang: SupportedLanguage): void {
    this.currentLanguageSignal.set(lang);
    document.documentElement.lang = lang;
  }

  translate(key: string): string {
    const keys = key.split('.');
    let result = translations[this.currentLanguageSignal()];

    for (const k of keys) {
      if (result && k in result) {
        result = result[k];
      } else {
        return key; // Fallback para a chave se não encontrar tradução
      }
    }

    return result as string;
  }
}
