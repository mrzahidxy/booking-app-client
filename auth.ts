import NextAuth from "next-auth";
import credentials from "next-auth/providers/credentials";
import { hasTenantMemberships } from "@/shared/lib/session";

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
            const rawTenantMembership = user.tenantMembership
              ?? (Array.isArray(user.tenantMemberships)
                ? user.tenantMemberships[0]
                : null);
            const tenantMembership = rawTenantMembership
              ? {
                  tenantId: rawTenantMembership.tenantId,
                  role: rawTenantMembership.role,
                  tenant: rawTenantMembership.tenant
                    ? {
                        id: rawTenantMembership.tenant.id,
                        name: rawTenantMembership.tenant.name,
                        slug: rawTenantMembership.tenant.slug,
                        isActive: rawTenantMembership.tenant.isActive,
                      }
                    : undefined,
                }
              : undefined;
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
              tenantMembership,
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
        const hasTenantAccess = hasTenantMemberships(auth as any);
        return auth?.user?.role === "ADMIN" || hasTenantAccess;
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
        token.tenantMembership = (user as any).tenantMembership;
        token.tenantMemberships = (user as any).tenantMembership
          ? [(user as any).tenantMembership]
          : (user as any).tenantMemberships ?? [];
      }
      return token;
    },

    async session({ session, token }) {
      const currentUser = session.user as typeof session.user & {
        id?: string;
        role?: string;
        token?: string;
        tenantMembership?: any;
        tenantMemberships?: any[];
      };

      currentUser.id = String(token.id ?? "");
      currentUser.name = token.name as string;
      currentUser.email = token.email as string;
      currentUser.role = token.role as string;
      currentUser.token = token.token as string;
      currentUser.tenantMembership = (token as any).tenantMembership;
      currentUser.tenantMemberships = (token as any).tenantMembership
        ? [(token as any).tenantMembership]
        : (token as any).tenantMemberships ?? [];
      session.user = currentUser;
      return session;
    },
  },
});
