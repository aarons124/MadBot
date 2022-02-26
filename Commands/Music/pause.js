const { Client, Message, MessageEmbed } = require("discord.js");
const { Queue } = require("distube");

/**
 * @param {Queue} queue
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 */

module.exports = {
  name: "pause",
  aliases: ["wait"],
  cooldown: 4,
  category: "Music",
  userPermissions: [],
  botPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  description: "Pause the current queue.",
  usage: "pause",

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
      // if the queue is already paused, warn
      if (queue.paused) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} The queue is already paused.`)
          ]
        })
      }
      // If everything above is executed correctly, we pause the queue and react to the message as a confirmation
      await queue.pause(message);
      await message.react("⏸️");
    } catch (e) {
      // Catch if there are any errors
      console.log(`[PAUSE_COMMAND]: ${e}`);
    }
  }
}