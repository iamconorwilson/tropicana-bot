import { SlashCommandBuilder } from 'discord.js';
import { resolve } from 'path';

export const data = new SlashCommandBuilder()
    .setName('pp')
    .setDescription('pp');
export async function execute(interaction) {
    await handler(interaction);
}

const handler = async (interaction) => {

    const img = resolve('./assets/pp/pp.gif');

    log('Sending pp.gif');
    //return puzzle link
    return await interaction.reply({ files: [img] });
}

const log = (message) => {
    if (typeof message === 'object') message = JSON.stringify(message);
    console.log(`[pp.js]: ${message}`);
};