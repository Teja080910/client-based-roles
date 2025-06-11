import { getKeycloakClient } from "@/lib/keycloak";
import { excludedClients } from "@/types/default-dashboard-values";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
    try {
        const kcAdminClient = await getKeycloakClient();
        const clients = await kcAdminClient.clients.find();

        const myClients = clients.filter(
            (client: any) => !excludedClients.includes(client.clientId || "")
        );

        const allMyResources = await Promise.all(
            myClients.map(async (client) => {
                try {
                    const resource = await kcAdminClient.clients.listResources({
                        id: client.id!, // use `id`, not clientId
                    });
                    return {
                        clientId: client.clientId,
                        resources: resource,
                    };
                } catch (err) {
                    console.warn(`Failed to fetch resources for client ${client.clientId}`);
                    return {
                        clientId: client.clientId,
                        resources: [],
                    };
                }
            })
        );

        return NextResponse.json(allMyResources);
    } catch (error: any) {
        console.error("🔴 Error fetching all resources:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};

export const POST = async (req: NextRequest) => {
    try {
        const kcAdminClient = await getKeycloakClient();
        const body = await req.json();
        const { client, name, type, uri, ownerManagedAccess = false, attributes = {} } = body;
        console.log(client)
        if (!client || !name || !type) {
            return NextResponse.json(
                { error: "Client, name, and type are required" },
                { status: 400 }
            );
        }
        const created = await kcAdminClient.clients.createResource(
            { id: client.id! },
            {
                name,
                type,
                uri: uri,
                ownerManagedAccess,
                attributes,
            }
        );

        return NextResponse.json({ message: "Resource created", resource: created });
    } catch (error: any) {
        console.error("🔴 Error creating resource:", error);
        return NextResponse.json({ error: error.message || "Internal error" }, { status: 500 });
    }
};
