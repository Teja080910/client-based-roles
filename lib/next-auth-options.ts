import { AuthOptions, TokenSet } from "next-auth";
import { JWT } from "next-auth/jwt";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions: AuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID!,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
            issuer: `${process.env.KEYCLOAK_ISSUER}/realms/${process.env.KEYCLOAK_REALM}`,
        })
    ],
    session: {
        strategy: "jwt",
        // maxAge: 60 * 2
    },
    // cookies: {
    //     sessionToken: {
    //         name: `__Secure-next-auth.session-token`,
    //         options: {
    //             httpOnly: true,
    //             sameSite: "lax",
    //             secure: true,
    //             path: "/",
    //             domain: '.sample.org',
    //         },
    //     },
    // },
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.idToken = account.id_token
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                token.expiresAt = account.expires_at
                return token
            }
            // we take a buffer of sixty seconds (60 * 1000 ms)
            if (Date.now() < (Number(token.expiresAt) * 1000 - 60 * 1000)) {
                return token
            } else {
                try {
                    const response = await requestRefreshOfAccessToken(token)

                    const tokens: TokenSet = await response.json()

                    if (!response.ok) {
                        return { ...token, error: "RefreshAccessTokenError" }
                    }

                    const updatedToken: JWT = {
                        ...token, // Keep the previous token properties
                        idToken: tokens.id_token,
                        accessToken: tokens.access_token,
                        expiresAt: Math.floor(Date.now() / 1000 + (tokens.expires_in as number)),
                        refreshToken: tokens.refresh_token ?? token.refreshToken,
                    }
                    return updatedToken
                } catch (error) {
                    return { ...token, error: "RefreshAccessTokenError" }
                }
            }
        },
        async session({ session, token }) {
            (session as any).accessToken = token.accessToken,
                (session as any).expires_at = token.expiresAt,
                (session as any).error = token.error;
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET
}

function requestRefreshOfAccessToken(token: JWT) {
    return fetch(`${process.env.KEYCLOAK_ISSUER}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/token`, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: process.env.KEYCLOAK_CLIENT_ID!,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET!,
            grant_type: "refresh_token",
            refresh_token: String(token.refreshToken!),
        }),
        method: "POST",
        cache: "no-store"
    });
}