import {Client, Events, Guild} from "discord.js";
import updateMembers from "../base/updateMembers";

module.exports = {
    name: Events.ClientReady,
    async execute(client: Client) {
        console.log(`${client.user?.username} is ready!✅`);

        const now = new Date();
        const next = new Date(now.getTime());
        next.setHours(0, 0, 0, 0);

        if (next.getTime() <= now.getTime()) {
            next.setDate(next.getDate() + 1);
        }

        const timeout = next.getTime() - now.getTime();
        setTimeout(function startDailyTask() {
            for (const guild of client.guilds.cache.values()) {
                updateMembers(guild as Guild);
            }
            setTimeout(startDailyTask, 1000 * 60 * 60 * 24);
        }, timeout);
    }
};