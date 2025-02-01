import {Guild, GuildMember, PermissionsBitField} from "discord.js";
import memberGuildRepository from "../database/repository/memberGuildRepository";
import guildRepository from "../database/repository/guildRepository";

const updateStreak = async (member: GuildMember, guild: Guild) => {
    try {
        if (member.user.bot) return;
        const guildData = await guildRepository.getGuild(guild.id);
        const guildEmoji = guildData?.emoji || '';

        let memberData = await memberGuildRepository.getMemberGuild(guild, member.id);
        if (!memberData) {
            await memberGuildRepository.upsertMemberGuild(guild, member.user, new Date());
            memberData = await memberGuildRepository.getMemberGuild(guild, member.id);
        }
        if (!memberData?.isVisibleEmoji) return;
        const client = guild.members.me ?? await guild.members.fetchMe();
        if (!client.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
            console.warn(`Bot has no permission to manage nicknames on server ${guild.name}`);
            return;
        }

        if (member.id === guild.ownerId) return;

        const botRolePosition = client.roles.highest.position;
        const memberRolePosition = member.roles.highest.position;
        if (botRolePosition <= memberRolePosition) return;

        const memberName = memberData?.nickname || member.displayName;
        const memberStreak = memberData?.streak || 0;
        const newNickname = memberStreak >= 1
            ? `${memberName} ${guildEmoji}${memberStreak}`.substring(0, 32)
            : memberName;

        if (member.nickname !== newNickname) {
            try {
                await member.setNickname(newNickname, 'Update streak');
            } catch (error) {
                console.error(`Error updating nickname for ${member.user.tag} on server ${guild.name}:`, error);
            }
        }
    } catch (err) {
        console.error(`Error updating members on server: ${guild.name}:`, err);
    }
};

export default updateStreak;