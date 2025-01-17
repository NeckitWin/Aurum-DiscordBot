import {Events, Guild, Message} from 'discord.js';
import guildRepository from '../database/repository/userRepository';
import memberGuildRepository from "../database/repository/memberGuildRepository";

module.exports = {
    name: Events.MessageCreate,
    async execute(message: Message) {
        try {
            const {author} = message;
            const guild = message.guild as Guild;
            if (author.bot) return;
            await memberGuildRepository.upsertMemberGuild(guild, author, new Date());
            const data = await memberGuildRepository.getMemberGuild(guild, author);
            const member = await guild.members.fetch(author.id);

            const notOwner = guild.ownerId !== author.id;
            if (data && notOwner) {
                const emoji = '🔥';
                const nickname = author.displayName;
                const streak = data.streak;
                await member.setNickname(`${nickname} ${emoji}${streak}`, `Update streak user`);

            }
        } catch (err) {
            console.error(err);
        }
    }
}