import { getKeycloakClient } from "@/lib/keycloak";
import { excludedClients } from "@/types/default-dashboard-values";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const kcAdminClient = await getKeycloakClient();
  const clients = await kcAdminClient.clients.find();
  try {
    const myClients = clients.filter(
      (client: any) => !excludedClients.includes(client.clientId || '')
    );
    return NextResponse.json(myClients);
  } catch (error: any) {
    console.error("🔴 Error fetching clients:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const POST = async (req: NextRequest) => {
  const kcAdminClient = await getKeycloakClient();
  const { clientId, name } = await req.json();
  try {
    const newClient = await kcAdminClient.clients.create({
      clientId,
      name,
      enabled: true,
    });
    return NextResponse.json(newClient);
  } catch (error: any) {
    console.error("🔴 Error creating client:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  const kcAdminClient = await getKeycloakClient();
  const { clientId } = await req.json();
  try {
    await kcAdminClient.clients.del({ id: clientId });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("🔴 Error deleting clients:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  const kcAdminClient = await getKeycloakClient();
  const { clientId, updatedClient } = await req.json();
  try {
    await kcAdminClient.clients.update({ id: clientId }, updatedClient);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("🔴 Error updating clients:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// disable client
export const PATCH = async (req: NextRequest) => {
  const kcAdminClient = await getKeycloakClient();
  const { clientId, enabled } = await req.json();
  try {
    await kcAdminClient.clients.update({ id: clientId }, { enabled });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("🔴 Error patching clients:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};