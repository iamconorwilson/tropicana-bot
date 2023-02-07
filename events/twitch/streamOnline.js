
export async function setupEventListener(context, listener) {

    const twitch = context.twitch;
    const discord = context.discord;

    const userId = await twitch.users.getMe();

    const subscription = await listener.subscribeToStreamOnlineEvents(userId, e => {
        if (e.type === 'live') {
            sendMessage(discord, e);
        }
    });

    return subscription;
}

async function sendMessage(discord, event) {
    const channelId = '1060328523740495902'

    const channel = discord.channels.cache.get(channelId) || await discord.channels.fetch(channelId)
    channel.send(`@everyone ${event.broadcasterDisplayName} is live on Twitch! https://twitch.tv/${event.broadcasterName}`);
}