const { Client, Message, MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "addtop",
  aliases: ["at"],
  cooldown: 4,
  category: "Music",
  userPermissions: [],
  botPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  description: "Add a song at the top of the queue",
  usage: "addtop <song name or URL>",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {
    try {
      // Checking if the member is in a channel

      const voiceChannel = message.member.voice.channel;
      if (!voiceChannel) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} You need to be in a channel first.`)
          ]
        })
      }

      // Checking if the member is in the same channel as the client

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
      // If no args were provided, return a warning message
      if (!args.join(" ")) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} Please provide a URL or search term.`)
          ]
        })
      }

      // Join the member's channel
      await client.distube.voices.join(voiceChannel).then(async () => {
        // Play the song
        await client.distube.play(
          voiceChannel,
          args.join(" "),
          {
            skip: false,
            position: 1,
            member: message.member,
            textChannel: message.channel,
            message: message
          }
        );
      });
    } catch (e) {
      // Catch if there is any errors
      console.log(`[PLAY_COMMAND]: ${e}`);
    }
  }
}