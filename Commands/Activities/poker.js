const { Client, Message, MessageEmbed, MessageActionRow, MessageButton, Permissions } = require("discord.js");

module.exports = {
  name: "poker",
  aliases: [""],
  cooldown: 4,
  category: "Activities",
  userPermissions: [],
  botPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  description: "Create a poker sesion",
  usage: "poker",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    try {
      if (!message.guild.me.permissions.has(Permissions.FLAGS.CREATE_INSTANT_INVITE)) {
        return message.reply({ embeds: [
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} I\'m missing the [\`CREATE_INVITE\`] permission.`)
        ]})
      }

      const channel = message.member.voice.channelId;
      if (!channel) {
        return message.reply({ embeds: [
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} You need to be in a channel first.`)
        ]})
      }

      client.discordTogether.createTogetherCode(channel, "poker").then(async (invite) => {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#57F287")
              .setDescription(`${client.emotes.success} **Poker session created.** Click the button to join the activity`)
          ],
          components: [
            new MessageActionRow()
            .addComponents(
              new MessageButton()
              .setStyle("LINK")
              .setLabel("Join")
              .setURL(`${invite.code}`)
            )
          ]
        })
      }).catch(() => { return message.reply({ content: `${client.emotes.error} There was an error creating the session, please try again` })});
    } catch (e) {
      console.log(`[BAN_COMMAND]: ${e}`);
    }
  }
}