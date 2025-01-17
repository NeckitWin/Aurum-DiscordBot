import {
    ButtonBuilder,
    CommandInteraction,
    ButtonStyle,
    EmbedBuilder,
    SlashCommandBuilder,
    ActionRowBuilder
} from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Show the settings of the bot')
        .setDescriptionLocalizations({
            ru: 'Показать настройки бота'
        }),
    async execute(interaction: CommandInteraction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('Настройки')
                .setDescription('Используйте /emoji для установки эмодзи для ника')
                .setColor('#248045')

            const buttonUserSettings = new ButtonBuilder()
                .setLabel('Настройки пользователя')
                .setCustomId('showUserSettings')
                .setEmoji('🔧')
                .setStyle(ButtonStyle.Success);

            const buttonGuildSettings = new ButtonBuilder()
                .setLabel('Настройки сервера')
                .setCustomId('showGuildSettings')
                .setEmoji('👑')
                .setStyle(ButtonStyle.Secondary);

            const rowButtons = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(buttonUserSettings, buttonGuildSettings);

            await interaction.reply({embeds: [embed], components: [rowButtons]});
        } catch (err) {
            console.error(err);
        }
    }
}