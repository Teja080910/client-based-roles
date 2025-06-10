import kcAdminClient from "@/lib/keycloak";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  const clients = await kcAdminClient.clients.find();
  return NextResponse.json(clients);
};

export const POST = async (req: NextRequest) => {
  const { clientId, name } = await req.json();
  try {
    const newClient = await kcAdminClient.clients.create({
      clientId,
      name,
      enabled: true,
    });
    return NextResponse.json(newClient);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const DELETE = async (req: NextRequest) => {
  const { clientId } = await req.json();
  try {
    await kcAdminClient.clients.del({ id: clientId });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

export const PUT = async (req: NextRequest) => {
  const { clientId, updatedClient } = await req.json();
  try {
    await kcAdminClient.clients.update({ id: clientId }, updatedClient);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};

// disable clinet
export const PATCH = async (req: NextRequest) => {
  const { clientId, enabled } = await req.json();
  try {
    await kcAdminClient.clients.update({ id: clientId }, { enabled });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
};