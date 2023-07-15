import { readdirSync } from 'fs';
import { resolve } from 'path';
import { EventSubWsListener } from '@twurple/eventsub-ws';

export async function setupTwitchListeners(context) {

    const twitch = context.twitch;

    const listener = new EventSubWsListener({
        apiClient: twitch,
        logger: {
		    minLevel: 'debug'
        }
    });

    console.log('Set up Twitch listener: ', listener)

    //remove any existing subscriptions
    // const subscriptions = await twitch.eventSub.getSubscriptions();

    // subscriptions.data.map(async subscription => {
    //     console.log(`Deleting Twitch subscription: ${subscription.id}`);
    //     await twitch.eventSub.deleteSubscription(subscription.id);
    // });


    readdirSync(resolve('./events/twitch'), (err, files) => {
        console.log('setting up event listeners')
        if (err) return console.error(err);
        files.forEach(async file => {
            if (!file.endsWith('.js')) return;
            console.log(`Loading Twitch Event: ${file}`);
            const event = await import(`../events/twitch/${file}`);
            event.setupEventListener(context, listener);
        });
    });

    console.log('starting listener')

    try {
        await listener.start();
        console.log(listener)
    } catch (e) {
        console.log(e);
    }
    
    
}
