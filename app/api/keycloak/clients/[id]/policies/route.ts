// fetch default and custom policies for a client

import { getKeycloakClient } from "@/lib/keycloak";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    const { id } = params;
    if (!id) {
        return NextResponse.json({ error: "clientId is required" }, { status: 400 });
    }
    try {
        const kcAdminClient = await getKeycloakClient();
        const allPolicies = await kcAdminClient.clients.listPolicies({ id });        
        const defaultPolicyNames = ["uma_authorization", "offline_access", "default-policy", "Default Permission", "Default Policy"];
        const defaultPolicies = allPolicies.filter((policy: any) => defaultPolicyNames.includes(policy.name!));
        const customPolicies = allPolicies.filter((policy: any) => !defaultPolicyNames.includes(policy.name!));

        return NextResponse.json({
            defaultPolicies,
            customPolicies,
        });
    } catch (error: any) {
        console.error("🔴 Error fetching policies:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}