import {
    ChatInputCommandInteraction, EmbedBuilder,
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
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const emoji: string | null = interaction.options.getString('emoji');
        const guild = interaction.guild as Guild;
        const embed = new EmbedBuilder().setColor('#ae0000')
        if (!guild) {
            embed.setDescription('This command is only available in servers');
            return await interaction.reply({embeds: [embed], ephemeral: true});
        }
        if (!emoji) return await interaction.reply({content: 'Emoji is required', ephemeral: true});
        if (!emoji.match(/[\u{1F300}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u)) {
            embed.setDescription('This is not an emoji').setColor('#ae0000');
            return await interaction.reply({embeds: [embed], ephemeral: true});
        }
        if (!await guildRepository.getGuild(guild.id)) await guildRepository.upsertGuild(guild);
        await guildRepository.updateEmoji(guild, emoji);
        embed.setDescription(`Emoji set to ${emoji}`).setColor('#248045');
        await interaction.reply({embeds: [embed]});
    }
}