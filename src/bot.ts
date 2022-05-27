import { Client, Intents, Message } from 'discord.js';
import { Settings } from './services/settings';
import { AvailableSettings } from './enums/available-settings';
import { Output } from './services/output';
import { License } from './commands/license';
import { Ping } from './commands/ping';
import { Status } from './commands/status';
import { CommandRouter } from './commands/command-router';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';

export class Bot {
    private client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
    private routes = new CommandRouter();

    public async liftOff(): Promise<void> {
        await this.login();
        this.setRoutes();
        // this.registerSlashCommands();

        this.client.on('ready', () => {
            Output.line(`Logged in as ${this.client.user?.tag}`);
            this.client.user?.setActivity(`${Settings.get(AvailableSettings.COMMAND_PREFIX)}k <kenteken>`);
        });

        this.client.on('messageCreate', (message) => {
            this.onMessageReceived(message);
        });

        this.client.on('interactionCreate', (interaction) => {
            if (!interaction.isCommand()) {
                return;
            }

            const route = this.routes.getCommandBySlug(interaction.commandName);
            if (!route) {
                return;
            }

            const callback = route.command;
            new callback(interaction, this.client).handle();
        });
    }

    private login(): Promise<string> {
        return this.client.login(Settings.get(AvailableSettings.TOKEN));
    }

    private async registerSlashCommands(): Promise<void> {
        const rest = new REST({ version: '9' }).setToken(Settings.get(AvailableSettings.TOKEN));

        try {
            console.log('Started refreshing application (/) commands.');

            await rest.put(Routes.applicationCommands('831627250692128828'), {
                body: this.routes.getSlashCommandList(),
            });

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    }

    private setRoutes(): void {
        this.routes
            .addCommand({ slug: 'k', command: License })
            .addCommand({ slug: 'ping', command: Ping })
            .addCommand({ slug: 'status', command: Status });
    }

    private onMessageReceived(message: Message): void {
        if (message.author.bot) {
            return;
        }

        if (!message.content.startsWith(Settings.get(AvailableSettings.COMMAND_PREFIX))) {
            return;
        }

        message.channel.sendTyping();

        const usedCommand = message.content.replace(Settings.get(AvailableSettings.COMMAND_PREFIX), '').split(' ')[0];
        const route = this.routes.getCommandBySlug(usedCommand);

        if (!route) {
            message.channel.send('Dat commando bestaat toch niet jonge');
            return;
        }

        // const command = route.command;
        // new command(message, this.client).handle();
    }
}
