import KcAdminClient from 'keycloak-admin';

console.log(process.env.KEYCLOAK_URL, process.env.KEYCLOAK_REALM, process.env.KEYCLOAK_ADMIN_USER, process.env.KEYCLOAK_ADMIN_PASSWORD, process.env.KEYCLOAK_ADMIN_CLIENT_ID);
if (!process.env.KEYCLOAK_URL || !process.env.KEYCLOAK_REALM || !process.env.KEYCLOAK_ADMIN_USER || !process.env.KEYCLOAK_ADMIN_PASSWORD || !process.env.KEYCLOAK_ADMIN_CLIENT_ID) {
  throw new Error('Missing Keycloak environment variables');
}

const kcAdminClient = new KcAdminClient({
  baseUrl: process.env.KEYCLOAK_URL,
  realmName: process.env.KEYCLOAK_REALM,
});

try {
  await kcAdminClient.auth({
    username: process.env.KEYCLOAK_ADMIN_USER,
    password: process.env.KEYCLOAK_ADMIN_PASSWORD,
    grantType: 'password',
    clientId: process.env.KEYCLOAK_ADMIN_CLIENT_ID!,
  });
} catch (err: any) {
  console.error("🔴 AUTH ERROR", err.response?.data || err.message || err);
  throw new Error("Keycloak authentication failed");
}

export default kcAdminClient;
