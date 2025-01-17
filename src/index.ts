import {Interaction} from "discord.js";

require('dotenv').config();
import * as fs from "node:fs";
import * as path from "node:path";

const {Client, Events, GatewayIntentBits, Collection, ActivityType, EmbedBuilder} = require('discord.js');

const client = new Client({intents: [GatewayIntentBits.GuildPresences, GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.DirectMessages, GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildVoiceStates]});

client.commands = new Collection();

const foldersPath: string = path.join(__dirname, 'Commands');
const commandFolders: string[] = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
    const commandsPath = path.join(foldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);

        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        } else {
            console.log(`Ошибка в файле ${file} не найдены 'data' или 'execute' свойства!`);
        }
    }
}

client.on("ready", () => {
    client.user.setPresence({
        activities: [{ name: `/help`, type: ActivityType.Watching, url: 'https://www.youtube.com/watch?v=_bYFu9mBnr4&ab_channel=CalebCurry' }],
        status: 'idle',
    });
})

const embedError = new EmbedBuilder()
    .setColor('#bc0000')
    .setTitle('Error')
    .setDescription(`Unknown error, check the console for more information.`)

client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);

        if (!command) {
            console.error(`No command matching ${interaction.commandName} was found.`);
            return;
        }

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({embeds: [embedError], ephemeral: true});
            } else {
                await interaction.reply({embeds: [embedError], ephemeral: true});
            }
        }
    }
});

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args: any[]) => event.execute(...args));
    } else {
        client.on(event.name, (...args: any[]) => event.execute(...args));
    }
}

client.login(process.env.BOT_TEST_TOKEN);