import {CommandInteraction, SlashCommandBuilder} from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with Pong!'),
    async execute(interaction:CommandInteraction) {
        const ping = Date.now() - interaction.createdTimestamp;
        await interaction.reply(`Pong! ${ping}ms`);
    }
}