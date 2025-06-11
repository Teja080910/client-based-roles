import { getKeycloakClient } from "@/lib/keycloak";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { clientId, name, copyData } = await req.json();

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
                enabled: true,
                protocol: "openid-connect",
                authorizationServicesEnabled: true,
                serviceAccountsEnabled: true,
                directAccessGrantsEnabled: true,
                publicClient: false,
            });
            console.log('Created new client:', createdClient);
            clientid = createdClient.id;
        } else {
            const updatedClient = await kcAdminClient.clients.update({ id: existingClient[0].id! }, {
                name,
                enabled: true,
                protocol: "openid-connect",
                serviceAccountsEnabled: true,
                authorizationServicesEnabled: true,
                directAccessGrantsEnabled: true,
                publicClient: false
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
            const {id, ...policyData} = policy;
            if (!policyNames.includes(policy.name)) {
                const create = await kcAdminClient.clients.createPolicy(
                    { id: clientid, type: policy.type },
                    policyData
                );
                console.log(`Policy ${policy.name} copied successfully.`);
            } else {
                console.log(`Policy ${policy.name} already exists, skipping copy.`);
            }
        }

        // Copy resources
        // console.log('Copying resources...', copyData.resources);
        // const existingResources = await kcAdminClient.clients.listResources({ id: clientid });
        // const resourceNames = existingResources.map((resource: any) => resource.name);
        // for (const resource of copyData.resources) {
        //     if (!resourceNames.includes(resource.name)) {
        //         await kcAdminClient.clients.createResource({ id: clientid }, {
        //             ...resource
        //         });
        //         console.log(`Resource ${resource.name} copied successfully.`);
        //     } else {
        //         console.log(`Resource ${resource.name} already exists, skipping copy.`);
        //     }
        // }


        return NextResponse.json({ success: true, clientId: clientid, name, copyData }, { status: 200 });

    } catch (error: any) {
        console.log('🔴 Error in POST request:', error.response || error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}