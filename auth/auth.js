import { readdirSync } from 'fs';
import { resolve } from 'path';

export async function auth() {
    const context = {};
    const authPath = resolve('./auth/platforms');
    const authFiles = readdirSync(authPath).filter(file => file.endsWith('.js'));
    
    await Promise.all(authFiles.map(async file => {
        const filePath = './platforms/' + file;
        const platform = file.split('.')[0];
        const module = await import(filePath);
        context[platform] = await module.setupAuth();
    }));

    return context;
}
