import { getKeycloakClient } from "@/lib/keycloak";
import { excludedClients } from "@/types/default-dashboard-values";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const kcAdminClient = await getKeycloakClient();
    const clients = await kcAdminClient.clients.find();

    const myClients = clients.filter(
      (client: any) => !excludedClients.includes(client.clientId || "")
    );

    const allMyResources = await Promise.all(
      myClients.map(async (client) => {
        try {
          const resource = await kcAdminClient.clients.listResources({
            id: client.id!, // use `id`, not clientId
          });
          return {
            clientId: client.clientId,
            resources: resource,
          };
        } catch (err) {
          console.warn(`Failed to fetch resources for client ${client.clientId}`);
          return {
            clientId: client.clientId,
            resources: [],
          };
        }
      })
    );

    return NextResponse.json(allMyResources);
  } catch (error: any) {
    console.error("🔴 Error fetching all resources:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (request: Request) => {
  try {
    const kcAdminClient = await getKeycloakClient();
    const { clientId, name, type, uri } = await request.json();

    if (!clientId || !name || !type || !uri) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const resource = await kcAdminClient.clients.createResource(
      clientId,
      {
        name,
        type,
        uri,
      }
    );

    return NextResponse.json(resource);
  } catch (error: any) {
    console.error("🔴 Error creating resource:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}