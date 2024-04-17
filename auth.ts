import NextAuth from "next-auth"

import AzureB2C from "next-auth/providers/azure-ad-b2c"

import type { NextAuthConfig } from "next-auth"

const B2C_TENANT_ID = process.env.AUTH_AZURE_AD_B2C_TENANT
const B2C_TENANT_NAME = "<tenant_name>"
const B2C_CLIENT_ID = process.env.AUTH_AZURE_AD_B2C_ID
const B2C_POLICY = "<policy>"
const B2C_CLIENT_SECRET = process.env.AUTH_AZURE_AD_B2C_SECRET

export const config = {
  theme: { logo: "https://authjs.dev/img/logo-sm.png" },
  providers: [
    // I have this config working for my real world project. Simply replace with a working B2C application details
    AzureB2C({
      id: "test-b2c",
      issuer: `https://${B2C_TENANT_NAME}.b2clogin.com/${B2C_TENANT_ID}/v2.0/`,
      wellKnown: `https://${B2C_TENANT_NAME}.b2clogin.com/${B2C_TENANT_NAME}.onmicrosoft.com/${B2C_POLICY}/v2.0/.well-known/openid-configuration`,
      authorization: {
        url: `https://${B2C_TENANT_NAME}.b2clogin.com/${B2C_TENANT_NAME}.onmicrosoft.com/${B2C_POLICY}/oauth2/v2.0/authorize`,
        params: { scope: B2C_CLIENT_ID },
      },
      token: `https://${B2C_TENANT_NAME}.b2clogin.com/${B2C_TENANT_NAME}.onmicrosoft.com/${B2C_POLICY}/oauth2/v2.0/token`,
      clientId: B2C_CLIENT_ID,
      clientSecret: B2C_CLIENT_SECRET,
    }),
  ],
  basePath: "/auth",
  callbacks: {
    authorized({ request, auth }) {
      const { pathname } = request.nextUrl
      if (pathname === "/middleware-example") return !!auth
      return true
    },
    jwt({ token, trigger, session }) {
      if (trigger === "update") token.name = session.user.name
      return token
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
