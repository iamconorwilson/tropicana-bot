import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { parse } from 'url';
import { extname } from 'path';

export const data = new SlashCommandBuilder()
    .setName('puzzle')
    .setDescription('Get a link to a puzzle from jigsawexplorer.com')
    .addStringOption(option => option.setName('url').setDescription('The URL of the puzzle you want to link').setRequired(true));
export async function execute(interaction) {
    await handler(interaction);
}

const handler = async (interaction) => {
    const url = interaction.options.getString('url');
    //check if url is valid and return error if not
    if (!checkUrl(url)) return interaction.reply({ content: 'This URL is not valid, please link to a .jpg or .png file', ephemeral: true });
    //convert url to base64
    const base64 = Buffer.from(url).toString('base64');

    const embed = new EmbedBuilder()
        .setTitle('🧩 Click here to play the puzzle 🧩')
        .setDescription('www.jigsawexplorer.com')
        .setURL(`https://www.jigsawexplorer.com/online-jigsaw-puzzle-player.html?url=${base64}`)
        .setThumbnail(url)

    //return puzzle link
    return await interaction.reply({ embeds: [embed] });
}

const checkUrl = (inputUrl) => {
    const parsedUrl = parse(inputUrl);
    // check that the URL has a valid file extension (e.g. ".jpg", ".png")
    const fileExtension = extname(parsedUrl.pathname);
    if (!fileExtension || !['.jpg', '.png'].includes(fileExtension)) {
        return false;
    }
    return true;
};

const log = (message) => {
    if (typeof message === 'object') message = JSON.stringify(message);
    console.log(`[puzzleLink.js]: ${message}`);
};