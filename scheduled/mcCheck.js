import * as dotenv from 'dotenv';
dotenv.config();


class Task {
    constructor(context) {
        this.ec2 = context.awsEC2;
        this.rcon = context.rcon;

        this.check = 0;

        this.host = process.env.MC_HOST;
        this.port = process.env.MC_PORT;
        this.password = process.env.MC_PASSWORD;

        this.execute = this.execute.bind(this);
    }

    //run every 30 mins
    schedule = '*/30 * * * *';

    execute = async () => {
        log('Checking if server is running...');

        const rcon = this.rcon;

        //connect to the server, if it fails, the server is not running
        try {
            await rcon.connect();
        } catch (err) {
            log('Server is not running');
            return;
        }

        //if the server is empty, shut it down
        const players = await rcon.send('list');

        //if players string starts with 'There are 0', the server is empty
        if (players.startsWith('There are 0')) {
            this.check++;
            
            if (this.check < 1) {
                log('Server is empty, will shut down soon');
                await rcon.end();
                return;
            }

            log('Server is empty, shutting down');
            await rcon.send('stop');
            
            rcon.on('end', async () => {
                log('Server has stopped, stopping EC2 instance');
                const ec2 = this.ec2;
                const instanceId = process.env.MC_INSTANCE_ID;
                await ec2.stopInstance(instanceId);
            });

        } else {
            log('Server is not empty, leaving running');
            await rcon.end();
        }
        
    }
}


const log = (message) => {
    if (typeof message === 'object') message = JSON.stringify(message);
    console.log(`[mcCheck.js]: ${message}`);
};
  
export { Task };