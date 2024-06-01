import Keycloak from "keycloak-js";

//no longer used

import getConfiguration from "./config";

const keycloakService = new Keycloak(getConfiguration('keycloak'));

const initKeycloak = (onAuthenticatedCallback) => {
  console.log("runiing init..!");
  keycloakService.init({
    // onLoad: 'login-required',
    onLoad: 'check-sso',
    // silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
    pkceMethod: 'S256',
    // redirectUri: 'http://localhost:3000', 
    checkLoginIframe: true
  })
    .then((authenticated) => {
      if (!authenticated) {
        console.log("user is not authenticated..!");
      }
      onAuthenticatedCallback()
    })
    .catch(console.error);
};


const redirectToLogin = () => {
  keycloakService.logout();
  keycloakService.login();
};

const redirectToLogout = keycloakService.logout;

const redirectToRegister = keycloakService.register;

const getToken = () => keycloakService.token;

const isLoggedIn = () => !!keycloakService.token;

const hasRole = (roles) => roles.some((role) => keycloakService.hasRealmRole(role));

const isAdmin = () => keycloakService.hasRealmRole('TimelineAdmin');

const updateToken = (successCallback) =>
  keycloakService.updateToken(5)
    .then(successCallback)
    .catch(redirectToLogin);

const getUsername = () => keycloakService.tokenParsed?.preferred_username;

const getUserId = () => keycloakService.tokenParsed?.sub

const AuthService = {
  initKeycloak,
  redirectToLogin,
  redirectToLogout,
  isLoggedIn,
  getToken,
  updateToken,
  getUsername,
  getUserId,
  hasRole,
  isAdmin,
  redirectToRegister
};

export default AuthService;
