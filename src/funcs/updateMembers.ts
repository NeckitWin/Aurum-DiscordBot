import {Guild, PermissionsBitField} from "discord.js";
import memberGuildRepository from "../database/repository/memberGuildRepository";
import guildRepository from "../database/repository/guildRepository";

const updateMembers = async (guild: Guild) => {
    try {
        const getMembersFromDB = await memberGuildRepository.getMembersGuild(guild);
        const guildData = await guildRepository.getGuild(guild.id);
        const guildEmoji = guildData?.emoji || '';

        const client = guild.members.me ?? await guild.members.fetchMe();
        if (!client.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
            console.warn(`У бота нет права "Управление никнеймами" на сервере ${guild.name}`);
            return;
        }

        await Promise.all(guild.members.cache.map(async (member) => {
            if (member.user.bot || member.id === guild.ownerId) return;

            const botRolePosition = client.roles.highest.position;
            const memberRolePosition = member.roles.highest.position;
            if (botRolePosition <= memberRolePosition) return;

            const memberData = getMembersFromDB.find(memberDB => memberDB.userId.toString() === member.id);
            if (!memberData) return;

            const memberName = memberData.nickname || member.displayName;
            const memberStreak = memberData.streak || 0;
            const newNickname = memberStreak >= 1
                ? `${memberName} ${guildEmoji}${memberStreak}`.substring(0, 32)
                : memberName;

            if (member.nickname !== newNickname) {
                try {
                    await member.setNickname(newNickname, 'Обновление никнеймов');
                } catch (error) {
                    console.error(`Ошибка обновления никнейма для ${member.user.tag} на сервере ${guild.name}:`, error);
                }
            }
        }));
    } catch (err) {
        console.error(`Error updating members on server: ${guild.name}:`, err);
    }
};

export default updateMembers;