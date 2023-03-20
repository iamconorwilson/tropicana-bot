import { AudioPlayerStatus, createAudioResource } from '@discordjs/voice';
import { createReadStream } from 'fs';
import { resolve } from 'path';
import ytdl from 'ytdl-core';

class audioPlayer {
    constructor(context) {
        this.player = context.player;
        this.connection = context.connection;
        this.url = context.url;
        this.type = context.type;
    }

    setConnection(connection) {
        this.connection = connection;

        //fix for dropped audio
        connection.on('stateChange', (oldState, newState) => {
            const oldNetworking = Reflect.get(oldState, 'networking');
            const newNetworking = Reflect.get(newState, 'networking');
            
            oldNetworking?.off('stateChange', networkStateChangeHandler);
            newNetworking?.on('stateChange', networkStateChangeHandler);
        });
    }

    async controlMusic(state) {
        const { player, connection, url, type } = this;

        if (!state || !player) return;
        
        if (state === 'playing') {
            const stream = resourceCreate(url, type);
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
    isPlaying() {
        return this.player.state.status === AudioPlayerStatus.Playing;
    }
}


function resourceCreate(resource, type) {
    if (type === 'youtube') {
        return createAudioResource(ytdl(resource, { filter: 'audioonly' }));
    } else if (type === 'file') {
        return createAudioResource(createReadStream(resolve(resource)));
    } else {
        throw new Error('Invalid resource type');
    }

}

const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
    const newUdp = Reflect.get(newNetworkState, 'udp');
    clearInterval(newUdp?.keepAliveInterval);
  }


const _audioPlayer = audioPlayer;
export { _audioPlayer as audioPlayer };