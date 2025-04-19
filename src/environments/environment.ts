export const environment = {
  production: false,
  apiUrl: 'https://api.nameempresa.com/api/v1',
  mockAuth: true, // Use mock authentication service in development
  keycloak: {
    url: 'https://keycloak.nameempresa.com/auth',
    realm: 'nameempresa',
    clientId: 'nameempresa-frontend'
  }
};