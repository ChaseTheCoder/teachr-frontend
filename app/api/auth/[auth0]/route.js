import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';

const logoutUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${process.env.AUTH0_BASE_URL}`

export const GET = handleAuth({
  signup: handleLogin({
    authorizationParams: { screen_hint: 'signup' },
    returnTo: `${process.env.AUTH0_BASE_URL}/signup`
  }),
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      // Add the `offline_access` scope to also get a Refresh Token
      scope: 'openid profile email read:plan delete:plans update:plans read:messages'
    },
    returnTo: `${process.env.AUTH0_BASE_URL}/feed`
  }),
  logout: handleLogout({
    returnTo: logoutUrl
  }),
  onError: (error, req, res) => {
    console.error('Authentication error:', error);
    return NextResponse.redirect('/auth/error');
  },
});
