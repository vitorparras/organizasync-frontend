// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands')

import { mount } from 'cypress/angular';

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);

// Example use:
// cy.mount(MyComponent)

// Comando personalizado para login
Cypress.Commands.add('login', () => {
  // Simular login armazenando token no localStorage
  localStorage.setItem('accessToken', 'fake-jwt-token');
  localStorage.setItem('refreshToken', 'fake-refresh-token');

  // Simular usuário logado
  const user = {
    name: 'Usuário Teste',
    email: 'usuario@exemplo.com',
  };

  localStorage.setItem('user', JSON.stringify(user));

  // Interceptar chamada de API para perfil do usuário
  cy.intercept('GET', '/api/Users/GetById/*', {
    statusCode: 200,
    body: {
      data: {
        id: '0195fd71-cd94-7d56-ae89-5748061f65a3',
        name: 'Usuário Teste',
        email: 'usuario@exemplo.com',
        isActive: true,
        createdAt: '2023-01-01T00:00:00Z',
        updatedAt: '2023-01-01T00:00:00Z',
      },
      success: true,
      message: 'Usuário encontrado com sucesso',
      errors: [],
    },
  });
});
