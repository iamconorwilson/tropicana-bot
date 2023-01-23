const { SlashCommandBuilder } = require('discord.js');
const path = require('path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pp')
        .setDescription('pp'),
    async execute(interaction) {
        await handler(interaction);
    },
};

const handler = async (interaction) => {

    const img = path.resolve('./assets/pp/pp.gif');

    log('Sending pp.gif');
    //return puzzle link
    return await interaction.reply({ files: [img] });
}

const log = (message) => {
    if (typeof message === 'object') message = JSON.stringify(message);
    console.log(`[pp.js]: ${message}`);
};