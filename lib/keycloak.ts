import KcAdminClient from "keycloak-admin";

export async function getKeycloakClient() {
  const kc = new KcAdminClient({
    baseUrl: process.env.KEYCLOAK_URL,
    realmName: process.env.KEYCLOAK_REALM,
  });

  await kc.auth({
    username: process.env.KEYCLOAK_ADMIN_USER,
    password: process.env.KEYCLOAK_ADMIN_PASSWORD,
    grantType: "password",
    clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID!,
  });

  return kc;
}
