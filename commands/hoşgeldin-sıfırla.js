const Discord = require('discord.js');
const { EmbedBuilder, PermissionsBitField, ActionRowBuilder, ButtonStyle, ButtonBuilder } = require("discord.js");
const louritydb = require("croxydb");
// lourity - discord.gg/altyapilar
module.exports = {
    name: "hoşgeldin-sıfırla",
    description: "Hoşgeldin sistemini sıfırlarsın.",
    type: 1,
    options: [],
    run: async (client, interaction) => {

        const yetki_embed = new EmbedBuilder()
            .setColor("Red")
            .setDescription("Bu komudu kullanabilmek için `Yönetici` yetkisine sahip olmalısın.")

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return interaction.reply({ embeds: [yetki_embed], ephemeral: true })

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`Hoşgeldin sistemi başarıyla sıfırlandı!`)

        louritydb.delete(`hosgeldin_channel_${interaction.guild.id}`)
        louritydb.delete(`giris_message_${interaction.guild.id}`)
        louritydb.delete(`cikis_message_${interaction.guild.id}`)
        return interaction.reply({ embeds: [embed] })
    }
};
