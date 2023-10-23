import { Events } from 'discord.js';

export function setupEventListener(client) {

    const { discord, twitch } = client;


    discord.on(Events.GuildScheduledEventCreate, async (event) => {

        //if event is not for this channel, return
        if (event.entityMetadata?.location !== "https://twitch.tv/no_oj") return;

        log(`Event ${event.name} created`)
        
        //calculate duration in minutes
        let duration = (event.scheduledEndTimestamp - event.scheduledStartTimestamp) / 1000 / 60;

        const start = new Date(event.scheduledStartTimestamp).toISOString();
      
        const userId = process.env.TWITCH_USER_ID;

        let data = {
            startDate: start,
            timezone: "Europe/London",
            isRecurring: false,
            duration: duration,
            categoryId: null,
            title: event.name
          }

        await twitch.schedule.createScheduleSegment(userId, data).then((response) => {
            log(`Created schedule segment for event ${event.name}`)
        }).catch((error) => {
            console.log(error);
        });

        

    });
    discord.on(Events.GuildScheduledEventUpdate, async (oldEvent, newEvent) => {
        //update event logic
    });
    discord.on(Events.GuildScheduledEventDelete, async (event) => {
        //delete event logic
    });
}

const log = (message) => {
    if (typeof message === 'object') message = JSON.stringify(message);
    console.log(`[eventCreate.js]: ${message}`);
  };