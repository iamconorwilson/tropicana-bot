import { RefreshingAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { promises as fs } from 'fs';

import * as dotenv from 'dotenv';
dotenv.config()


export async function setupAuth() {
    const clientId = 'oacxujrtn9pykokh9bmsklj04p781r';
    const clientSecret = 'i1wsjofkmn9hu3m4nkdreegzij7gpi';
    const tokenData = JSON.parse(await fs.readFile('./auth/data/twitch.json', 'UTF-8'));
    const authProvider = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret,
            onRefresh: async newTokenData => await fs.writeFile('./auth/data/twitch.json', JSON.stringify(newTokenData, null, 4), 'UTF-8')
        },
        tokenData
    );

    const client = new ApiClient({ authProvider });
    
    let user = await client.users.getMe();

    console.log(`Logged in as ${user.displayName}!`)

    return client;
}