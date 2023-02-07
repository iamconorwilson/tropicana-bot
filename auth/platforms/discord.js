import { Client, GatewayIntentBits } from 'discord.js';

import * as dotenv from 'dotenv';
dotenv.config()

export async function setupAuth() {
    const client = new Client({ intents: [GatewayIntentBits.GuildVoiceStates] });

    const TOKEN = process.env.DISCORD_CLIENT_TOKEN
    const STATUS = "🌴 Club Tropicana 🌴"

    client.on('ready', () => {
        client.user.setPresence({ activities: [{ name: STATUS }], status: 'online' });
    });

    await client.login(TOKEN)

    console.log(`Logged in as ${client.user.tag}!`);

    return client;
}