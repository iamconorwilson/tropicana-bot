import { auth } from './auth/auth.js';
import { setupDiscordListeners } from './functions/setupDiscordListeners.js';
import { setupTwitchListeners } from './functions/setupTwitchListeners.js';
import { registerCommands } from './functions/registerCommands.js';
import { scheduleTasks } from './functions/scheduleTasks.js';

const context = await auth();
    
//set up event listeners
setupDiscordListeners(context.discord);
setupTwitchListeners(context);

//register commands
registerCommands(context);

//schedule tasks
scheduleTasks(context);