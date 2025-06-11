import { getKeycloakClient } from "@/lib/keycloak";
import { excludedClients } from "@/types/default-dashboard-values";
import { NextRequest, NextResponse } from "next/server";

// fetch clients based on realm
export async function GET(req: NextRequest) {
    const realmParam = req.nextUrl.searchParams.get('realm');
    const realm = realmParam === null ? undefined : realmParam;
    try {
        const kcAdminClient = await getKeycloakClient();
        const clients = await kcAdminClient.clients.find({ realm });
        const myClients = clients.filter(
            (client: any) => !excludedClients.includes(client.clientId || '')
        );
        return NextResponse.json(myClients);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}