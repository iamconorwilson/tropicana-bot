import { readdir } from 'fs';
import { resolve } from 'path';

export async function setupDiscordListeners(context) {
    readdir(resolve('./events/discord'), (err, files) => {
        if (err) return console.error(err);
        files.forEach(async file => {
            if (!file.endsWith('.js')) return;
            console.log(`Loading Discord Event: ${file}`);
            const event = await import(`../events/discord/${file}`);
            event.setupEventListener(context);
        });
    });
}