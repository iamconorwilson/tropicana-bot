const fs = require('fs');
const path = require('path');

exports.setupListeners = (client, context) => {
    fs.readdir(path.resolve('./events'), (err, files) => {
        if (err) return console.error(err);
        files.forEach(file => {
            if (!file.endsWith('.js')) return;
            console.log(`Loading Event: ${file}`);
            const event = require(path.resolve(`./events/${file}`));
            event.setupEventListener(client, context);
        });
    });
}