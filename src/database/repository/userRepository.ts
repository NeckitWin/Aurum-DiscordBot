import { PrismaClient } from "@prisma/client";
import { User } from "discord.js";

const client = new PrismaClient()

const userRepository = {
  async getUser(id: string) {
    return client.user.findFirst({
        where: { id: BigInt(id) }
    })
  },

  async upsertUser(user: User) {
    const id = BigInt(user.id)
    const data = {
      id: id,
      username: user.username
    }

    return client.user.upsert({
      where: { id: id },
      create: data,
      update: data
    })
  }
}

export default userRepository;