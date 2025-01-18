import {Events, Message, PermissionsBitField} from 'discord.js';
import guildRepository from '../database/repository/guildRepository';
import memberGuildRepository from "../database/repository/memberGuildRepository";

module.exports = {
    name: Events.MessageCreate,
    async execute(message: Message) {
        try {
            const { author, member, guild } = message;
            if (!guild || author.bot || !member) return;

            const botMember = await guild.members.fetchMe();
            if (!botMember.permissions.has(PermissionsBitField.Flags.ManageNicknames)) {
                console.warn(`У бота нет права "Управление никнеймами" на сервере ${guild.name}`);
                return;
            }

            await memberGuildRepository.upsertMemberGuild(guild, author, new Date());
            const guildData = await guildRepository.getGuild(guild.id);
            if (!guildData) return;

            const emoji = guildData.emoji || '';
            const data = await memberGuildRepository.getMemberGuild(guild, author);
            if (!data || guild.ownerId === author.id) return;

            await updateMemberNickname(member, author.displayName, emoji, data.streak);
        } catch (err) {
            console.error(err);
        }
    }
};

async function updateMemberNickname(member: any, nickname: string, emoji: string, streak: number) {
    try {
        const newNickname = `${nickname} ${emoji}${streak}`.substring(0, 32);
        await member.setNickname(newNickname, 'Обновление очков пользователя');
    } catch (err) {
        console.error('Ошибка при обновлении ника участника', err);
    }
}
