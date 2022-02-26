const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "remove",
  aliases: ["rm", "del"],
  cooldown: 4,
  category: "Music",
  userPermissions: [],
  botPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  description: "Remove a song from the queue",
  usage: "remove <#song>",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {

    try {
      // Checking if the member is in a channel
      const voiceChannel = message.member.voice.channel;
      // If the member is not in a channel, return a message
      if (!voiceChannel) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} You need to be in a channel first.`)
          ]
        })
      }
      // If the client is in a channel but the member's channel is not the same as the client's channel, return a message
      if (message.guild.me.voice.channel && voiceChannel.id !== message.guild.me.voice.channel.id) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} You need to be in the same channel as me.`)
          ]
        })
      }
      // Declaring the queue constant
      const queue = await client.distube.getQueue(message);
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

      if (!args[0]) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} You must enter the song index you want to remove.`)
          ]
        })
      }

      const index = parseInt(args[0]) - 1;

      if (isNaN(index)) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} You must enter a valid song index.`)
          ]
        })
      }

      if (index === 0) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} You can\'t remove the current song.`)
          ]
        })
      }

      if (index < 1 || index > queue.songs.length) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} I couldn't find a song in that position.`)
          ]
        })
      }

      let track = queue.songs[index];

      await queue.songs.splice(track, index);

      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#57F287")
            .setDescription(`${client.emotes.success} Removed [${track.name}](${track.url}) from the queue.`)
        ]
      })

    } catch (e) {
      console.log(`[REMOVE_COMMAND]: ${e}`)
    }
  }
}