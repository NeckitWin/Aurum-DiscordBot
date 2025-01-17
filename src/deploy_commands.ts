require('dotenv').config();
import * as fs from "node:fs";
import * as path from "node:path";
import {REST} from '@discordjs/rest';
import {Routes} from 'discord-api-types/v9';
import {testBotId} from '../data/config.json';

const token:string = process.env.BOT_TEST_TOKEN as string;

const commands = [];
const deployFoldersPath = path.join(__dirname, './Commands');
const deployCommandFolders = fs.readdirSync(deployFoldersPath);

for (const folder of deployCommandFolders) {
    const commandsPath = path.join(deployFoldersPath, folder);
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(path.join(commandsPath, file));
        if (command.data && typeof command.data.toJSON === 'function') {
            commands.push(command.data.toJSON());
        } else {
            console.warn(`File ${file} does not export a command with data and a toJSON method.`);
        }
    }
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationCommands(testBotId),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (Error) {
        console.error(Error);
    }
})();