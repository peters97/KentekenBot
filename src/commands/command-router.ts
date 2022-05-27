import { CommandRoute } from '../interfaces/command-route';

export class CommandRouter {
    private commands: CommandRoute[] = [];

    public addCommand(command: CommandRoute): this {
        this.commands.push(command);

        return this;
    }

    public hasCommand(slug: string): boolean {
        return this.commands.some((command) => command.slug === slug);
    }

    public getCommandBySlug(slug: string): CommandRoute | undefined {
        return this.commands.find((command) => command.slug === slug);
    }

    public getSlashCommandList(): Record<string, string>[] {
        return this.commands.map((route) => {
            return {
                name: route.slug,
                description: 'Test',
            };
        });
    }
}
