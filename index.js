const { PermissionsBitField, EmbedBuilder, ButtonStyle, ChannelType, ActionRowBuilder, SelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, InteractionType, SelectMenuInteraction, ButtonBuilder, AuditLogEvent } = require("discord.js");
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const INTENTS = Object.values(GatewayIntentBits);
const PARTIALS = Object.values(Partials);
const Discord = require("discord.js")
const louritydb = require("croxydb")
const client = new Client({
    intents: INTENTS,
    allowedMentions: {
        parse: ["users"]
    },
    partials: PARTIALS,
    retryLimit: 3
});
// lourity - discord.gg/altyapilar
global.client = client;
client.commands = (global.commands = []);

const { readdirSync } = require("fs")
const { TOKEN } = require("./config.json");
readdirSync('./commands').forEach(f => {
    if (!f.endsWith(".js")) return;

    const props = require(`./commands/${f}`);

    client.commands.push({
        name: props.name.toLowerCase(),
        description: props.description,
        options: props.options,
        dm_permission: props.dm_permission,
        type: 1
    });

    console.log(`[COMMAND] ${props.name} komutu yüklendi.`)

});
readdirSync('./events').forEach(e => {

    const eve = require(`./events/${e}`);
    const name = e.split(".")[0];

    client.on(name, (...args) => {
        eve(client, ...args)
    });
    console.log(`[EVENT] ${name} eventi yüklendi.`)
});


client.login(TOKEN)

// Bir Hata Oluştu
process.on("unhandledRejection", (reason, p) => {
    console.log(reason, p);
})
// Hata oluştuğunda botun kapanmamasını sağlar | discord.gg/altyapilar
process.on("unhandledRejection", async (error) => {
    return console.log("Bir hata oluştu! " + error)
})
//
//
client.on('interactionCreate', async message => {
    if (message.customId === "message_delete" + message.user.id) {
        // sil butonu
        await message.deferUpdate()
        message.message.delete().catch(e => { })
    }
})
//
//
client.on('interactionCreate', async interaction => {

    if (interaction.customId === "hg_ayarlar" + interaction.user.id) {

        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) return await interaction.deferUpdate()

        let data = louritydb.get(`hosgeldin_channel_${interaction.guild.id}`)

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("⚙️")
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(true)
                    .setCustomId("kayit_ayarlar" + interaction.user.id)
            )
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("🗑️")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("message_delete" + interaction.user.id)
            )

        const sistem_kapali = new EmbedBuilder()
            .setColor("Red")
            .setDescription("> **Kayıt sistemi ayarlanmamış** 🛎️\n\n~~`⚙️` butonuna basarak ayarlarını yapmaya devam et!~~")
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }) || null)
            .setFooter({ text: "Sistemi açmak için /hoşgeldin-sistemi komudunu kullanabilirsin!" })

        if (!data) return interaction.update({ embeds: [sistem_kapali], components: [row] })
// lourity - discord.gg/altyapilar
        const row1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Giriş Mesajı")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("giris_mesaji" + interaction.user.id)
            )
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Çıkış Mesajı")
                    .setStyle(ButtonStyle.Secondary)
                    .setCustomId("cikis_mesaji" + interaction.user.id)
            )
            .addComponents(
                new ButtonBuilder()
                    .setEmoji("🗑️")
                    .setStyle(ButtonStyle.Danger)
                    .setCustomId("message_delete" + interaction.user.id)
            )

        const ayarlar_embed = new EmbedBuilder()
            .setColor("DarkButNotBlack")
            .setDescription("> Butonlara tıklayarak giriş ve çıkış mesajlarını ayarla!\n\nDeğişkenler:\n`{user}` : Kullanıcıyı etiketler.\n`{serverName}` : Sunucu adını yazar.\n`{memberCount}` : Sunucudaki toplam üye sayısını yazar.")
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }))
            .setFooter({ text: `${client.user.username || "Bot İsmi"}` })

        return interaction.update({ embeds: [ayarlar_embed], components: [row1] })
    }


    const modal = new ModalBuilder()
        .setCustomId('giris_form')
        .setTitle('Giriş Mesajını Ayarla')
    const u = new TextInputBuilder()
        .setCustomId('girismesaj')
        .setLabel('Giriş Mesajını Yazın')
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(200)
        .setPlaceholder('{user}, {serverName} sunucumuza katıldı! {memberCount} kişiyiz!')
        .setRequired(true)

    const row = new ActionRowBuilder().addComponents(u);
    modal.addComponents(row);

    //giriş mesajı
    if (interaction.customId === "giris_mesaji" + interaction.user.id) {
        await interaction.showModal(modal);
    }


    const modal1 = new ModalBuilder()
        .setCustomId('cikis_form')
        .setTitle('Çıkış Mesajını Ayarla')
    const u1 = new TextInputBuilder()
        .setCustomId('cikismesaj')
        .setLabel('Çıkış Mesajını Yazın')
        .setStyle(TextInputStyle.Short)
        .setMinLength(1)
        .setMaxLength(200)
        .setPlaceholder('{user}, {serverName} sunucumuzdan ayrıldı! {memberCount} kişiyiz!')
        .setRequired(true)

    const row1 = new ActionRowBuilder().addComponents(u1);
    modal1.addComponents(row1);

    //çıkış mesajı
    if (interaction.customId === "cikis_mesaji" + interaction.user.id) {
        await interaction.showModal(modal1);
    }

// lourity - discord.gg/altyapilar
    //giriş ayarlama
    if (interaction.customId === 'giris_form') {

        const sistem_kapali = new EmbedBuilder()
            .setColor("Red")
            .setDescription("> **Kayıt sistemi ayarlanmamış** 🛎️\n\n~~`⚙️` butonuna basarak ayarlarını yapmaya devam et!~~")
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }) || null)
            .setFooter({ text: "Sistemi açmak için /hoşgeldin-sistemi komudunu kullanabilirsin!" })

        let data = louritydb.get(`hosgeldin_channel_${interaction.guild.id}`)
        if (!data) return interaction.update({ embeds: [sistem_kapali], components: [row] })

        const giris_message = interaction.fields.getTextInputValue("girismesaj")

        const giris_msg = giris_message.replaceAll("{user}", `${interaction.user}`).replaceAll("{serverName}", `${interaction.guild.name}`).replaceAll("{memberCount}", `${interaction.guild.memberCount}`)

        louritydb.set(`giris_message_${interaction.guild.id}`, giris_message)
        return interaction.reply({ content: `${giris_msg} **olarak ayarlandı.**` })
    }


    //çıkış ayarlama
    if (interaction.customId === 'cikis_form') {

        const sistem_kapali = new EmbedBuilder()
            .setColor("Red")
            .setDescription("> **Kayıt sistemi ayarlanmamış** 🛎️\n\n~~`⚙️` butonuna basarak ayarlarını yapmaya devam et!~~")
            .setThumbnail(interaction.user.avatarURL({ dynamic: true }) || null)
            .setFooter({ text: "Sistemi açmak için /hoşgeldin-sistemi komudunu kullanabilirsin!" })

        let data = louritydb.get(`hosgeldin_channel_${interaction.guild.id}`)
        if (!data) return interaction.update({ embeds: [sistem_kapali], components: [row] })

        const cikis_message = interaction.fields.getTextInputValue("cikismesaj")

        const cikis_msg = cikis_message.replaceAll("{user}", `${interaction.user}`).replaceAll("{serverName}", `${interaction.guild.name}`).replaceAll("{memberCount}", `${interaction.guild.memberCount}`)

        louritydb.set(`cikis_message_${interaction.guild.id}`, cikis_message)
        return interaction.reply({ content: `${cikis_msg} **olarak ayarlandı.**` })
    }
})
// lourity - discord.gg/altyapilar

//hoşgeldin
client.on("guildMemberAdd", async member => {

    let data = louritydb.get(`hosgeldin_channel_${member.guild.id}`)
    if (!data) return;

    const channel = client.channels.cache.get(data)
    if (!channel) return;

    const message_data = louritydb.get(`giris_message_${member.guild.id}`)

    if (message_data) {
        const message = message_data.replaceAll("{user}", `${member}`).replaceAll("{serverName}", `${member.guild.name}`).replaceAll("{memberCount}", `${member.guild.memberCount}`)
        return channel.send({ content: `${message || "bir sorun oluştu"}` })
    } else {
        return channel.send({ content: `📥 ${member} sunucumuza katıldı! **${member.guild.memberCount}** kişi olduk 🎉` })
    }
})


//hoşçakal
client.on("guildMemberRemove", async member => {

    let data = louritydb.get(`hosgeldin_channel_${member.guild.id}`)
    if (!data) return;

    const channel = client.channels.cache.get(data)
    if (!channel) return;

    const message_data = louritydb.get(`cikis_message_${member.guild.id}`)
// lourity - discord.gg/altyapilar
    if (message_data) {
        const message = message_data.replaceAll("{user}", `${member}`).replaceAll("{serverName}", `${member.guild.name}`).replaceAll("{memberCount}", `${member.guild.memberCount}`)
        return channel.send({ content: `${message || "bir sorun oluştu"}` })
    } else {
        return channel.send({ content: `📤 ${member} sunucumuzdan ayrıldı! **${member.guild.memberCount}** kişi kaldık 😑` })
    }
})
// lourity - discord.gg/altyapilar
// lourity - discord.gg/altyapilar