import { describe, beforeEach, it } from 'cypress';

describe('Perfil de Usuário', () => {
  beforeEach(() => {
    // Simular usuário logado
    cy.window().then(win => {
      win.localStorage.setItem('accessToken', 'fake-token');
      win.localStorage.setItem('refreshToken', 'fake-refresh-token');
      win.localStorage.setItem(
        'user',
        JSON.stringify({ name: 'Usuário Teste', email: 'usuario@exemplo.com' })
      );
    });

    // Interceptar chamadas de API
    cy.intercept('GET', '/api/Users/GetById/*', { fixture: 'user-profile.json' }).as(
      'getUserProfile'
    );
    cy.intercept('PUT', '/api/Users/Update', { fixture: 'user-update-success.json' }).as(
      'updateUser'
    );
    cy.intercept('POST', '/api/Users/ChangePassword', {
      fixture: 'change-password-success.json',
    }).as('changePassword');
  });

  it('deve carregar o perfil do usuário', () => {
    cy.visit('/profile');
    cy.wait('@getUserProfile');

    cy.get('input[formControlName="name"]').should('have.value', 'Usuário Teste');
    cy.get('input[formControlName="email"]').should('have.value', 'usuario@exemplo.com');
  });

  it('deve atualizar o perfil do usuário', () => {
    cy.visit('/profile');
    cy.wait('@getUserProfile');

    cy.get('input[formControlName="name"]').clear().type('Nome Atualizado');
    cy.get('form').first().submit();

    cy.wait('@updateUser');
    cy.contains('Usuário atualizado com sucesso').should('be.visible');
  });

  it('deve alterar a senha do usuário', () => {
    cy.visit('/profile');

    cy.get('input[formControlName="currentPassword"]').type('senhaAtual');
    cy.get('input[formControlName="newPassword"]').type('novaSenha123');
    cy.get('input[formControlName="confirmPassword"]').type('novaSenha123');
    cy.get('form').eq(1).submit();

    cy.wait('@changePassword');
    cy.contains('Senha alterada com sucesso').should('be.visible');
  });

  it('deve mostrar erro quando as senhas não coincidem', () => {
    cy.visit('/profile');

    cy.get('input[formControlName="currentPassword"]').type('senhaAtual');
    cy.get('input[formControlName="newPassword"]').type('novaSenha123');
    cy.get('input[formControlName="confirmPassword"]').type('senhaErrada');
    cy.get('input[formControlName="confirmPassword"]').blur();

    cy.contains('As senhas não coincidem').should('be.visible');
    cy.get('form').eq(1).find('button[type="submit"]').should('be.disabled');
  });
});
