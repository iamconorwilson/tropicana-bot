import { SlashCommandBuilder } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!');
export async function execute(interaction) {
    await handler(interaction);
}


const handler = async (interaction) => {
    await interaction.reply('Pong!');
}