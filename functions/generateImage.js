const { createCanvas, loadImage } = require('canvas');


exports.generateImage = async (options) => {

    const img = await loadImage(options.image);

    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // for each in options.text
    for (const text of options.text) {
        ctx.font = text.font;
        ctx.fillStyle = text.color;
        wrapText(ctx, text.text, text.x, text.y, text.maxWidth, text.lineHeight);
    }

    const attachment = canvas.toBuffer();

    return attachment;
}


// wrap text function
const wrapText = (context, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
};