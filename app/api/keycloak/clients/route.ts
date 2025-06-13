import { policies, resources, roles, scopes } from "@/lib/default-client-data";
import { getKeycloakClient } from "@/lib/keycloak";
import { excludedClients } from "@/types/default-dashboard-values";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const kcAdminClient = await getKeycloakClient();
    const clients = await kcAdminClient.clients.find();
    const myClients = clients.filter(
      (client: any) => !excludedClients.includes(client.clientId || '')
    );
    return NextResponse.json(myClients);
  } catch (error: any) {
    console.error("🔴 Error fetching clients:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const { clientId, name, description } = await req.json();
  try {
    const kcAdminClient = await getKeycloakClient();
    const existingClient = await kcAdminClient.clients.find({ clientId: clientId });
    let clientid;
    if (!existingClient || existingClient.length === 0) {
      const newClient = await kcAdminClient.clients.create({
        clientId,
        name,
        description,
        enabled: true,
        clientAuthenticatorType: "client-secret",
        redirectUris: [
          "http://localhost*",
          "http://192.168.1.*",
          "https://dev-bx-fe.artofliving.org*",
          "https://dev-bx.artofliving.org*"
        ],
        webOrigins: ["+"],
        standardFlowEnabled: true,
        implicitFlowEnabled: false,
        directAccessGrantsEnabled: true,
        serviceAccountsEnabled: true,
        authorizationServicesEnabled: true,
        publicClient: false,
        protocol: "openid-connect",
        attributes: {
          "login_theme": "keycloakify-starter",
          "post.logout.redirect.uris": "+"
        },
        fullScopeAllowed: true,
        authorizationSettings: {
          allowRemoteResourceManagement: true,
        }
      });
      console.log('Created new client:', newClient);
      clientid = newClient.id;
    } else {
      const updatedClient = await kcAdminClient.clients.update({ id: existingClient[0].id! }, {
        name,
        description,
        enabled: true,
        clientAuthenticatorType: "client-secret",
        redirectUris: [
          "http://localhost*",
          "http://192.168.1.*",
          "https://dev-bx-fe.artofliving.org*",
          "https://dev-bx.artofliving.org*"
        ],
        webOrigins: ["+"],
        standardFlowEnabled: true,
        implicitFlowEnabled: false,
        directAccessGrantsEnabled: true,
        serviceAccountsEnabled: true,
        authorizationServicesEnabled: true,
        publicClient: false,
        protocol: "openid-connect",
        attributes: {
          "login_theme": "keycloakify-starter",
          "post.logout.redirect.uris": "+"
        },
        fullScopeAllowed: true,
        authorizationSettings: {
          allowRemoteResourceManagement: true,
        }
      });
      console.log('Updated existing client:', updatedClient);
      clientid = existingClient[0].id!;
    }

    // add roles to the client
    const existingRoles = await kcAdminClient.clients.listRoles({ id: clientid });
    const roleNames = roles.filter((role: any) => !existingRoles.some((r: any) => r.name === role));
    for (const role of roleNames) {
      await kcAdminClient.clients.createRole({
        id: clientid,
        name: role,
        description: '',
        composite: false,
        clientRole: true,
        attributes: {}
      });
    }
    console.log('Added roles to client:', clientid);

    // add scopes to the client
    const existingScopes = await kcAdminClient.clients.listAllScopes({ id: clientid });
    const scopeNames = scopes.filter((scope: any) => !existingScopes.some((s: any) => s.name === scope));
    for (const scope of scopeNames) {
      await kcAdminClient.clients.createAuthorizationScope(
        { id: clientid, },
        {
          name: scope,
        }
      );
    }
    console.log('Added scopes to client:', clientid);

    // add resource server to the client
    const existingResourceServer = await kcAdminClient.clients.listResources({ id: clientid });
    const resourceNames = resources.filter((resource: any) => !existingResourceServer.some((r: any) => r.name === resource));
    const scopesList = scopes.map((scope: any) => ({ resource: scope.split(':')[0], scope: scope }));
    for (const resource of resourceNames) {
      await kcAdminClient.clients.createResource(
        { id: clientid },
        {
          name: resource,
          ownerManagedAccess: true,
          scopes: scopesList.filter((s: any) => s.resource === resource).map((s: any) => s.scope),
        }
      );
    }

    // add policies to the client
    const existingPolicies = await kcAdminClient.clients.listPolicies({ id: clientid });
    const policyNames = policies.filter((policy: any) => !existingPolicies.some((p: any) => p.name === policy.name));
    for (const policy of policyNames) {
      if (policy.type === 'role') {
        await kcAdminClient.clients.createPolicy(
          { id: clientid, type: policy.type },
          {
            name: policy.name,
            type: policy.type,
            logic: policy.logic as any,
            decisionStrategy: policy.decisionStrategy! as any,
            config: {
              roles: [{ id: "dc4ace7b-3c68-466d-b9a6-7f513d08b162", required: false }],
            }
          }
        );
      }
      if (policy.type === 'aggregate') {
        await kcAdminClient.clients.createPolicy(
          { id: clientid, type: 'role' },
          {
            name: policy.name,
            type: 'role',
            logic: policy.logic as any,
            decisionStrategy: policy.decisionStrategy! as any,
            config: {
              applyPolicies: policy.config.applyPolicies || [],
            }
          }
        );
      }
      if (policy.type === 'user') {
        await kcAdminClient.clients.createPolicy(
          { id: clientid, type: policy.type },
          {
            name: policy.name,
            type: policy.type,
            logic: policy.logic as any,
            decisionStrategy: policy.decisionStrategy! as any,
            config: {
              users: policy.config.users || [],
            }
          }
        );
      }
      if (policy.type === 'scope') {
        const resources = policy.config.scopes?.map((scope) => scope.split(':')[0]) || [];
        const scopes = policy.config.scopes?.map((scope) => scope) || [];
        await kcAdminClient.clients.createPermission(
          { id: clientid, type: policy.type },
          {
            name: policy.name,
            type: policy.type,
            resources: resources || [],
            scopes: scopes || [],
            policies: policy.config.applyPolicies || [],
          }
        );
      }
    }
    console.log('Added policies to client:', clientid);
    return NextResponse.json(clientid);
  } catch (error: any) {
    console.error("🔴 Error creating client:", error.toJSON());
    const kcAdminClient = await getKeycloakClient();
    const existingClient = await kcAdminClient.clients.find({ clientId: clientId });
    await kcAdminClient.clients.del({ id: existingClient[0].id! });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};
