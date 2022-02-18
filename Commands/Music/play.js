const { Client, Message, MessageEmbed, Permissions } = require("discord.js");

module.exports = {
  name: "play",
  aliases: ["p"],
  cooldown: 4,
  category: "Music",

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

      // Checking permissions

      if (!voiceChannel.permissionsFor(message.guild.me).has(Permissions.FLAGS.VIEW_CHANNEL, { checkAdmin: true })) {
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor("#ED4245")
            .setDescription(`${client.emotes.error} I don\'t have permission to **view** your voice channel.`)
          ]
        })
      }

      if (!voiceChannel.permissionsFor(message.guild.me).has(Permissions.FLAGS.CONNECT, { checkAdmin: true })) {
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor("#ED4245")
            .setDescription(`${client.emotes.error} I don\'t have permission to **connect** to your voice channel.`)
          ]
        })
      }

      if (!voiceChannel.permissionsFor(message.guild.me).has(Permissions.FLAGS.SPEAK, { checkAdmin: true })) {
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor("#ED4245")
            .setDescription(`${client.emotes.error} I don\'t have permission to **speak** in your voice channel.`)
          ]
        })
      }

      if (voiceChannel.full) {
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor("#ED4245")
            .setDescription(`${client.emotes.error} I don\'t have permission to **connect** to your voice channel because it\'s full.`)
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
            position: 0,
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