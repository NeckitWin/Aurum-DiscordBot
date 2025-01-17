import {SlashCommandBuilder, CommandInteraction, EmbedBuilder} from "discord.js";

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Показывает список всех команд'),
    async execute(interaction: CommandInteraction) {
        try {
            const embed = new EmbedBuilder()
                .setTitle('Список команд')
                .setColor('#0099ff')
                .setDescription('Список всех команд бота')
                .addFields(
                    {name: '/help', value: 'Показывает список всех команд'},
                    {name: '/ping', value: 'Показывает задержку бота'}
                )
                .setTimestamp();

            await interaction.reply({embeds: [embed]});
        } catch (err) {
            console.error(err);
        }
    }
}