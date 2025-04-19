import { KeycloakService } from 'keycloak-angular';
import { environment } from '../../../environments/environment';

/**
 * Initialize the Keycloak instance for the application
 */
export function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
  return (): Promise<boolean> => {
    return new Promise(async (resolve, reject) => {
      try {
        await keycloak.init({
          config: {
            url: environment.keycloak.url,
            realm: environment.keycloak.realm,
            clientId: environment.keycloak.clientId
          },
          initOptions: {
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/assets/silent-check-sso.html',
            checkLoginIframe: false,
            enableLogging: !environment.production
          },
          enableBearerInterceptor: true,
          bearerPrefix: 'Bearer',
          bearerExcludedUrls: [
            '/assets'
          ],
          loadUserProfileAtStartUp: true
        });
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  };
}
