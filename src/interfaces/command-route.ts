import { CommandConstructor } from './command-constructor';

export interface CommandRoute {
    slug: string;
    command: CommandConstructor;
}
