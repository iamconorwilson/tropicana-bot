import { readdirSync } from 'fs';
import { resolve } from 'path';
import { Collection } from 'discord.js';

export async function registerCommands(context, dir = "./commands") {

    const discord = context.discord;

    discord.commands = new Collection();

    const commandsPath = resolve(dir);
    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js'));
    
    await Promise.all(commandFiles.map(async file => {
        const filePath = '../commands/' + file;
        let command = await import(filePath);
        //if command is class, call constructor with context
        if (command.Command) {
            command = new command.Command(context);
        }

        if ('data' in command && 'execute' in command) {
            discord.commands.set(command.data.name, command);
            console.log(`Registered Command: ${file}`);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }));

}