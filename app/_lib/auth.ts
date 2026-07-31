import { AuthOptions, DefaultSession } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { db } from "@/app/_lib/prisma"
import { Adapter } from "next-auth/adapters"

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      barbeariaId?: string;
      role: "admin" | "client";
      adminRole?: string;
    };
  }

  interface User {
    id: string;
  }
}

// Variável muito importante, pois vc pode resgatar a sessão do usuário logado
// passando ela como parâmetro da função getServerSession(authOptions)
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      const user = await db.user.findUnique({
        where: {
          id: token.sub,
        },
      });

      if (user) {
        session.user.name = user.name ?? session.user.name;
      }

      const administrador = await db.administrador.findUnique({
        where: {
          email: session.user.email!,
        },
      });

      session.user.id = token.sub as string;

      if (administrador) {
        session.user.barbeariaId = administrador.barbeariaId;
        session.user.role = "admin";
        session.user.adminRole = administrador.role;
      } else {
        session.user.role = "client";
      }

      return session;
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
}