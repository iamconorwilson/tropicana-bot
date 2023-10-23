// plays Club Tropicana by Wham! in a voice channel when someone joins
import { joinVoiceChannel, createAudioPlayer } from '@discordjs/voice';
import { audioPlayer } from '../../functions/controlMusic.js';

const channelId = "1059562088638455878";
const url = "./assets/tropicana/tropicana.ogg";

const audio = new audioPlayer({ player: createAudioPlayer(), url: url, type: 'file' });

const log = (message) => {
    if (typeof message === 'object') message = JSON.stringify(message);
    console.log(`[tropicana.js]: ${message}`);
  };

let connection;

export function setupEventListener(client) {

    const { discord } = client;

    discord.on('voiceStateUpdate', async (oldState, newState) => {
        // tropicana.js
        if (newState.channelId === channelId || oldState.channelId === channelId) {
            const channel = discord.channels.cache.get(channelId) || await discord.channels.fetch(channelId)
            if (!channel) return log({ status: 'error', message: 'Channel not found!' });
            //if bot action, return
            if (newState.id === discord.user.id) return;
            //if audio is playing and bot is not alone in channel, return
            if (audio.isPlaying() && channel.members.size > 1) return;

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
}