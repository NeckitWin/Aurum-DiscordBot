import {PrismaClient} from "@prisma/client";
import {BitField, Guild} from "discord.js";

const client = new PrismaClient()

const guildRepository = {
    async getGuild(id: string) {
        const guildId = BigInt(id)
        return client.guild.findFirst({
            where: {id: guildId}
        })
    },

    async upsertGuild(guild: Guild) {
        const id = BigInt(guild.id)
        const data = {
            id: id,
            name: guild.name
        }

        return client.guild.upsert({
            where: {id: id},
            create: data,
            update: data
        })
    },

    async updateEmoji(guild: Guild, emoji: string) {
        const guildId = BigInt(guild.id);

        const data = {
            id: guildId,
            name: guild.name,
            emoji: emoji
        }

        return client.guild.update({
            where: {id: guildId},
            data: data
        })
    },

    async updateAllowDisableEmoji (guildId: string, allow: boolean) {
        const id = BigInt(guildId);
        const data = {
            id: id,
            allowDisableEmoji: allow
        }

        return client.guild.update({
            where: {id: id},
            data: data
        })
    }
}

export default guildRepository;