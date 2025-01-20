import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, Events} from "discord.js";
import userRepository from "../database/repository/userRepository";
import memberGuildRepository from "../database/repository/memberGuildRepository";
import guildRepository from "../database/repository/guildRepository";

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: ButtonInteraction) {
        try {
            if (!interaction.isButton()) return;
            const customIds = ['showUserSettings', 'showGuildSettings', 'setVisibleEmoji', 'setCustomEmoji', 'setPremium', 'allowDisableEmoji', 'addRoles'];
            const {customId} = interaction;
            if (!customIds.includes(customId)) return;
            if (interaction.user.id !== interaction.message.interaction?.user.id) return interaction.reply({content: 'Команда вызвана не вами', ephemeral: true});
            if (!interaction.guild) return;
            if (!await memberGuildRepository.getMemberGuild(interaction.guild, interaction.user)) await memberGuildRepository.upsertMemberGuild(interaction.guild, interaction.user, new Date());
            if (customId === 'showUserSettings' || customId === 'setVisibleEmoji') {
                const userData = await userRepository.getById(interaction.user.id);
                const memberData = await memberGuildRepository.getMemberGuild(interaction.guild, interaction.user);
                const isPremium = userData?.premium;
                let isVisibleEmoji = memberData?.isVisibleEmoji;
                const premEmoji = userData?.premiumEmoji;

                if ( customId === 'setVisibleEmoji') {

                    const guildData = await guildRepository.getGuild(interaction.guild.id);
                    let allowDisableEmoji = guildData?.allowDisableEmoji;
                    if (!allowDisableEmoji && !isPremium) {
                        await memberGuildRepository.updateVisibleEmoji(interaction.user.id, interaction.guild.id, true);
                        await interaction.reply({content: 'На сервере отключена возможность скрытия эмодзи в нике', ephemeral: true});
                    }
                    await memberGuildRepository.updateVisibleEmoji(interaction.user.id, interaction.guild.id, !isVisibleEmoji);
                    isVisibleEmoji = !isVisibleEmoji;
                }

                const embed = new EmbedBuilder()
                    .setTitle('Настройки пользователя')
                    .setDescription('Премиум пользователя доступно больше крутых фич');

                const buttonVisibleEmoji = new ButtonBuilder()
                    .setLabel(`Видимость эмодзи: ${isVisibleEmoji ? 'включена' : 'выключена'}`)
                    .setCustomId('setVisibleEmoji')
                    .setEmoji('👀')
                    .setStyle(ButtonStyle.Primary);

                const buttonCustomEmoji = new ButtonBuilder()
                    .setLabel('Собственный эмодзи')
                    .setCustomId('setCustomEmoji')
                    .setEmoji('👑')
                    .setStyle(ButtonStyle.Primary);

                const buttonPremium = new ButtonBuilder()
                    .setLabel(`Премиум`)
                    .setCustomId('setPremium')
                    .setEmoji('👑')
                    .setStyle(isPremium ? ButtonStyle.Success : ButtonStyle.Danger);

                const rowButtons = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(buttonVisibleEmoji, buttonPremium);

                const rowPremFeatures = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(buttonCustomEmoji);

                await interaction.update({embeds: [embed], components: [rowButtons, rowPremFeatures]});

            } else if (customId === 'showGuildSettings' || customId === 'allowDisableEmoji' || customId === 'addRoles') {

                const guildData = await guildRepository.getGuild(interaction.guild.id);
                const guildEmoji = guildData?.emoji;
                let allowDisableEmoji = guildData?.allowDisableEmoji;

                if (customId === 'allowDisableEmoji') {
                    await guildRepository.updateAllowDisableEmoji(interaction.guild.id, !allowDisableEmoji);
                    allowDisableEmoji = !allowDisableEmoji;
                }

                const embedGuildSettings = new EmbedBuilder()
                    .setTitle('Настройки сервера')
                    .setDescription(`Эмодзи сервера: ${guildEmoji}\n`+
                        `1. Разрешить участникам сервера отключать эмодзи в нике: ${allowDisableEmoji ? 'да' : 'нет'}`);

                const buttonAllowDisableEmoji = new ButtonBuilder()
                    .setLabel('1. '+(allowDisableEmoji ? 'Отключить' : 'Включить'))
                    .setCustomId('allowDisableEmoji')
                    .setStyle(allowDisableEmoji ? ButtonStyle.Danger : ButtonStyle.Success);

                const buttonAddRoles = new ButtonBuilder()
                    .setLabel('Настройка ролей')
                    .setCustomId('addRoles')
                    .setEmoji('👑')
                    .setStyle(ButtonStyle.Primary);

                const rowButtons = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(buttonAllowDisableEmoji, buttonAddRoles );

                await interaction.update({embeds: [embedGuildSettings], components: [rowButtons]});


            }



        } catch (err) {
            console.error(err);
        }
    }
}