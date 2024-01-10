import { getServerSession } from 'next-auth'

export const session = async ({ session, token }) => {
  if (token?.access_token) {
    session.user.access_token = token.access_token
    session.user.expires_at = token.expires_at
  }
  return session
}

export const getUserSession = async () => {
  const authUserSession = await getServerSession({
    callbacks: {
      session,
    },
  })
  // if (!authUserSession) throw new Error('unauthorized')
  return authUserSession?.user
}