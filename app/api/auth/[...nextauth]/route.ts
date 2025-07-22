import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { query } from '@/lib/db';

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          console.log('Attempting to authenticate user:', credentials.email);

          const result = await query(
            'SELECT * FROM users WHERE email = $1 AND is_active = true',
            [credentials.email]
          );

          console.log('Database query result:', result.rows.length, 'users found');

          if (result.rows.length === 0) {
            console.log('No user found with email:', credentials.email);
            return null;
          }

          const user = result.rows[0];
          console.log('Found user:', user.email, 'with role:', user.role);

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash);
          console.log('Password valid:', isPasswordValid);

          if (!isPasswordValid) {
            console.log('Invalid password for user:', credentials.email);
            return null;
          }

          const authUser = {
            id: user.id,
            email: user.email,
            name: `${user.first_name} ${user.last_name}`,
            role: user.role,
          };

          console.log('Authentication successful for user:', authUser);
          return authUser;
        } catch (error) {
          console.error('Auth database error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log('JWT callback - token:', !!token, 'user:', !!user);
      if (user) {
        token.role = user.role;
        console.log('JWT callback - added role to token:', user.role);
      }
      return token;
    },
    async session({ session, token }) {
      console.log('Session callback - session:', !!session, 'token:', !!token);
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role;
        console.log('Session callback - final session:', session.user);
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  trustHost: true,
});

export { handler as GET, handler as POST };
