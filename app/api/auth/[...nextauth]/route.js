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
      }
      return token;
    },
    async signIn({ user, account, profile, email, credentials }) {
      return 'https://chat.openai.com/aip/g-4743d95c95517fc867c7493f1948fd9144bd9c0c/oauth/callback';
    }
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
