import { auth } from './auth/auth.js';
import { setupDiscordListeners } from './functions/setupDiscordListeners.js';
import { setupTwitchListeners } from './functions/setupTwitchListeners.js';
import { registerCommands } from './functions/registerCommands.js';
import { scheduleTasks } from './functions/scheduleTasks.js';

// const client = new Client({ intents: [GatewayIntentBits.GuildVoiceStates] });

// import * as dotenv from 'dotenv';
// dotenv.config()

// const TOKEN = process.env.CLIENT_TOKEN
// const STATUS = "🌴 Club Tropicana 🌴"

const context = await auth();

// console.log(context);

// client.on('ready', () => {
//     console.log(`Logged in as ${client.user.tag}!`);
//     client.user.setPresence({ activities: [{ name: STATUS }], status: 'online' });
// });
    
setupDiscordListeners(context.discord);

setupTwitchListeners(context);

registerCommands(context.discord);

scheduleTasks(context);

// client.login(TOKEN)