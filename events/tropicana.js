// plays Club Tropicana by Wham! in a voice channel when someone joins
const { joinVoiceChannel, createAudioPlayer } = require('@discordjs/voice');
const path = require('path');
const { audioPlayer } = require(path.resolve('./functions/controlMusic'));

const channelId = "1059562088638455878";
const url = "https://www.youtube.com/watch?v=zEUEyDs0oKo";

const audio = new audioPlayer({ player: createAudioPlayer(), url: url });

const log = (message) => {
    if (typeof message === 'object') message = JSON.stringify(message);
    console.log(`[tropicana.js]: ${message}`);
  };


exports.setupEventListener = (client, context) => {
    client.on('voiceStateUpdate', async (oldState, newState) => {
        // tropicana.js
        if (newState.channelId === channelId || oldState.channelId === channelId) {
            const channel = client.channels.cache.get(channelId) || await client.channels.fetch(channelId)
            if (!channel) return log({ status: 'error', message: 'Channel not found!' });
            if (newState.id === client.user.id) return;

            // USER JOINED CHANNEL
            if (newState.channelId === channelId) {
                log(`${newState.id} joined channel`);
                let joinConfig = {
                    channelId: channel.id,
                    guildId: channel.guild.id,
                    adapterCreator: channel.guild.voiceAdapterCreator,
                }
                connection = joinVoiceChannel(joinConfig);
                audio.setConnection(connection);
                audio.controlMusic('playing');
            }

            // USER LEFT CHANNEL AND ONLY BOT IS LEFT
            if (oldState.channelId === channelId && oldState.channel.members.size === 1) {
                log(`${oldState.id} left channel`);
                connection.disconnect();
                audio.controlMusic('stopped');
            }
        }
    })
};