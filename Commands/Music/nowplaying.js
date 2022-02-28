const { Client, Message, MessageEmbed } = require("discord.js");
const { createBar } = require("../../Functions/CreateBar");

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  cooldown: 4,
  category: "Music",
  userPermissions: [],
  botPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  description: "Shows the current song playing",
  usage: "nowplaying",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {

    try {
      // Declaring the queue constant
      const queue = client.distube.getQueue(message);
      // If there isn't any queue or the queue is empty, return a message
      if (!queue || queue.songs.length < 1) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} The queue is currently empty.`)
          ]
        })
      }

      const track = queue.songs[0];

      message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(message.guild.me.displayHexColor)
            .setTitle(`${track.name}`)
            .setDescription(`${createBar(queue)}`)
        ]
      });
    } catch (e) {
      // Catch if there is any errors
      console.log(`[SKIP_COMMAND]: ${e}`);
    }
  }
}