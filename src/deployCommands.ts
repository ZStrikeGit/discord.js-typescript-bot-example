import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest'
import fs from "fs"
import dotenv from 'dotenv'
import Discord from "discord.js"
import types, { Routes } from "discord-api-types/v10"
dotenv.configDotenv({path: "../.env"});
var env = process.env
var commands = new Array()
const Client = new Discord.Client({intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.MessageContent, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.GuildWebhooks, Discord.GatewayIntentBits.GuildMessageReactions, Discord.GatewayIntentBits.GuildIntegrations, Discord.GatewayIntentBits.GuildVoiceStates]})
Client.login(env.token);
(async () =>{
    

const commandFiles = fs.readdirSync('./commands/').filter(f => f.endsWith('.ts'))
for (const file of commandFiles) {
   console.log(file)
   const newcmd = await import(`./commands/${file}`)
   const data = newcmd.default.data
   var currentCommand = new SlashCommandBuilder().setName(data.name).setDescription(data.description || "No description has been written for this command yet")
   if (data.options !== undefined) {
      data.options.forEach((val: any, ind: number) => {
      switch (val.type) {
         case types.ApplicationCommandOptionType.String:
               if (val.choices) {
                  currentCommand.addStringOption(option => option.setName(val.name.toLowerCase()).setDescription(val.description).setRequired(val.required).addChoices(val.choices))
               } else {
                  currentCommand.addStringOption(option => option.setName(val.name.toLowerCase()).setDescription(val.description).setRequired(val.required))
               }
            break;
         case types.ApplicationCommandOptionType.Boolean:
            if (val.choices) {
               currentCommand.addBooleanOption(option => option.setName(val.name.toLowerCase()).setDescription(val.description).setRequired(val.required))
            } else {
               currentCommand.addBooleanOption(option => option.setName(val.name.toLowerCase()).setDescription(val.description).setRequired(val.required))
            }
            break;
         case types.ApplicationCommandOptionType.Integer:
            if (val.choices) {
               currentCommand.addIntegerOption(option => option.setName(val.name.toLowerCase()).setDescription(val.description).setRequired(val.required).addChoices(val.choices))
            } else {
               currentCommand.addIntegerOption(option => option.setName(val.name.toLowerCase()).setDescription(val.description).setRequired(val.required))
            }
            break;
         case types.ApplicationCommandOptionType.Number:
            if (val.choices) {
               currentCommand.addNumberOption(option => option.setName(val.name.toLowerCase()).setDescription(val.description).setRequired(val.required).addChoices(val.choices))
            } else {
               currentCommand.addNumberOption(option => option.setName(val.name.toLowerCase()).setDescription(val.description).setRequired(val.required))
            }
            break;
         case types.ApplicationCommandOptionType.Role:
            if (val.choices) {
               currentCommand.addRoleOption(option => option.setName(val.name.toLowerCase()).setDescription(val.description).setRequired(val.required))
            } else {
               currentCommand.addRoleOption(option => option.setName(val.name.toLowerCase()).setDescription(val.description).setRequired(val.required))
            }
            break;
         case types.ApplicationCommandOptionType.Mentionable:
               currentCommand.addMentionableOption(option => option.setName(val.name.toLowerCase()).setDescription(val.description).setRequired(val.required))
            break;
         case types.ApplicationCommandOptionType.Channel:
               currentCommand.addChannelOption(option => option.setName(val.name.toLowerCase()).setDescription(val.description).setRequired(val.required))
            break;
         case types.ApplicationCommandOptionType.User:
               currentCommand.addUserOption(option => option.setName(val.name.toLowerCase()).setDescription(val.description).setRequired(val.required))
            break;
         case types.ApplicationCommandOptionType.Subcommand:
               currentCommand.addSubcommand(option => option.setName(val.name.toLowerCase()).setDescription(val.description))
            break;
         case types.ApplicationCommandOptionType.SubcommandGroup:
               currentCommand.addSubcommandGroup(option => option.setName(val.name.toLowerCase()).setDescription(val.description))
            break;
         case types.ApplicationCommandOptionType.Attachment:
               currentCommand.addAttachmentOption(option => option.setName(val.name.toLowerCase()).setDescription(val.description).setRequired(val.required))
         default:
            console.error("\x1b[33m", `${file}:`, "\x1b[31m", "malformed argument options", "\x1b[0m")
            break;
      }
   })
   } 
   if (data.nsfw) {
      currentCommand.setNSFW(data.nsfw)
      currentCommand
   }
   if (data.allowDM !== undefined) {
      currentCommand.setDMPermission(data.allowDM)
   } else {
      currentCommand.setDMPermission(false)
   }
   commands.push(currentCommand);
}


const commandsjson = commands.map(command => command.toJSON())

const rest = new REST({ version: '10' }).setToken(`${env.token}`);
Client.on("ready", (client) => {
   console.log(JSON.parse(JSON.stringify(commandsjson)))
   rest.put(Routes.applicationCommands(client.user.id), { body: commandsjson })
      .then(() => {
         console.log('Successfully registered application commands.')
         Client.destroy()
         process.exit(0)
      })
      .catch(console.error);
})

})()
