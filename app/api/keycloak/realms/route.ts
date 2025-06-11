import { getKeycloakClient } from '@/lib/keycloak';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { realm } = await req.json();
    try {
        const kcAdminClient = await getKeycloakClient();
        await kcAdminClient.realms.create({ realm, enabled: true });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const kcAdminClient = await getKeycloakClient();
        const realms = await kcAdminClient.realms.find();
        return NextResponse.json(realms);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    const { realm } = await req.json();
    try {
        const kcAdminClient = await getKeycloakClient();
        await kcAdminClient.realms.del({ realm });
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const { realm, updatedRealm } = await req.json();
    try {
        const kcAdminClient = await getKeycloakClient();
        await kcAdminClient.realms.update({ realm }, updatedRealm);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}