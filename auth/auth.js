// import fs from 'fs';
// import path from 'path';

// export async function auth() {
//     return new Promise((resolve, reject) => {
//         const context = [];
//         fs.readdir(path.resolve('./auth/platforms'), async (err, files) => {
//             if (err) return console.error(err);

//             for (const file of files) {
//                 if (!file.endsWith('.js')) return;
//                 const platform = file.split('.')[0];
//                 console.log(`Authenticating: ${file}`);
//                 const module = await import(`./platforms/${file}`);
//                 context.push({ [platform]: module.setupAuth() });
//             }
//         });
//         resolve(context);
//     });
// }


// loop though all platforms in the auth folder
// import the platform
// run the setupAuth function
// push the result to the context array
// return the context array

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
