import { getKeycloakClient } from "@/lib/keycloak";
import { NextRequest, NextResponse } from "next/server";

// fetch default and custom scopes for a client
export const GET = async (req: NextRequest, context: { params: Record<string, string> | any }) => {
    const { id } = context.params;
    if (!id) {
        return NextResponse.json({ error: "clientId is required" }, { status: 400 });
    }
    try {
        const kcAdminClient = await getKeycloakClient();
        const defaultScopeNames = ["uma_authorization", "offline_access"];
        const allScopes = await kcAdminClient.clients.listAllScopes({ id });
        const defaultScopes = allScopes.filter((scope: any) => defaultScopeNames.includes(scope.name!));
        const customScopes = allScopes.filter((scope: any) => !defaultScopeNames.includes(scope.name!));

        return NextResponse.json({
            defaultScopes,
            customScopes,
        });
    } catch (error: any) {
        console.log( error.response);
        console.error("🔴 Error fetching scopes:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}