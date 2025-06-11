import { getKeycloakClient } from "@/lib/keycloak";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        const kcAdminClient = await getKeycloakClient();
        const defaultRoleNames = ["uma_authorization", "offline_access"];
        const allRoles = await kcAdminClient.clients.listRoles({ id: params.id });
        const defaultRoles = allRoles.filter(role => defaultRoleNames.includes(role.name!));
        const customRoles = allRoles.filter(role => !defaultRoleNames.includes(role.name!));

        return NextResponse.json({
            defaultRoles,
            customRoles,
        });
    } catch (error) {
        console.error('Error fetching roles:', error);
        return NextResponse.error();
    }
}
