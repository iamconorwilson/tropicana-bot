const { Events } = require('discord.js');

exports.setupEventListener = (client, context) => {
    client.on(Events.InteractionCreate, async interaction => {

        if (!interaction.isChatInputCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
            return;
        }

            log(`${interaction.member.id} used the ${command.data.name} command in ${interaction.channelId}`)

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        }
    });
};

const log = (message) => {
    if (typeof message === 'object') message = JSON.stringify(message);
    console.log(`[commandHandler.js]: ${message}`);
  };