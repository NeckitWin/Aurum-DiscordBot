import { PrismaClient } from "@prisma/client";
import { Guild, User } from "discord.js";
import guildRepository from "./guildRepository";
import userRepository from "./userRepository";

const client = new PrismaClient();

const memberGuildRepository = {
    async getMemberGuild(guild: Guild, user: User) {
        const id = BigInt(guild.id) + BigInt(user.id);
        return client.guildMemberData.findFirst({
            where: { id: id }
        });
    },

    calculateStreak(existingMember: any, date: Date) {
        const lastMessageDate = existingMember.lastMessage;
        const timeDifference = date.getTime() - lastMessageDate.getTime();
        // const day = 86400000;
        const day = 10000;

        if (timeDifference > day * 2) {
            return 0;
        } else if (timeDifference > day) {
            return existingMember.streak + 1;
        } else {
            return existingMember.streak;
        }
    },

    async upsertMemberGuild(guild: Guild, user: User, date: Date, streak = 0) {
        const id = BigInt(guild.id) + BigInt(user.id);
        const guildId = BigInt(guild.id);
        const userId = BigInt(user.id);

        if (!await guildRepository.getGuild(guild.id)) {
            await guildRepository.upsertGuild(guild);
        }
        if (!await userRepository.getById(BigInt(user.id))) {
            await userRepository.upsertFromUser(user);
        }

        const existingMember = await client.guildMemberData.findFirst({
            where: { id: id }
        });

        const data: any = {
            id: id,
            guildId: guildId,
            userId: userId,
            nickname: user.displayName,
            lastMessage: date,
        };


        if (existingMember) {
            console.log(existingMember.lastMessage)
            const updateStreak = this.calculateStreak(existingMember, date);
            if (updateStreak !== existingMember.streak) {
                return client.guildMemberData.update({
                    where: { id: id },
                    data: data
                })
            }
        } else {
            data.streak = streak;
            return client.guildMemberData.create({
                data: data
            });
        }
    }
};

export default memberGuildRepository;