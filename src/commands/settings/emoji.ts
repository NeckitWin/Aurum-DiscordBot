import {
    ChatInputCommandInteraction,
    Guild,
    PermissionsBitField,
    SlashCommandBuilder
} from "discord.js";
import guildRepository from "../../database/repository/guildRepository";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emoji')
        .setDescription('Set the emoji for the streak nickname')
        .setDescriptionLocalizations({
            ru: 'Установить эмодзи для ника'
        })
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild)
        .addStringOption(option => option
            .setName('emoji')
            .setDescription('The emoji for nickname')
            .setDescriptionLocalizations({
                ru: 'Эмодзи для ника'
            })
            .setRequired(true)
        )
    ,
    async execute(interaction: ChatInputCommandInteraction) {
        const emoji: string | null = interaction.options.getString('emoji') || '🔥';
        const guild = interaction.guild as Guild;
        // проверяем является ли символ эмодзи
        if (!guild) return await interaction.reply({
            content: 'This command can only be used in a server',
            ephemeral: true
        });
        if (emoji && !emoji.match(/[\u{1F000}-\u{1FFFF}]/u)) {
            return await interaction.reply({
                content: 'This is not an emoji',
                ephemeral: true
            });
        }
        await guildRepository.updateEmoji(guild, emoji);
        await interaction.reply({ content: `Emoji updated to ${emoji}` });

    }
}