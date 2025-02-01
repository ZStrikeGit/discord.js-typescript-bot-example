import Discord from "discord.js"
import dotenv from "dotenv";
import axios from "axios";
import chalk from "chalk";
import mysql from "mysql2";
dotenv.configDotenv({path: "../.env"})
var env = process.env

import { Client, GatewayIntentBits, REST, Routes } from 'discord.js';
import { CommandHandler } from './commandHandler.ts';

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildWebhooks,
    Discord.GatewayIntentBits.GuildMessageReactions,
    Discord.GatewayIntentBits.GuildIntegrations,
    Discord.GatewayIntentBits.GuildVoiceStates,
  ],
});


const commandHandler = new CommandHandler(client);

client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
});

client.on('interactionCreate', async (interaction: Discord.Interaction) => {
    if (!interaction.isCommand()) return;
    await commandHandler.handleCommand(interaction);
});

client.login(env.token);
