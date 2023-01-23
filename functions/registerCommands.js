const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

exports.registerCommands = (client, dir = "./commands") => {
    client.commands = new Collection();

    const commandsPath = path.resolve(dir);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        // Set a new item in the Collection with the key as the command name and the value as the exported module
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            console.log(`Registered Command: ${file}`);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
}