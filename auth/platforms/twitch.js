import { RefreshingAuthProvider } from '@twurple/auth';
import { ApiClient } from '@twurple/api';
import { promises as fs } from 'fs';

import * as dotenv from 'dotenv';
dotenv.config()


export async function setupAuth() {
    const clientId = process.env.TWITCH_CLIENT_ID;
    const clientSecret = process.env.TWITCH_CLIENT_SECRET;
    const tokenData = JSON.parse(await fs.readFile('./auth/data/twitch.json', 'UTF-8'));
    const authProvider = new RefreshingAuthProvider(
        {
            clientId,
            clientSecret,
            onRefresh: async newTokenData => await fs.writeFile('./auth/data/twitch.json', JSON.stringify(newTokenData, null, 4), 'UTF-8')
        },
        tokenData,
        
    );

    const client = new ApiClient({ authProvider: authProvider, logger: {minLevel: 'debug'} });
    
    let user = await client.users.getMe();

    console.log(`Logged in as ${user.displayName}!`)

    return client;
}