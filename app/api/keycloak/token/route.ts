// fetch token

export const GET = async (req: Request) => {
    const realm = process.env.KEYCLOAK_REALM;
    const clientId = process.env.KEYCLOAK_CLIENT_ID;
    const clientSecret = process.env.KEYCLOAK_CLIENT_SECRET;

    if (!realm || !clientId || !clientSecret) {
        return new Response(JSON.stringify({ error: 'Missing required parameters' }), { status: 400 });
    }

    try {
        const response = await fetch(`${process.env.KEYCLOAK_URL}/realms/${realm}/protocol/openid-connect/token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: clientId,
                client_secret: clientSecret,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error fetching token: ${response.statusText}`);
        }

        const data = await response.json();
        return new Response(JSON.stringify(data), { status: 200 });
    } catch (error:any) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
}