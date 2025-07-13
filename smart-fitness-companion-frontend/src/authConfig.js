export const authConfig = {
  clientId: import.meta.env.VITE_CLIENT_ID || "myClientID",
  authorizationEndpoint:
    import.meta.env.VITE_AUTH_ENDPOINT || "https://myAuthProvider.com/auth",
  tokenEndpoint:
    import.meta.env.VITE_TOKEN_ENDPOINT || "https://myAuthProvider.com/token",
  redirectUri: import.meta.env.VITE_REDIRECT_URI || "http://localhost:5173/",
  scope: "openid profile email offline_access",
  onRefreshTokenExpire: (event) => event.logIn(),
};
