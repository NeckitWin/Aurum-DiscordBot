import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, Events} from "discord.js";
import userRepository from "../database/repository/userRepository";

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: ButtonInteraction) {
        try {
            if (!interaction.isButton()) return;
            const customIds = ['showUserSettings', 'showGuildSettings', 'setVisibleEmoji'];
            const {customId} = interaction;
            if (!customIds.includes(customId)) return;
            if (interaction.user.id !== interaction.message.interaction?.user.id) return interaction.reply({content: 'Команда вызвана не вами', ephemeral: true});

            if (customId === 'showUserSettings' || customId === 'setVisibleEmoji') {
                const userData = await userRepository.getById(interaction.user.id);
                const isPremium = userData?.premium;
                let isVisibleEmoji = userData?.isVisibleEmoji;
                const premEmoji = userData?.premiumEmoji;

                if ( customId === 'setVisibleEmoji') {
                    await userRepository.updateVisibleEmoji(interaction.user.id, !isVisibleEmoji);
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

            }



        } catch (err) {
            console.error(err);
        }
    }
}