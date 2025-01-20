import {PrismaClient} from "@prisma/client";

const client = new PrismaClient()

const lvlRepository = {
    async getRolesLVL(id: string) {
        const guildId = BigInt(id);
        return client.lvlRoles.findMany({where: {guildId: guildId}})
    },

    async upsertRoleLVL(guildID: string, roleID: string, streak: number) {
        const guildId = BigInt(guildID);
        const roleId = BigInt(roleID);
        const data = {
            guildId: guildId,
            roleId: roleId,
            streak: streak
        }

        return client.lvlRoles.upsert({
            where: {roleId_guildId: {roleId: roleId, guildId: guildId}},
            create: data,
            update: data
        })
    },

    async deleteRoleLVL(guildID: string, roleID: string) {
        const guildId = BigInt(guildID);
        const roleId = BigInt(roleID);
        return client.lvlRoles.delete({
            where: {roleId_guildId: {roleId: roleId, guildId: guildId}}
        })
    }

}

export default lvlRepository