// fetch default and custom resources for a client

import { getKeycloakClient } from "@/lib/keycloak";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, context: { params: Record<string, string> | any }) => {
    const { id } = context.params;
    if (!id) {
        return NextResponse.json({ error: "clientId is required" }, { status: 400 });
    }
    try {
        const kcAdminClient = await getKeycloakClient();
        const defaultResourceNames = ["uma_authorization", "offline_access", "account", "profile", "roles", "web-origins", "Default Resource"];
        const allResources = await kcAdminClient.clients.listResources({ id });
        const defaultResources = allResources.filter((resource: any) => defaultResourceNames.includes(resource.name!));
        const customResources = allResources.filter((resource: any) => !defaultResourceNames.includes(resource.name!));

        return NextResponse.json({
            defaultResources,
            customResources,
        });
    } catch (error: any) {
        console.error("🔴 Error fetching resources:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}