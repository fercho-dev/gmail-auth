import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const authOptions = {
  // pages: {
  //   signIn: "/login",
  // },
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'https://www.googleapis.com/auth/gmail.readonly openid email profile ',
        },
      },
    })
  ],
  callbacks: {
    jwt: async ({ token, account }) => {
      if (account?.access_token) {
        token.access_token = account.access_token;
        token.expires_at = account.expires_at;
      }
      return token;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
