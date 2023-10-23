import { SlashCommandBuilder } from 'discord.js';
import axios from 'axios';


export const data = new SlashCommandBuilder()
    .setName('sync7tv')
    .setDescription('Syncs 7tv emotes to the server');
export async function execute(interaction) {
    await handler(interaction);
}


const handler = async (interaction) => {

    await interaction.deferReply({ ephemeral: true });

    const emoteSetId = "652d5472464b0a2d43d157c4";

    const { data } = await axios.get(`https://7tv.io/v3/emote-sets/${emoteSetId}`);

    const emotes = data.emotes;

    if (!emotes) {
        log('No emotes returned');
        await interaction.editReply('No emotes returned from 7tv');
        return;
    }

    console.log(emotes);

    const guild = await interaction.guild;

    const output = [];

    //for each emote in emotes
    for (const i in emotes) {

        const emote = emotes[i];

        //check if emote already exists
        const existingEmote = await guild.emojis.fetch().then((emojis) => {
            return emojis.find((emoji) => emoji.name === emote.name);
        });

        if (existingEmote) {
            log(`Emote ${emote.name} already exists`);
            output.push({name: emote.name, status: 'duplicate', reason: 'Emote already exists'});
            continue;
        }


        let filetype = 'png';

        if (emote.data.animated) {
            filetype = 'gif';
        }


        const options = {
            attachment: `https://cdn.7tv.app/emote/${emote.id}/4x.${filetype}`,
            name: emote.name
        }

        

        console.log(options);
        await guild.emojis.create(options).then((emoji) => {
            output.push({name: emoji.name, status: 'success', id: emoji.id, animated: emoji.animated});
        })
        .catch((err) => {
            output.push({name: emote.name, status: "error", reason: 'Discord error'});
            console.log(err);
        });
    }

    let msg = '';

    let successCount = output.filter(o => o.status === 'success').length;
    let duplicateCount = output.filter(o => o.status === 'duplicate').length;
    let errorCount = output.filter(o => o.status === 'error').length;

    //if no success in output
    if (successCount === 0) {
        msg += '## No emotes were added\n';
    } else {
        msg += `## Emote sync completed\n**${successCount} Emotes added:** `;
        //for each success in output
        for (const i in output) {
            const emote = output[i];
            if (emote.status === 'success') {
                if (emote.animated) {
                    msg += `<a:${emote.name}:${emote.id}> - (${emote.name}), `;
                } else {
                    msg += `<:${emote.name}:${emote.id}> - (${emote.name}), `;
                }
            }
        }
        msg += '\n';
    }

    //if duplicates in output
    if (duplicateCount > 0) {
        msg += `${duplicateCount} Emotes were duplicates and not added\n`;
    }


    //if errors in output
    if (errorCount > 0) {
        msg += `${errorCount} Emotes had errors and were not added`;
    }
    
    await interaction.editReply(msg);

}



const log = (message) => {
    if (typeof message === 'object') message = JSON.stringify(message);
    console.log(`[sync7tvEmotes.js]: ${message}`);
  };