import {CommandInteraction, Guild, Interaction, SlashCommandBuilder} from "discord.js";
import memberGuildRepository from "../../database/repository/memberGuildRepository";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('leaders')
        .setDescription('Show the top 10 members with the highest streak'),
    async execute(interaction: CommandInteraction) {
        const guild = interaction.guild as Guild;
        const dataGuildMembers = await memberGuildRepository.getMembersGuild(guild);
        const topMembers = dataGuildMembers.sort((a, b) => b.streak - a.streak).slice(0, 10);
        const members = topMembers.map((member, index) => {
            return `${index + 1}. ${member.nickname} - ${member.streak} days`;
        });
        await interaction.reply({content: members.join('\n')});
    }
}