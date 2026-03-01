import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      image: string;
      isProfileComplete: boolean;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    backendAccessToken: string;
    userId: string;
    isProfileComplete: boolean;
  }
}
