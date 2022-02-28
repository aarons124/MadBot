const { Client, Message, MessageEmbed, Permissions } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "start",
  aliases: ["st"],
  cooldown: 4,
  category: "Giveaways",
  userPermissions: ["MANAGE_MESSAGES"],
  botPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  description: "Starts a new giveaway in the server",
  usage: "start <channel> <duration> <winners> <prize>",
  
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
        ]})
      }

      const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
      const duration = args[1];
      const winners = args[2];
      const prize = args.slice(3).join(" ");

      if (!channel) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} You have to mention the channel where the giveaway will start.`)
        ]})
      }

      if (isNaN(channel.id)) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} That\'s not a valid channel ID.`)
        ]})
      }

      if (!channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.VIEW_CHANNEL, { checkAdmin: true })) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} I\'m missing the [\`VIEW_CHANNEL\`] in that channel.`)
        ]})
      }

      if (!channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.SEND_MESSAGES, { checkAdmin: true })) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} I\'m missing the [\`SEND_MESSAGES\`] in that channel.`)
        ]})
      }

      if (!channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.EMBED_LINKS, { checkAdmin: true })) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} I\'m missing the [\`EMBED_LINKS\`] in that channel.`)
        ]})
      }

      if (!duration || isNaN(ms(duration))) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} You have to specify the duration of this giveaway (1m, 1h, 1d, etc).`)
        ]})
      }

      if (!winners) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} You have to specify the number of winners for the giveaway.`)
        ]})
      }

      if (isNaN(winners)) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} Please enter a valid number of winners.`)
        ]})
      }

      if (!prize) {
        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} You have to specify a prize for this giveaway.`)
          ]
        })
      }

      client.giveawaysManager.start(channel, {
        duration: ms(duration),
        winnerCount: Number(winners),
        prize: prize,
        embedColor: message.guild.me.displayHexColor,
        embedColorEnd: "#2f3136",
        messages: {
          giveaway: '🎉 **GIVEAWAY** 🎉',
          giveawayEnded: '🎉 **GIVEAWAY ENDED** 🎉',
          drawing: 'Drawing: {timestamp}',
          dropMessage: 'Be the first to react with 🎉',
          inviteToParticipate: 'React with 🎉 to participate!',
          winMessage: {
            content: "{winners}",
            embed: new MessageEmbed()
              .setColor("BLUE")
              .setDescription(`${client.emotes.sorteo} Congratulations! You won the giveaway for **{this.prize}**`),
            replyToGiveaway: false
          },
          embedFooter: '{this.winnerCount} winner(s)',
          noWinner: 'Giveaway cancelled, no valid participations.',
          hostedBy: 'Hosted by: {this.hostedBy}',
          winners: 'Winner(s):',
          endedAt: 'Ended at',
          reaction: ':tadaBoombox:'
        }
      }).then(() => {
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor("BLUE")
            .setDescription(`${client.emotes.sorteo} The giveaway for **${prize}** has been started on ${channel}.`)
          ]
        })
      });
    } catch (e) {
      console.log(`[GSTART_COMMAND]: ${e}`);
    }
  }
}