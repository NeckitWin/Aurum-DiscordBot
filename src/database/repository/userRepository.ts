import { PrismaClient } from "@prisma/client";
import { User } from "discord.js";

const client = new PrismaClient()

module.exports = {
  async get() {
    return client.user.findFirst()
  },
  
  async insert(id: bigint, username: string, nickname: string, streak: number = 0) {
    return client.user.create({
      data: {
        id: id,
        username: username,
        nickname: nickname,
        streak: streak
      }
    })
  },
  
  async insertUser(user: User) {
    return client.user.create({
      data: {
        id: Number.parseInt(user.id),
        username: user.username,
        nickname: user.displayName,
        streak: 0
      }
    })
  },
  
  async update(id: bigint | undefined, username: string | undefined, nickname: string | undefined, streak: number = 0) {
    client.user.update({
      where: {
        id: id
      },
      data: {
        id: id,
        username: username,
        nickname: nickname,
        streak: streak
      }
    })
  },
  
  async updateUser(user: User) {
    let id = Number.parseInt(user.id)
    
    client.user.update({
      where: {
        id: id
      },
      data: {
        id: id,
        username: user.username,
        nickname: user.displayName,
      }
    })
  }
}