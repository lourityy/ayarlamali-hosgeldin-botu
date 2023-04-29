const Discord = require('discord.js');
const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const louritydb = require("croxydb");
// lourity - discord.gg/altyapilar
module.exports = {
    name: "hoşgeldin-sistemi",
    description: "Hoşgeldin sistemini ayarlarsınız.",
    type: 1,
    options: [
        {
            name: "hoşgeldin-kanalı",
            description: "Giriş/Çıkış mesajlarının atılacağı kanal.",
            type: 7,
            required: true,
            channel_types: [0]
        },
    ],
    run: async (client, interaction) => {

        const yetki_embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komudu kullanabilmek için `Yönetici` yetkisine sahip olmalısın.")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki_embed], ephemeral: true })

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("⚙️")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("hg_ayarlar" + interaction.user.id)
            )
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("🗑️")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("message_delete" + interaction.user.id)
            )

        const hg_channel = interaction.options.getChannel('hoşgeldin-kanalı')

        const ayar_embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`> **Hoşgeldin sistemi başarıyla ayarlandı** (${hg_channel})🛎️\n\n\`⚙️\` butonuna basarak ayarlarını yapmaya devam et!`)
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }) || null)

        louritydb.set(`hosgeldin_channel_${interaction.guild.id}`, hg_channel.id)
        interaction.reply({ embeds: [ayar_embed], components: [row] })
    }
};
