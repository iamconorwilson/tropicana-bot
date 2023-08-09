
import { EmbedBuilder } from "discord.js";

export async function setupEventListener(context, listener) {

    const twitch = context.twitch;
    const discord = context.discord;

    const userId = process.env.TWITCH_USER_ID;
    
    const subscription = await listener.onStreamOnline(userId, e => {
        if (e.type === 'live') {
            sendMessage(discord, e);
        }
    });

    return subscription;
}

async function sendMessage(discord, event) {
    const channelId = '1073691933295267992';
    const liveRoleId = '1105765271479779408';

    const stream = await event.getStream();
    const user = await event.getBroadcaster();

    const channel = discord.channels.cache.get(channelId) || await discord.channels.fetch(channelId)

    //send embed response and mention role
    channel.send({ content: `<@&${liveRoleId}>`, embeds: [response(stream, user)] });

    //crosspost message
    const message = await channel.messages.fetch({ limit: 1 });
    message.first().crosspost();
    
}

const response = function (stream, user) {
    return new EmbedBuilder()
    .setColor(0xff8c00)
        .setTitle(stream.title)
        .setDescription(`Playing ${stream.gameName}`)
        .setURL(`https://twitch.tv/${user.name}`)
        .setAuthor({ name: `${user.displayName} is live now on Twitch!`, iconURL: `${user.profilePictureUrl}`, url: `https://twitch.tv/${user.name}` })
        .setImage(stream.getThumbnailUrl(1280, 720))
        .setTimestamp();
}