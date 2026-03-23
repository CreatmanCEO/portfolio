import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user }) {
      // Only allow the authorized email
      const authorizedEmail = process.env.AUTHORIZED_EMAIL
      if (!authorizedEmail) {
        console.error('[Auth] AUTHORIZED_EMAIL not set')
        return false
      }
      return user.email === authorizedEmail
    },
    async session({ session, token }) {
      // Pass user info to session
      if (token.sub) {
        session.user.id = token.sub
      }
      return session
    },
  },
  pages: {
    signIn: '/creatsetup/login',
    error: '/creatsetup/login',
  },
})
