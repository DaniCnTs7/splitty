import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { connectDB } from './lib/db'
import { User } from '@/models/User'

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      await connectDB()
      const existing = await User.findOne({ email: user.email })
      if (!existing) {
        await User.create({ email: user.email, name: user.name })
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) {
        await connectDB()
        const dbUser = await User.findOne({ email: token.email })
        if (dbUser) token.id = dbUser._id.toString()
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    },
  },
})
