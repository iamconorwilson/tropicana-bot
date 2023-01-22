const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction) {
        await handler(interaction);
    },
};


const handler = async (interaction) => {
    await interaction.reply('Pong!');
}