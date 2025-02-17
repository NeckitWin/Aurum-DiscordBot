import { PrismaClient } from "@prisma/client";
import {Guild, User} from "discord.js";
import guildRepository from "./guildRepository";
import userRepository from "./userRepository";

const client = new PrismaClient();

const memberGuildRepository = {
    async getMembersGuild(guild: Guild) {
        const guildId = BigInt(guild.id);
        return client.guildMemberData.findMany({
            where: { guildId: guildId }
        });
    },

    async getMemberGuild(guild: Guild, userId: string) {
        const guildId = BigInt(guild.id);
        return client.guildMemberData.findFirst({
            where: { guildId: guildId, userId: BigInt(userId) }
        });
    },

    async upsertMemberGuild(guild: Guild, user: User, date: Date) {
        const guildId = BigInt(guild.id);
        const userId = BigInt(user.id);
        const nickname = user.displayName;
        let streak = 1;
        let updateMessageDate = date;

        const getUser = await userRepository.getById(user.id);
        const getGuild = await guildRepository.getGuild(guild.id);
        if (!getUser) await userRepository.upsert(user);
        if (!getGuild) await guildRepository.upsertGuild(guild);


        let lastActivity;
        const day = 86400000;
        const getData = await memberGuildRepository.getMemberGuild(guild, user.id);
        if (getData) {
            lastActivity = getData.lastMessage;
            const timeDifference = date.getTime() - lastActivity.getTime();
            streak = getData.streak;
            if (timeDifference <= day) {
                updateMessageDate = lastActivity;
            } else if (timeDifference > day && timeDifference <= (day*2)) {
                streak++;
                updateMessageDate = date;
            } else if (timeDifference > (day*2)) {
                streak = 1;
                updateMessageDate = date;
            }
        }

        return client.guildMemberData.upsert({
            where: { guildId_userId: { guildId: guildId, userId: userId } },
            create: {
                guildId: guildId,
                userId: userId,
                nickname: nickname,
                streak: streak,
                lastMessage: updateMessageDate
            },
            update: {
                streak: streak,
                nickname: nickname,
                lastMessage: updateMessageDate
            }
        });
    },


    async updateVisibleEmoji(userID: string, guildID:string , isVisibleEmoji: boolean) {
        const userId = BigInt(userID);
        const guildId = BigInt(guildID);

        return client.guildMemberData.update({
            where: { guildId_userId: { guildId: guildId, userId: userId } },
            data: {
                isVisibleEmoji: isVisibleEmoji
            }
        })
    },

};

export default memberGuildRepository;