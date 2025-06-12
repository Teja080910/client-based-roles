import { getKeycloakClient } from "@/lib/keycloak";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { clientId, name, copyData, description } = await req.json();

        if (!clientId || !copyData) {
            return NextResponse.json({ error: "clientId and copyData are required" }, { status: 400 });
        }

        const kcAdminClient = await getKeycloakClient();
        const existingClient = await kcAdminClient.clients.find({ clientId: clientId });
        let clientid;

        if (!existingClient || existingClient.length === 0) {
            const createdClient = await kcAdminClient.clients.create({
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
            console.log('Created new client:', createdClient);
            clientid = createdClient.id;
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

        // Copy roles
        console.log('Copying roles...', copyData.roles);
        const existingRoles = await kcAdminClient.clients.listRoles({ id: clientid });
        const roleNames = existingRoles.map((role: any) => role.name);
        for (const role of copyData.roles) {
            if (!roleNames.includes(role.name)) {
                await kcAdminClient.clients.createRole({
                    id: clientid,
                    name: role.name,
                    description: role.description || '',
                    composite: role.composite || false,
                    clientRole: role.clientRole || false,
                    attributes: role.attributes || {}
                });
                console.log(`Role ${role.name} copied successfully.`);
            } else {
                console.log(`Role ${role.name} already exists, skipping copy.`);
            }
        }

        // Copy scopes
        console.log('Copying scopes...', copyData.scopes);
        const existingScopes = await kcAdminClient.clients.listAllScopes({ id: clientid });
        const scopeNames = existingScopes.map((scope: any) => scope.name);
        for (const scope of copyData.scopes) {
            if (!scopeNames.includes(scope.name)) {
                await kcAdminClient.clients.createAuthorizationScope(
                    { id: clientid },
                    {
                        name: scope.name,
                        displayName: scope.displayName || '',
                        iconUri: scope.iconUri || '',
                    }
                );
                console.log(`Scope ${scope.name} copied successfully.`);
            } else {
                console.log(`Scope ${scope.name} already exists, skipping copy.`);
            }
        }

        // Copy policies
        console.log('Copying policies...', copyData.policies);
        const existingPolicies = await kcAdminClient.clients.listPolicies({ id: clientid });
        const policyNames = existingPolicies.map((policy: any) => policy.name);
        for (const policy of copyData.policies) {
            const { id, ...policyData } = policy;
            if (!policyNames.includes(policy.name) && (policy.type === 'role' || policy.type === 'js')) {
                await kcAdminClient.clients.createPolicy(
                    { id: clientid, type: policy.type },
                    {
                        name: policy.name,
                        description: policy.description || '',
                        logic: policy.logic || 'POSITIVE',
                        decisionStrategy: policy.decisionStrategy || 'UNANIMOUS',
                        resources: policy.resources || [],
                        scopes: policy.scopes || [],
                        type: policy.type,
                    }
                );
                console.log(`Policy ${policy.name} copied successfully.`);
            } else {
                console.log(`Policy ${policy.name} already exists, skipping copy.`);
            }
        }

        // Copy resources
        console.log('Copying resources...', copyData.resources);
        const existingResources = await kcAdminClient.clients.listResources({ id: clientid });
        const resourceNames = existingResources.map((resource: any) => resource.name);
        for (const resource of copyData.resources) {
            if (!resourceNames.includes(resource.name)) {
                await kcAdminClient.clients.createResource({ id: clientid }, {
                    name: resource.name,
                    displayName: resource.displayName || '',
                    icon_uri: resource.iconUri || '',
                    type: resource.type || 'urn:ietf:params:oauth:resource-type:default',
                    ownerManagedAccess: resource.ownerManagedAccess || false,
                    attributes: resource.attributes || {},
                    scopes: resource.scopes || [],
                });
                console.log(`Resource ${resource.name} copied successfully.`);
            } else {
                console.log(`Resource ${resource.name} already exists, skipping copy.`);
            }
        }

        // Copy permissions
        console.log('Copying permissions...', copyData.permissions);
        const token = kcAdminClient.accessToken;
        const url = `${kcAdminClient.baseUrl}/admin/realms/${kcAdminClient.realmName}/clients/${clientid}/authz/resource-server/permission`;
        const fetchPermissions = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });
        const permissionsData = await fetchPermissions.json();
        const existingPermissionNames = permissionsData.map((permission: any) => permission.name);
        for (const permission of copyData.permissions) {
            if (!existingPermissionNames.includes(permission.name)) {
                const createPermission = await fetch(url, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: permission.name,
                        type: permission.type,
                        resources: permission.resources || [],
                        scopes: permission.scopes || [],
                        policies: permission.policies || [],
                        decisionStrategy: permission.decisionStrategy || 'UNANIMOUS',
                        logic: permission.logic || 'POSITIVE',
                    }),
                });
                if (!createPermission.ok) {
                    const errorData = await createPermission.json();
                    throw new Error(`Failed to create permission ${permission.name}: ${errorData.error}`);
                }
                console.log(`Permission ${permission.name} copied successfully.`);
            } else {
                console.log(`Permission ${permission.name} already exists, skipping copy.`);
            }
        }
        console.log('All copy operations completed successfully.');

        return NextResponse.json({ success: true, clientId: clientid, name, copyData }, { status: 200 });

    } catch (error: any) {
        console.log('🔴 Error in POST request:', error.response || error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}