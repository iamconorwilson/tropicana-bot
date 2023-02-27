import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

class Command {
    constructor(client) {
        this.client = client;

        this.execute = this.execute.bind(this);
    }
    data = new SlashCommandBuilder()
        .setName('mcstatus')
        .setDescription('Gets the status of the Minecraft server');
    
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
    
    await interaction.reply('Getting Minecraft Server status...');


    //check if instance is running
    const ec2 = context.awsEC2;
    const instanceId = process.env.MC_INSTANCE_ID;
    let instanceState;

    try {
        const status = await ec2.getInstanceStatus(instanceId);
        instanceState = status.InstanceStatuses[0]?.InstanceState.Name

        if (instanceState !== 'running') {
            interaction.editReply({ embeds: [response('Minecraft Server is offline.')], content: '' });
            return;
        }

        
    } catch (err) {
        console.log(err);
        interaction.editReply({ embeds: [response('Error getting Minecraft Server status.')], content: '' });
    }

    //if instance is running, check if rcon is connected

    const rcon = context.rcon;
    let connect;

    try {
        connect = await rcon.connect();
    } catch (err) {
        console.log(err);
        connect = false;
    }

    

    if (connect) {
        rcon.send('list').then((players) => {
            if (players.startsWith('There are 0')) {
                interaction.editReply({ embeds: [response('Minecraft Server is online, but there are no players.')], content: '' });
            } else {
                let playerNumber = players.split(' ')[2];
                let playerString = playerNumber === '1' ? 'player is' : 'players are';
                interaction.editReply({ embeds: [response(`Minecraft Server is online, and ${playerNumber} ${playerString} online.`)], content: '' });
            }
        });
        rcon.end();
        return;
    }
     
    interaction.editReply({ embeds: [response('Minecraft Server is offline.')], content: ''});
    
}

const response = function (msg) {
    return new EmbedBuilder()
        .setTitle('Minecraft Server Status')
        .setDescription(msg)
        .setThumbnail('https://cdn.icon-icons.com/icons2/2699/PNG/512/minecraft_logo_icon_168974.png')
        .setColor(0xff8c00)
        .setTimestamp(new Date().getTime());
}

export { Command };