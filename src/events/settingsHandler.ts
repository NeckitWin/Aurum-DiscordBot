import {
    ActionRowBuilder,
    RoleSelectMenuBuilder,
    ButtonBuilder,
    ButtonInteraction,
    ButtonStyle,
    EmbedBuilder,
    Events
} from "discord.js";
import userRepository from "../database/repository/userRepository";
import memberGuildRepository from "../database/repository/memberGuildRepository";
import guildRepository from "../database/repository/guildRepository";
import updateMembers from "../base/updateMembers";

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction: ButtonInteraction) {
        try {
            if (!interaction.isButton()) return;
            const customIds = ['showUserSettings', 'showGuildSettings', 'setVisibleEmoji',
                'setCustomEmoji', 'setPremium', 'allowDisableEmoji', 'addRoles',
                'lvlRolesSettings', 'addLVLRoles', 'updateAllNicknames'];
            const {customId} = interaction;
            if (!customIds.includes(customId)) return;
            if (interaction.user.id !== interaction.message.interaction?.user.id) return interaction.reply({
                content: 'Command is not available for you',
                ephemeral: true
            });
            if (!interaction.guild) return;
            const member = await interaction.guild.members.fetch(interaction.user.id);
            if (!await memberGuildRepository.getMemberGuild(interaction.guild, interaction.user.id)) await memberGuildRepository.upsertMemberGuild(interaction.guild, member.user, new Date());
            if (customId === 'showUserSettings' || customId === 'setVisibleEmoji') {
                const userData = await userRepository.getById(interaction.user.id);
                const memberData = await memberGuildRepository.getMemberGuild(interaction.guild, interaction.user.id);
                const isPremium = userData?.premium;
                let isVisibleEmoji = memberData?.isVisibleEmoji;
                const premEmoji = userData?.premiumEmoji;

                if (customId === 'setVisibleEmoji') {

                    const guildData = await guildRepository.getGuild(interaction.guild.id);
                    let allowDisableEmoji = guildData?.allowDisableEmoji;
                    if (!allowDisableEmoji && !isPremium) {
                        await memberGuildRepository.updateVisibleEmoji(interaction.user.id, interaction.guild.id, true);
                        await interaction.reply({
                            content: 'On this server, you cannot disable emoji in your nickname',
                            ephemeral: true
                        });
                    }
                    await memberGuildRepository.updateVisibleEmoji(interaction.user.id, interaction.guild.id, !isVisibleEmoji);
                    isVisibleEmoji = !isVisibleEmoji;
                }

                const embed = new EmbedBuilder()
                    .setTitle('User settings')
                    .setDescription('User premium, allows you to use more cool features');

                const buttonVisibleEmoji = new ButtonBuilder()
                    .setLabel(`Visible emoji is: ${isVisibleEmoji ? 'on' : 'off'}`)
                    .setCustomId('setVisibleEmoji')
                    .setEmoji('👀')
                    .setStyle(ButtonStyle.Primary);

                const buttonCustomEmoji = new ButtonBuilder()
                    .setLabel('Set custom emoji')
                    .setCustomId('setCustomEmoji')
                    .setEmoji('👑')
                    .setStyle(ButtonStyle.Primary);

                const buttonPremium = new ButtonBuilder()
                    .setLabel(`Premium`)
                    .setCustomId('setPremium')
                    .setEmoji('👑')
                    .setStyle(isPremium ? ButtonStyle.Success : ButtonStyle.Danger);

                const rowButtons = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(buttonVisibleEmoji, buttonPremium);

                const rowPremFeatures = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(buttonCustomEmoji);

                await interaction.update({embeds: [embed], components: [rowButtons, rowPremFeatures]});

            } else if (customId === 'showGuildSettings' || customId === 'allowDisableEmoji' || customId === 'addRoles' || customId === 'updateAllNicknames') {

                const guildData = await guildRepository.getGuild(interaction.guild.id);
                const guildEmoji = guildData?.emoji;
                let allowDisableEmoji = guildData?.allowDisableEmoji;

                if (customId === 'allowDisableEmoji') {
                    await guildRepository.updateAllowDisableEmoji(interaction.guild.id, !allowDisableEmoji);
                    allowDisableEmoji = !allowDisableEmoji;
                }

                if (customId === 'updateAllNicknames') {
                    await updateMembers(interaction.guild);
                    await interaction.reply({content: 'All nicknames have been updated', ephemeral: true});
                }

                const embedGuildSettings = new EmbedBuilder()
                    .setTitle('Guild settings')
                    .setDescription(`Emoji for the server:${guildEmoji}\n` +
                        `1. Allow disable emoji for members: ${allowDisableEmoji ? 'on' : 'off'}`);

                const buttonAllowDisableEmoji = new ButtonBuilder()
                    .setLabel('1. ' + (allowDisableEmoji ? 'Disable' : 'Allow'))
                    .setCustomId('allowDisableEmoji')
                    .setStyle(allowDisableEmoji ? ButtonStyle.Danger : ButtonStyle.Success);

                const buttonAddRoles = new ButtonBuilder()
                    .setLabel('Role settings')
                    .setCustomId('lvlRolesSettings')
                    .setEmoji('👑')
                    .setStyle(ButtonStyle.Primary);

                const buttonUpdateAllNicknames = new ButtonBuilder()
                    .setLabel('Update all nicknames')
                    .setCustomId('updateAllNicknames')
                    .setEmoji('🔄')
                    .setStyle(ButtonStyle.Secondary);

                const buttonDeleteServerStreak = new ButtonBuilder()
                    .setLabel('Delete server streak')
                    .setCustomId('deleteServerStreak')
                    .setEmoji('🗑️')
                    .setStyle(ButtonStyle.Danger);

                const rowButtons = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(buttonAllowDisableEmoji, buttonAddRoles, buttonUpdateAllNicknames, buttonDeleteServerStreak);

                await interaction.update({embeds: [embedGuildSettings], components: [rowButtons]});


            } else if (customId === 'lvlRolesSettings') {

                const roleLVLMenu = new RoleSelectMenuBuilder()
                    .setCustomId('addLVLRoles')
                    .setPlaceholder('Choose a role');

                const buttonAddLVLRole = new ButtonBuilder()
                    .setLabel('Add role')
                    .setCustomId('addLVLRole')
                    .setStyle(ButtonStyle.Success);

                const buttonEditLVLRole = new ButtonBuilder()
                    .setLabel('Edit roles')
                    .setCustomId('editLVLRoles')
                    .setStyle(ButtonStyle.Primary);

                const buttonReturn = new ButtonBuilder()
                    .setLabel('Return')
                    .setCustomId('showGuildSettings')
                    .setStyle(ButtonStyle.Secondary);

                const rowRoleLVL = new ActionRowBuilder<RoleSelectMenuBuilder>()
                    .addComponents(roleLVLMenu);

                const rowButtons = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents([buttonAddLVLRole, buttonEditLVLRole, buttonReturn]);


                const embedLVLSettings = new EmbedBuilder()
                    .setTitle('Role settings')
                    .setDescription('Choose a role to add or edit');

                await interaction.update({embeds: [embedLVLSettings], components: [rowRoleLVL, rowButtons]});
            }


        } catch (err) {
            console.error(err);
        }
    }
}