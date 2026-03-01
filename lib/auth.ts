import { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, account, trigger, session }) {
      // On first sign-in, exchange Google ID token for backend JWT
      if (account?.id_token) {
        try {
          const res = await fetch(
            `${process.env.BACKEND_URL}/api/auth/google`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken: account.id_token }),
            },
          );

          if (res.ok) {
            const data = await res.json();
            token.backendAccessToken = data.accessToken;
            token.userId = data.user.id;
            token.isProfileComplete = data.user.isProfileComplete;
          }
        } catch (err) {
          console.error('Backend auth error:', err);
        }
      }

      // When the client calls `session.update(...)`, propagate changes into the JWT
      if (trigger === 'update' && session?.user) {
        // Only update fields we care about
        if (typeof session.user.isProfileComplete !== 'undefined') {
          token.isProfileComplete = session.user.isProfileComplete;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.backendAccessToken;
      session.user.id = token.userId;
      session.user.isProfileComplete = token.isProfileComplete;
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
};
