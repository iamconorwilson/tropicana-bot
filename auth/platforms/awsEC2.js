import { EC2Client } from "@aws-sdk/client-ec2";
import { ec2Controller } from "../../functions/controlEC2.js";

export async function setupAuth() {
    const client = new EC2Client({ region: "eu-west-2" });

    const user = await client.config.credentials();

    const controller = new ec2Controller({ awsEC2: client });

    console.log(`Logged in as ${user.accessKeyId}!`);

    return controller;
}