import { PrismaClient } from "@prisma/client";
import { User } from "discord.js";

const client = new PrismaClient()

module.exports = {
  async get() {
    return client.user.findFirst()
  },
  
  async upsert(id: bigint, username: string, nickname: string, streak: number = 0) {
    let data = {
      id: id,
      username: username,
      nickname: nickname,
      streak: streak
    }
    return client.user.upsert({
      where: { id: id },
      create: data,
      update: data
    })
  },
  
  async upsertFromUser(user: User, streak: number) {
    let id = BigInt(user.id)
    let data = {
      id: id,
      username: user.username,
      nickname: user.displayName,
      streak: streak
    }
    
    return client.user.upsert({
      where: { id: id },
      create: data,
      update: data
    })
  }
}