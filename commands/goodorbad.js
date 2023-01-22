const { SlashCommandBuilder } = require('discord.js');
const path = require('path');
const fs = require('fs');
const { generateImage } = require(path.resolve('./functions/generateImage'));

module.exports = {
    data: new SlashCommandBuilder()
        .setName('goodorbad')
        .setDescription('Find out if something is a good thing or a bad thing')
        .addStringOption(option => option.setName('text').setDescription('Text to be checked').setRequired(true)),
    async execute(interaction) {
        await handler(interaction);
    },
};

const handler = async (interaction) => {
    const text = interaction.options.getString('text');

    const imgPath = path.resolve('./assets/goodbad');

    //randomly select an image from the assets folder
    const goodbad = Math.floor(Math.random() * 2) + 1;
    const imgFile = goodbad === 1 ? 'good.jpg' : 'bad.jpg';

    const image = path.join(imgPath, imgFile);

    const options = {
        image: image,
        text: [
            {
                text: text,
                font: 'bold 50px Arial',
                color: '#000000',
                x: 660,
                y: 300,
                maxWidth: 550,
                lineHeight: 50,
            },
        ],
    };

    log('Generating image with text: ', text)
    const img = await generateImage(options);

    //fs save buffer to file
    
    const savePath = path.resolve(__dirname, '../assets/goodbad');
    const saveFile = path.join(savePath, 'test.png');

    await fs.writeFile(saveFile, img, function (err) {
            if (err) throw err;
    });
    

    log('Image generated');
    //return puzzle link
    return await interaction.reply({ files: [img] });
}

const log = (message) => {
    if (typeof message === 'object') message = JSON.stringify(message);
    console.log(`[goodOrBad.js]: ${message}`);
};