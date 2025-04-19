export const environment = {
  production: true,
  apiUrl: 'https://api.nameempresa.com/api/v1',
  mockAuth: false, // Use real authentication service in production
  keycloak: {
    url: 'https://keycloak.nameempresa.com/auth',
    realm: 'nameempresa',
    clientId: 'nameempresa-frontend'
  }
};