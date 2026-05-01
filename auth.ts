import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  providers: [
    credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Email and Password are required");
        }

        const authBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
        if (!authBaseUrl) {
          throw new Error("NEXT_PUBLIC_BASE_URL is not set");
        }

        let res: Response;
        try {
          res = await fetch(`${authBaseUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });
        } catch {
          throw new Error(
            "Unable to reach auth service. Check NEXT_PUBLIC_BASE_URL and make sure the API is running."
          );
        }

        console.log("res", res);

        const json = await res.json().catch(() => null);

        if (res.ok && json?.data) {
          const data = json.data;
          const user = data.user ?? data;
          const token =
            data.token ?? data.access_token ?? data.accessToken ?? user?.token;

          if (user && token) {
            const resolvedRole =
              typeof user.role === "object" && user.role !== null
                ? user.role.name
                : user.role ?? user.typeName ?? user.type;
            // Return the user object which will be stored in the JWT
            return {
              id: user.id,
              name: user.name,
              email: user.email,
              role:
                typeof resolvedRole === "string"
                  ? resolvedRole.toUpperCase()
                  : resolvedRole,
              token: token,
            };
          }
        }

        return null;
      },
    }),
  ],

  callbacks: {
    async authorized({ request, auth }) {
      const { pathname } = request.nextUrl;
      if (pathname.startsWith("/admin")) {
        return auth?.user?.role === "ADMIN";
      }
      return true;
    },
    // Handle JWT
    async jwt({ token, user }) {
      if (user) {
        // Store the user data and token in the JWT
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.role = user.role;
        token.token = user.token;
      }
      return token;
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        name: token.name as string,
        email: token.email as string,
        role: token.role as string,
        token: token.token as string,
      };
      return session;
    },
  },
});
