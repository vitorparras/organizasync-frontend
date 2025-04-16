import { describe, beforeEach, it } from 'cypress';

describe('Autenticação', () => {
  beforeEach(() => {
    // Interceptar chamadas de API
    cy.intercept('POST', '/api/Auth/Login', { fixture: 'login-success.json' }).as('login');
    cy.intercept('POST', '/api/Auth/Logout', { fixture: 'logout-success.json' }).as('logout');
  });

  it('deve fazer login com sucesso', () => {
    cy.visit('/auth/login');

    cy.get('input[formControlName="email"]').type('usuario@exemplo.com');
    cy.get('input[formControlName="password"]').type('senha123');
    cy.get('button[type="submit"]').click();

    cy.wait('@login');
    cy.url().should('include', '/profile');
  });

  it('deve mostrar erro com credenciais inválidas', () => {
    cy.intercept('POST', '/api/Auth/Login', {
      statusCode: 401,
      body: {
        success: false,
        message: 'Credenciais inválidas',
        errors: ['Email ou senha incorretos'],
        data: null,
      },
    }).as('loginFailed');

    cy.visit('/auth/login');

    cy.get('input[formControlName="email"]').type('invalido@exemplo.com');
    cy.get('input[formControlName="password"]').type('senhaerrada');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFailed');
    cy.contains('Credenciais inválidas').should('be.visible');
  });

  it('deve fazer logout com sucesso', () => {
    // Simular usuário logado
    cy.window().then(win => {
      win.localStorage.setItem('accessToken', 'fake-token');
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      win.localStorage.setItem(
        'user',
        JSON.stringify({ name: 'Usuário Teste', email: 'usuario@exemplo.com' })
      );
    });

    cy.visit('/profile');
    cy.contains('Sair').click();

    cy.wait('@logout');
    cy.url().should('include', '/auth/login');
  });
});
