import NextAuth from "next-auth"
import CognitoProvider from "next-auth/providers/cognito"

export const authOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID,
      clientSecret: process.env.COGNITO_CLIENT_SECRET || "none",
      issuer: process.env.COGNITO_ISSUER
    })
  ],
  callbacks: {
    async session({ session, token }) {
      session.userId = token.sub;
      session.groups = token["cognito:groups"] || [];
      return session;
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
