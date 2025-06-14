// app/api/keycloak/evaluate/route.ts
import { auth } from '@/lib/auth';
import { getKeycloakClient } from '@/lib/keycloak';
import axios from 'axios';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    const { realm, clientId, accessToken } = await req.json();
    const formData = new URLSearchParams();
    formData.append('grant_type', 'urn:ietf:params:oauth:grant-type:uma-ticket');
    formData.append('audience', clientId);
    formData.append('response_mode', 'permissions');
    const session = await auth();
    const accessTokenFromSession = (session as any)?.accessToken;

    console.log('Access Token from session:', accessTokenFromSession, session);

    if(accessToken){
        try {
        const response = await axios.post(
            `http://localhost:8080/realms/${realm}/protocol/openid-connect/token`,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
        );

        return NextResponse.json(response.data);
    } catch (err: any) {
        console.log(err)
        console.error(err.response?.data || err.message);
        return NextResponse.json({ error: 'Failed to evaluate permissions' }, { status: 500 });
    }
    }
}

// get roles of user in specific client

export const GET = async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const realm = searchParams.get('realm');
    const clientId = searchParams.get('clientId');
    const accessToken = req.headers.get('Authorization')?.replace('Bearer ', '');
    const userId = searchParams.get('userId');
    if (!realm || !clientId || !accessToken) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }
    try {
        const keycloak = await getKeycloakClient();
        const client = await keycloak.clients.find({
            clientId,
            realm,
        });
        const roles = await keycloak.clients.listRoles({
            id: client[0].id!,
            realm,
        });
        const userClients = []
        const allClients = await keycloak.clients.find();
        for (const client of allClients) {
            const roles = await keycloak.users.listClientRoleMappings({
                id: userId!,
                clientUniqueId: client.id!,
            });

            if (roles.length > 0) {
                userClients.push(client);
            }
        }
        return NextResponse.json({ roles, clients: userClients });
    }
    catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to fetch roles' }, { status: 500 });
    }
};
