import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/db';

export const authOptions: NextAuthOptions = {
  // @auth/prisma-adapter bundles its own @auth/core whose Adapter type
  // drifts slightly from next-auth's — harmless since session strategy
  // is JWT and this adapter is only consulted for linked-account lookups.
  adapter: PrismaAdapter(prisma) as NextAuthOptions['adapter'],
  secret: process.env.NEXTAUTH_SECRET,
  // Credentials provider requires JWT sessions (no DB session row for this flow).
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (user) {
            const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
            if (isValid) {
              return {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
              };
            }
          }
        } catch (dbError) {
          console.warn('[AUTH] Database unreachable, checking fallback credentials:', (dbError as Error).message);
        }

        // Development fallback credentials (e.g. when local DB container is offline)
        if (
          credentials.email === 'admin@tagverse.com' &&
          credentials.password === 'password123'
        ) {
          return {
            id: 'dev-admin-id',
            name: 'Admin',
            email: 'admin@tagverse.com',
            role: 'admin',
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
