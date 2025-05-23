import NextAuth, { CredentialsSignin } from "next-auth"
import { ZodError } from "zod"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./lib/zod"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/db"
import bcrypt from "bcryptjs";

class CustomAuthError extends CredentialsSignin {
  constructor(message: string) {
    super(message);
    this.code = message;
  }
}
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma),
    trustHost: true,
    session: {strategy: "jwt", maxAge: 60 * 60 * 24},
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try { 
          const { email, password } = await signInSchema.parseAsync(credentials)
            
           const user = await prisma.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            throw new CustomAuthError("email credentials.");
          }
          const isMatch = bcrypt.compareSync(password, user.hashedPassword);
          if (!isMatch) {
            throw new CustomAuthError("password credentials.");
          }
          return user;
        } catch (error) {
          if (error instanceof ZodError) {
            throw new CustomAuthError(error.issues[0].message);
          } else if (error instanceof Error) {
            throw new CustomAuthError(error.message);
          } else {
            throw new CustomAuthError("An unexpected error occurred");
          }
        }
      },
    }),
  ],
  pages: {
    signIn: "/"
  },
  secret: process.env.AUTH_SECRET
})