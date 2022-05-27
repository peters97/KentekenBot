import { Client, CommandInteraction } from 'discord.js';
import { ICommand } from './command';

export interface CommandConstructor {
    new (message: CommandInteraction, client: Client): ICommand;
}
