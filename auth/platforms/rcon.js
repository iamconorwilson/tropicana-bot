import { Rcon } from "rcon-client";

export async function setupAuth() {
    const client = new Rcon({
        host: process.env.MC_HOST,
        port: process.env.MC_PORT,
        password: process.env.MC_PASSWORD
    });

    return client;
}