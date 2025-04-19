import { defineConfig } from 'cypress';
import * as axe from 'axe-core';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5000',
    setupNodeEvents(on, config) {
      // Axe-core accessibility testing
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        table(message) {
          console.table(message);
          return null;
        }
      });
    },
    env: {
      hideXHR: true
    }
  }
});
