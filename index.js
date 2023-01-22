const { Client, GatewayIntentBits } = require('discord.js');
const { setupListeners } = require('./functions/setupListeners');
const { registerCommands } = require('./functions/registerCommands');

const client = new Client({ intents: [GatewayIntentBits.GuildVoiceStates] });

require('dotenv').config();

const TOKEN = process.env.CLIENT_TOKEN
const STATUS = "🌴 Club Tropicana 🌴"


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({ activities: [{ name: STATUS }], status: 'online' });
});
    
setupListeners(client);

registerCommands(client);

client.login(TOKEN)