import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

export const authOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET || undefined,
      issuer: process.env.COGNITO_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Persist Cognito groups from id_token into JWT token for session continuity
      if (profile?.["cognito:groups"]) {
        token.groups = profile["cognito:groups"];
      }
      return token;
    },
    async session({ session, token }) {
      // Attach user ID and groups from token to session object
      session.userId = token.sub;
      session.groups = token.groups || [];
      return session;
    },
  },
  debug: true, // enable verbose logs during development; disable in production
  session: {
    strategy: "jwt", // use JWT-based sessions (recommended for stateless auth)
  },
  secret: process.env.NEXTAUTH_SECRET, // ensure this is set securely in your environment
};

// Export NextAuth handler for both GET and POST (Next.js route handler)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
