import { getKeycloakClient } from "@/lib/keycloak";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { id: string } }
) => {
  try {
    const clientAlias = params.id;
    const kc = await getKeycloakClient();
    const token = kc.getAccessToken();

    const response = await fetch(
      `${process.env.KEYCLOAK_URL}/admin/realms/${process.env.KEYCLOAK_REALM}/clients/${clientAlias}/authz/resource-server/permission`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("🔵 Response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("🔴 Keycloak error:", errorText);
      throw new Error("Failed to fetch permissions");
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("🔴 Error fetching permissions:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
