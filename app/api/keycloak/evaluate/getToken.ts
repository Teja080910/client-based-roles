import axios from 'axios';
import qs from 'querystring';

export async function getUserAccessToken(clientId: string, userId: string, accessToken: string): Promise<string> {
    const data = qs.stringify({
        grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
        client_id: clientId,
        client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        subject_token: accessToken, // not refreshToken
        subject_token_type: 'urn:ietf:params:oauth:token-type:access_token', // or refresh_token if you're using it
    });

    const res = await axios.post(
        `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
        data,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );


    return res.data.access_token;
}
