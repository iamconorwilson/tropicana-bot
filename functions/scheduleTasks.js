import cron from 'node-cron';
import { readdirSync } from 'fs';
import { resolve } from 'path';

export const scheduleTasks = async (context, dir = './scheduled') => {
    const tasksPath = resolve(dir);
    const taskFiles = readdirSync(tasksPath).filter(file => file.endsWith('.js'));

    await Promise.all(taskFiles.map(async file => {
        const filePath = '../scheduled/' + file;
        //if file is not a js file, skip it
        if (!file.endsWith('.js')) return;
        
        const { Task } = await import(filePath);
        const task = new Task(context);

        if ('schedule' in task && 'execute' in task) {
            cron.schedule(task.schedule, task.execute);
            console.log(`Scheduled Task: ${file}`);
        } else {
            console.log(`[WARNING] The task at ${filePath} is missing a required "schedule" or "execute" property.`);
        }
    }))
}
