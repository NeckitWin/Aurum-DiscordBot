import {Events, Guild, Message} from 'discord.js';
import guildRepository from '../database/repository/userRepository';
import memberGuildRepository from "../database/repository/memberGuildRepository";

module.exports = {
    name: Events.MessageCreate,
    async execute(message: Message) {
        const {author} = message;
        const guild = message.guild as Guild;
        if (author.bot) return;
        await memberGuildRepository.upsertMemberGuild(guild, author, new Date());
        const data:any = await memberGuildRepository.getMemberGuild(guild, author);
        await message.reply(`Your current streak is ${data.streak}`);
    }
}