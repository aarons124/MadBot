const { Client, Message, MessageEmbed, Permissions } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "delete",
  aliases: ["dl"],
  cooldown: 4,
  category: "Giveaways",
  userPermissions: ["MANAGE_MESSAGES"],
  botPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  description: "Deletes an active giveaway in the server",
  usage: "delete <message_id>",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: (client, message, args) => {
    
    try {
      if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
        return message.reply({ embeds: [
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} You need the [\`MANAGE_MESSAGES\`] permission to use this command.`)
        ] }).then(sent => {
          setTimeout(() => {
            sent.delete();
          }, 10000)
        })
      }

      const msgId = args[0];

      if (!msgId) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} Provide the ID of the giveaway message you want to delete.`)
          ]
        })
      }

      if (isNaN(msgId)) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} Provide a valid message ID.`)
          ]
        })
      }

      if (message.guild.members.cache.find(u => u.id === msgId)) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} The provided ID belongs to a member of the server, try a valid message ID.`)
        ]})
      }

      if (message.guild.channels.cache.find(c => c.id === msgId)) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} The provided ID belongs to a server channel, try a valid message ID.`)
        ]})
      }

      if (client.guilds.cache.get(msgId)) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} The provided ID belongs to a server, try a valid message ID.`)
        ]})
      }

      const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === message.guildId && g.messageId === msgId);

      if (!giveaway) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} I couldn't find a giveaway on your server with this ID.`)
          ]
        })
      }

      client.giveawaysManager.delete(msgId, {
        doNotDeleteMessage: true
      }).then(() => {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#57F287")
              .setDescription(`${client.emotes.success} The giveaway has been successfully deleted.`)
          ]
        })
      }).catch(() => {
        return message.reply({ content: `${client.emotes.error} Error deleting giveaway. The giveaway has ended or there is no active giveaway.` })
      })

    } catch (e) {
      console.log(`[GDELETE_COMMAND]: ${e}`);
    }
  }
}