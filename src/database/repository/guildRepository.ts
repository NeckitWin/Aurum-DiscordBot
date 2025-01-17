import {PrismaClient} from "@prisma/client";
import {BitField, Guild} from "discord.js";

const client = new PrismaClient()

const guildRepository = {
    async getGuild(id: string) {
        return client.guild.findFirst({
            where: {id: BigInt(id)}
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
    }
}

export default guildRepository;