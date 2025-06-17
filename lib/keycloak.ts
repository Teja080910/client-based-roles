// lib/getKeycloakClient.ts
import KcAdminClient from "keycloak-admin";

export async function getKeycloakClient(username?: string, password?: string, clientId?: string, grantType?: any) {
  const kc = new KcAdminClient({
    baseUrl: process.env.KEYCLOAK_URL,
    realmName: process.env.KEYCLOAK_REALM,
  });

  await kc.auth({
    username: username || process.env.KEYCLOAK_ADMIN_USER,
    password: password || process.env.KEYCLOAK_ADMIN_PASSWORD,
    grantType: grantType || "password",
    clientId: clientId || process.env.KEYCLOAK_ADMIN_CLIENT_ID!,
  });

  return kc;
}
