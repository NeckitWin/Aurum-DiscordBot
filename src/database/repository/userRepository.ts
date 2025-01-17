import { PrismaClient } from "@prisma/client";
import { User } from "discord.js";

const client = new PrismaClient()

const userRepository = {
  async getById(id: string) {
    return client.user.findUnique({where: { id: BigInt(id) }})
  },
  
  async upsert(id: bigint, username: string) {
    let data = {
      id: id,
      username: username
    }
    return client.user.upsert({
      where: { id: id },
      create: data,
      update: data
    })
  },

  async updateVisibleEmoji(id: string, isVisibleEmoji: boolean) {
    const userId = BigInt(id);
    const data = {
      id: userId,
      isVisibleEmoji: isVisibleEmoji
    }

    return client.user.update({
      where: { id: userId },
      data: data
    })
  },
  
  async delete(id: bigint) {
    return client.user.delete({
      where: { id: id }
    })
  }
}

export default userRepository