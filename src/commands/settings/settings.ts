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
                .setTitle('Settings')
                .setDescription('Use /emoji to set an emoji for your nickname')
                .setColor('#248045')

            const buttonUserSettings = new ButtonBuilder()
                .setLabel('User settings')
                .setCustomId('showUserSettings')
                .setEmoji('🔧')
                .setStyle(ButtonStyle.Success);

            const buttonGuildSettings = new ButtonBuilder()
                .setLabel('Server settings')
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