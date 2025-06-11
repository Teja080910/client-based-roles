import { getKeycloakClient } from "@/lib/keycloak";
import { NextRequest, NextResponse } from "next/server";

// fetch default and custom scopes for a client
export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
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
        console.error("🔴 Error fetching scopes:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export const POST = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ error: "clientId is required" }, { status: 400 });
    }
    try {
        const kcAdminClient = await getKeycloakClient();
        const body = await req.json();
        const scopeName = body.name;

        if (!scopeName) {
            return NextResponse.json({ error: "Scope name is required" }, { status: 400 });
        }

        // Create a new scope
        const newScope = await kcAdminClient.clientScopes.create({
            name: scopeName,
            description: body.description || "",
        });

        // Optionally, associate the new scope with the client if needed
        // await kcAdminClient.clients.addDefaultClientScope({ id, clientScopeId: newScope.id });

        return NextResponse.json(newScope, { status: 201 });
    } catch (error: any) {
        console.error("🔴 Error creating scope:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}