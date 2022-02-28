const { Client, Message, MessageEmbed } = require("discord.js");
const { Queue } = require("distube");

module.exports = {
  name: "volume",
  aliases: ["v"],
  category: "Music",
  cooldown: 4,
  userPermissions: [],
  botPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  description: "Change the volume for the current song.",
  usage: "volume <quantity>",

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

      // If no volume args provided, return current queue's volume
      if (!args[0]) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#57F287")
              .setDescription(`${client.emotes.success} Current volume is set to **${queue.volume}%**.`)
          ]
        })
      }
      // Define the volume variable
      const volume = parseInt(args[0]) || Number(args[0]);

      // If the args provided aren't numbers, return a warning message
      if (isNaN(volume)) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} That is not a valid argument. **You can only use numbers!**.`)
          ]
        })
      }

      // If volume range is below 1 or above 100, return a warning message
      if (Number(volume) < 1 || Number(volume) > 100) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} You can only set the volume range between 1 and 100.`)
          ]
        })
      }

      // If everything above is executed correctly, we set the queue's volume and send a confirmation message
      await queue.setVolume(Number(volume));
      // Send a confirmation message
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor("#57F287")
            .setDescription(`${client.emotes.success} Volume set to **${volume}%**.`)
        ]
      })
    } catch (e) {
      //Catch if there are any errors
      console.log(`[VOLUME_COMMAND]: ${e}`);
    }
  }
}