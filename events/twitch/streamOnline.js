
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
    const channelId = '1073691933295267992';
    const liveRoleId = '1105765271479779408';

    const channel = discord.channels.cache.get(channelId) || await discord.channels.fetch(channelId)
    channel.send(`<@&${liveRoleId}> ${event.broadcasterDisplayName} is live on Twitch! https://twitch.tv/${event.broadcasterName}`);

    //crosspost message
    const message = await channel.messages.fetch({ limit: 1 });
    message.first().crosspost();
    
}