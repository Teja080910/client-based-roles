import { getKeycloakClient } from "@/lib/keycloak";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ error: "clientId is required" }, { status: 400 });
    }
    try {
        const kcAdminClient = await getKeycloakClient();
        const client = await kcAdminClient.clients.find({clientId: id});
        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }
        return NextResponse.json(client[0]);
    }
    catch (error: any) {
        console.error("🔴 Error fetching client:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}