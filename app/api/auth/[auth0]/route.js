import { handleAuth, handleLogin, handleLogout } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';

const logoutUrl = `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?client_id=${process.env.AUTH0_CLIENT_ID}&returnTo=${process.env.AUTH0_BASE_URL}`;

export const GET = handleAuth({
  signup: handleLogin({
    authorizationParams: { 
      screen_hint: 'signup',
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile email read:plan delete:plans update:plans read:messages'
    },
    returnTo: `${process.env.AUTH0_BASE_URL}/signup`
  }),
  login: handleLogin({
    authorizationParams: {
      audience: process.env.AUTH0_AUDIENCE,
      scope: 'openid profile email read:plan delete:plans update:plans read:messages'
    },
    returnTo: `${process.env.AUTH0_BASE_URL}/feed`
  }),
  logout: handleLogout({
    returnTo: logoutUrl
  }),
  onError: (error, req, res) => {
    console.error('Authentication error:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode
    });
    
    // Redirect to a custom error page with error info
    const errorUrl = new URL('/auth/error', process.env.AUTH0_BASE_URL);
    errorUrl.searchParams.set('error', error.message || 'Authentication failed');
    
    return NextResponse.redirect(errorUrl.toString());
  },
});
