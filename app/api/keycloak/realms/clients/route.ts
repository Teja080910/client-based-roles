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

export const DELETE = async (req: NextRequest) => {
    try {
        const kcAdminClient = await getKeycloakClient();
        const { clientId } = await req.json();
        await kcAdminClient.clients.del({ id: clientId });
        console.log(`Deleted client with ID: ${clientId}`);
        return NextResponse.json({ message: `Client ${clientId} deleted successfully` });
    } catch (error: any) {
        console.error("🔴 Error deleting client:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
};