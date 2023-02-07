import { readdirSync } from 'fs';
import { resolve, join } from 'path';
import { Collection } from 'discord.js';

export async function registerCommands(client, dir = "./commands") {
    client.commands = new Collection();

    const commandsPath = resolve(dir);
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    await Promise.all(commandFiles.map(async file => {
        const filePath = '../commands/' + file;
        const command = await import(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`Registered Command: ${file}`);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }));

}