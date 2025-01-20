import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, Events} from "discord.js";
import userRepository from "../database/repository/userRepository";
import memberGuildRepository from "../database/repository/memberGuildRepository";
import guildRepository from "../database/repository/guildRepository";

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: ButtonInteraction) {
        try {
            if (!interaction.isButton()) return;
            const customIds = ['showUserSettings', 'showGuildSettings', 'setVisibleEmoji'];
            const {customId} = interaction;
            if (!customIds.includes(customId)) return;
            if (interaction.user.id !== interaction.message.interaction?.user.id) return interaction.reply({content: 'Команда вызвана не вами', ephemeral: true});
            if (!interaction.guild) return;
            if (customId === 'showUserSettings' || customId === 'setVisibleEmoji') {
                const userData = await userRepository.getById(interaction.user.id);
                const memberData = await memberGuildRepository.getMemberGuild(interaction.guild, interaction.user);
                const isPremium = userData?.premium;
                let isVisibleEmoji = memberData?.isVisibleEmoji;
                const premEmoji = userData?.premiumEmoji;

                if ( customId === 'setVisibleEmoji') {
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

            } else if (customId === 'showGuildSettings') {
                const embedGuildSettings = new EmbedBuilder()
                    .setTitle('Настройки сервера')
                    .setDescription('Управляйте ролями и другими настройками бота');

                const buttonAddRoles = new ButtonBuilder()
                    .setLabel('Настройка ролей')
                    .setCustomId('addRoles')
                    .setEmoji('👑')
                    .setStyle(ButtonStyle.Primary);

                const rowButtons = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(buttonAddRoles);

                await interaction.update({embeds: [embedGuildSettings], components: [rowButtons]});


            }



        } catch (err) {
            console.error(err);
        }
    }
}