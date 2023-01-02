const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

const express = require('express');
const app = express();
const client = new Client({ intents: [GatewayIntentBits.GuildVoiceStates] });

require('dotenv').config();

const TOKEN = process.env.CLIENT_TOKEN
const CHANNEL = process.env.CHANNEL_ID
const STATUS = "🌴 Club Tropicana 🌴"
const URL = "https://www.youtube.com/watch?v=zEUEyDs0oKo";

let connection = {};

async function ready() {
    console.log(`Logged in as ${client.user.tag}!`);

    //SET STATUS AND CHECK CHANNEL EXISTS
    client.user.setPresence({ activities: [{ name: STATUS }], status: 'online' });
    const channel = client.channels.cache.get(CHANNEL) || await client.channels.fetch(CHANNEL)
    if (!channel) return;

    const player = createAudioPlayer();

    client.on('voiceStateUpdate', async (oldState, newState) => {
        console.log('Voice state updated!', oldState.channelId, newState.channelId);
        if (newState.id === client.user.id) return;

        if (newState.channelId === CHANNEL) {
            let joinConfig = {
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator,
            }
            connection = joinVoiceChannel(joinConfig);
            controlMusic(player, 'playing');
        }

        if (oldState.channelId === CHANNEL && oldState.channel.members.size === 1) {
            connection.disconnect();
            controlMusic(player, 'stopped');
        }
    });
}


async function controlMusic(player, state) {
    if (!state || !player) return;
    
    if (state === 'playing') {
        console.log('Playing music!');
        const stream = createAudioResource(ytdl(URL, { filter: 'audioonly' }));
        player.play(stream);
        connection.subscribe(player);

        player.on(AudioPlayerStatus.Idle, () => {
            connection.disconnect();
        });
    } else if (state === 'paused') {
        player.pause();
    } else if (state === 'resumed') {
        player.unpause();
    } else if (state === 'stopped') {
        player.stop();
    }
}


client.on('ready', ready);
    

client.login(TOKEN)

app.get('/', (req, res) => {
    console.log('Woke up!');
    res.send({ status: 'ok' });
    res.sendStatus(200);
});

app.listen(process.env.PORT || 3000, () => {
    console.log('Server is running...');
});