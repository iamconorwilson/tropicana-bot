import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import * as dotenv from 'dotenv';
dotenv.config();

class Command {
    constructor(client) {
        this.client = client;

        this.execute = this.execute.bind(this);
    }
    data = new SlashCommandBuilder()
        .setName('mcstart')
        .setDescription('Starts the Minecraft server');
    
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
    
    await interaction.reply({ embeds: [response(`Starting Minecraft Server. This may take a few minutes...`)] });
    //get start time
    const startTime = new Date().getTime();

    const ec2 = context.awsEC2;
    const instanceId = process.env.MC_INSTANCE_ID;

    try {
        await ec2.startInstance(instanceId);

    } catch (err) {
        console.log(err);
        await interaction.editReply({ embeds: [response(`Error starting Minecraft Server`)] });
        return;
    }

    let check = 0;
    let status = 'pending';

    const rcon = context.rcon;

    rcon.on('connect', () => {
        status = 'running';
        const time = new Date().getTime() - startTime;
        interaction.editReply({ embeds: [response(`Minecraft Server sucessfully started in ${Math.round(time / 1000 / 60)} mins`)] });
    });

    while (check < 10 && status !== 'running') {

        try {
            await rcon.connect();
        } catch (err) {
            //timeout
            console.log('timeout', count)
        }
        await new Promise(resolve => setTimeout(resolve, 10000));
        check++;
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