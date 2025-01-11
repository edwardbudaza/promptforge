'use client';
const { GoogleOAuthProvider } = require('@react-oauth/google');

export function AuthProvider({ children }) {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
      {children}
    </GoogleOAuthProvider>
  );
}
