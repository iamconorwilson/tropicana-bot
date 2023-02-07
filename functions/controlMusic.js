import { AudioPlayerStatus, createAudioResource } from '@discordjs/voice';
import ytdl from 'ytdl-core';

class audioPlayer {
    constructor(context) {
        this.player = context.player;
        this.connection = context.connection;
        this.url = context.url;
    }

    setConnection(connection) {
        this.connection = connection;
    }

    async controlMusic(state) {
        const { player, connection, url } = this;

        if (!state || !player) return;
        
        if (state === 'playing') {
            const stream = createAudioResource(ytdl(url, { filter: 'audioonly' }));
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



const _audioPlayer = audioPlayer;
export { _audioPlayer as audioPlayer };