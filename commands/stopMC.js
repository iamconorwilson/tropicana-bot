import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { Rcon } from 'rcon-client';
import * as dotenv from 'dotenv';
dotenv.config();

class Command {
    constructor(client) {
        this.client = client;

        this.execute = this.execute.bind(this);
    }
    data = new SlashCommandBuilder()
        .setName('mcstop')
        .setDescription('Stops the Minecraft server');
    
    async execute(interaction) {
        await handler(interaction, this.client);
    }
}


const handler = async (interaction, context) => {

    //if role id is not in member roles, return
    if (!interaction.member._roles.includes(process.env.MC_ROLE_ID)) {
        await interaction.reply('You need the Minecraft role to use this command.', { ephemeral: true });
        return;
    }

    const rcon = new Rcon({
        host: process.env.MC_HOST,
        port: process.env.MC_PORT,
        password: process.env.MC_PASSWORD
    });

    try {
        await rcon.connect();
        const players = await rcon.send('list');
        if (!players.startsWith('There are 0')) {
            await interaction.reply({ embeds: [response(`There are still players connected to the server. Please wait for them to exit before stopping.`)], content: '' });
            return;
        }
    } catch (err) {
        //server likely offline
        console.log(err);
    }

    await interaction.reply('Stopping Minecraft Server...');

    await rcon.send('stop');

    //wait for server to stop
    await new Promise(resolve => setTimeout(resolve, 10000));

    const ec2 = context.awsEC2;
    const instanceId = process.env.MC_INSTANCE_ID;

    try {
        await ec2.stopInstance(instanceId);
        await interaction.editReply({ embeds: [response(`Minecraft Server stopped.`)], content: '' });
    } catch (err) {
        console.log(err);
        await interaction.editReply({ embeds: [response(`Error stopping Minecraft Server`)], content: '' });
    }
    
}

const response = function (msg) {
    return new EmbedBuilder()
        .setTitle('Minecraft Server')
        .setDescription(msg)
        .setThumbnail('https://cdn.icon-icons.com/icons2/2699/PNG/512/minecraft_logo_icon_168974.png')
        .setColor(0xff8c00)
        .setTimestamp(new Date().getTime());
}

export { Command };