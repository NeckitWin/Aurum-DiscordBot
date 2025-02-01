import {Events, Message} from 'discord.js';
import updateStreak from "../base/updateStreak";

module.exports = {
    name: Events.MessageCreate,
    async execute(message: Message) {
        try {
            const { author, member, guild } = message;
            if (!guild || author.bot || !member) return;

            await updateStreak(member, guild);
        } catch (err) {
            console.error(err);
        }
    }
};