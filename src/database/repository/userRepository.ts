import { PrismaClient } from "@prisma/client";
import { User } from "discord.js";

const client = new PrismaClient()

const userRepository = {
  async getById(id: string) {
    return client.user.findUnique({where: { id: BigInt(id) }})
  },
  
  async upsert(user: User) {
    const id = BigInt(user.id);
    const username = user.username;
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

  async delete(id: bigint) {
    return client.user.delete({
      where: { id: id }
    })
  }
}

export default userRepository