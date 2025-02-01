import { Client, CommandInteraction } from 'discord.js';
import Discord from "discord.js";
import fs from "fs";
//import bruh from './commands/radar';
export class CommandHandler {
    private client: Client;
    private commands: Discord.Collection<string,any>;

    constructor(client: Client) {
        this.client = client;
        this.commands = new Discord.Collection()

        // Load commands
        this.loadCommands();
    }

    private async loadCommands() {
        const commandFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.ts'))
        for (const file of commandFiles) {
            console.log(file)
        const rawcmd = await import(`./commands/${file}`)
        const command = rawcmd.default
        console.log("BRUHH",command)
        this.commands.set(command.data.name, command);
    }
}

    public async handleCommand(interaction: Discord.CommandInteraction) {
        console.log(interaction.commandName)
        const command = this.commands.get(interaction.commandName);
        console.log(command)
        if (command) {
            await command.execute(interaction);
        } else {
            await interaction.reply({ content: 'Command not found!', ephemeral: true });
        }
    }
}