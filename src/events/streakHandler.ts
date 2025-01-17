import {Events, Guild, Message} from 'discord.js';
import guildRepository from '../database/repository/guildRepository';
import memberGuildRepository from "../database/repository/memberGuildRepository";

module.exports = {
    name: Events.MessageCreate,
    async execute(message: Message) {
        try {
            const {author} = message;
            const guild = message.guild as Guild;
            if (author.bot) return;
            await memberGuildRepository.upsertMemberGuild(guild, author, new Date());
            const guildData = await guildRepository.getGuild(guild.id);
            const emoji = guildData?.emoji;
            const data = await memberGuildRepository.getMemberGuild(guild, author);
            const member = await guild.members.fetch(author.id);

            const notOwner = guild.ownerId !== author.id;
            if (data && notOwner) {
                const nickname = author.displayName;
                const streak = data.streak;
                await member.setNickname(`${nickname} ${emoji}${streak}`, `Update streak user`);

            }
        } catch (err) {
            console.error(err);
        }
    }
}