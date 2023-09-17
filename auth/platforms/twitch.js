import { RefreshingAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { promises as fs } from 'fs';

import * as dotenv from 'dotenv';
dotenv.config()


export async function setupAuth() {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    const targetUserId = process.env.TWITCH_USER_ID;
    const tokenData = JSON.parse(await fs.readFile('./auth/data/twitch.json', 'UTF-8'));
    const authProvider = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret
        }
    );

    authProvider.onRefresh(async (userId, newTokenData) => await fs.writeFile(`./auth/data/twitch.json`, JSON.stringify(newTokenData, null, 4), 'UTF-8'));

    await authProvider.addUserForToken(tokenData);

    const client = new ApiClient({ authProvider });
    
    let user = await client.users.getAuthenticatedUser(
        await client.users.getUserById(targetUserId)
    );

    console.log(`Logged in as ${user.displayName}!`)

    return client;
}