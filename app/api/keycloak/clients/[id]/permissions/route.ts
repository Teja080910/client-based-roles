import { getKeycloakClient } from "@/lib/keycloak";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const clientId = params.id;

    if (!clientId) {
      return NextResponse.json({ error: "clientId is required" }, { status: 400 });
    }

    const kc = await getKeycloakClient();
    const token = kc.accessToken;

    const url = `${kc.baseUrl}/admin/realms/${kc.realmName}/clients/${clientId}/authz/resource-server/permission`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const defaultPermissionsList = ['Default Permission'];

    const responseData = response.data;
    const defaultPermissions = responseData.filter((permission: any) =>
      defaultPermissionsList.includes(permission.name)
    );
    const customPermissions = responseData.filter((permission: any) =>
      !defaultPermissionsList.includes(permission.name)
    );

    return NextResponse.json({
      defaultPermissions: defaultPermissions,
      customPermissions: customPermissions,
    });
  } catch (error) {
    console.error("Error fetching permissions:", error);
    return NextResponse.json({ error: "Failed to fetch permissions" }, { status: 500 });
  }
};

export const POST = async (req: NextRequest, { params }: { params: { id: string } }) => {
  try {
    const clientId = params.id;

    if (!clientId) {
      return NextResponse.json({ error: "clientId is required" }, { status: 400 });
    }

    const kc = await getKeycloakClient();
    const token = kc.accessToken;

    const url = `${kc.baseUrl}/admin/realms/${kc.realmName}/clients/${clientId}/authz/resource-server/permission`;

    const body = await req.json();

    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error creating permission:", error);
    return NextResponse.json({ error: "Failed to create permission" }, { status: 500 });
  }
};
