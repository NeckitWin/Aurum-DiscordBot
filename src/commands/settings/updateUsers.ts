import {ChatInputCommandInteraction, EmbedBuilder, Guild, PermissionsBitField, SlashCommandBuilder} from "discord.js";
import updateMembers from "../../funcs/updateMembers";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('update')
        .setDescription('Update the users of the server')
        .setDescriptionLocalizations({
            ru: 'Обновить пользователей сервера'
        })
        .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
    async execute(interaction: ChatInputCommandInteraction) {
        const {guild} = interaction;
        await updateMembers(guild as Guild);
        await interaction.reply({content: 'Пользователи обновлены', ephemeral: true});
    }
}