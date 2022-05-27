import { Client, MessagePayload, MessageOptions, CommandInteraction } from 'discord.js';

export abstract class BaseCommand {
    protected message: CommandInteraction;
    protected client: Client;

    public constructor(message: CommandInteraction, client: Client) {
        this.message = message;
        this.client = client;
    }

    protected getArguments() {
        return this.message.options;
        // const data = this.message.content.replace(Settings.get(AvailableSettings.COMMAND_PREFIX), '').split(' ');
    }

    protected reply(options: string | MessagePayload | MessageOptions): void {
        this.message.channel?.send(options);
    }
}
