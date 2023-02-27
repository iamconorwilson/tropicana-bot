import { StartInstancesCommand, StopInstancesCommand, DescribeInstanceStatusCommand } from "@aws-sdk/client-ec2";


class ec2Controller {
    constructor(context) {
        this.ec2 = context.awsEC2;

        this.startInstance = this.startInstance.bind(this);
        this.stopInstance = this.stopInstance.bind(this);
        this.instanceStatus = this.getInstanceStatus.bind(this);
        this.sendCommand = this.sendCommand.bind(this);
    }
    async startInstance(instanceId) {

        const command = new StartInstancesCommand({ InstanceIds: [instanceId] });

        const data = await this.sendCommand(command);

        return data;

    }
    async stopInstance(instanceId) {

        const command = new StopInstancesCommand({ InstanceIds: [instanceId] });

        const data = await this.sendCommand(command);

        return data;

    }
    async getInstanceStatus(instanceId) {

        const command = new DescribeInstanceStatusCommand({ InstanceIds: [instanceId] });

        const data = await this.sendCommand(command);

        return data;

    }

    async sendCommand(command) {
        const client = this.ec2;

        try {
            const data = await client.send(command);
            return data;
        } catch (err) {
            console.log("Error", err);
        }

    }

}

export { ec2Controller };