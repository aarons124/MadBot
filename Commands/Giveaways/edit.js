const { Client, Message, MessageEmbed, Permissions } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "edit",
  aliases: ["ed"],
  cooldown: 4,
  category: "Giveaways",
  userPermissions: ["MANAGE_MESSAGES"],
  botPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  description: "Edit an active giveaway in the server ",
  usage: "edit <option> <new_value>",
  
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

      const msgId = args[0];

      if (!msgId) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} Provide an ID of the giveaway message you want to edit.`)
        ]})
      }

      if (isNaN(msgId)) {
        return message.reply({ content: `${client.emotes.error} Proporciona una ID de mensaje valida.`});
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
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} I couldn't find a giveaway on the server with this ID.`)
        ]})
      }

      let options = ["winners", "time", "prize"]

      if (!args[1]) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} You have to specify the option you want to edit.`)
          .addField("Options", `${options.join("\n")}`, false)
        ]})
      }

      if (!options.includes(args[1].toLowerCase())) {
        return message.reply({ embeds:[
          new MessageEmbed()
          .setColor("#ED4245")
          .setDescription(`${client.emotes.error} That is not a valid option.`)
          .addField("Options", `${options.join("\n")}`, false)
        ]})
      }

      switch (args[1]) {
        case "winners": {
          const winners = args[2];
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

          client.giveawaysManager.edit(msgId, {
            newWinnerCount: Number(winners)
          }).then(() => {
            return message.reply({ embeds:[
              new MessageEmbed()
              .setColor("#57F287")
              .setDescription(`${client.emotes.success} The number of winners has been updated.`)
            ]})
          }).catch(() => {
            return message.reply({ content: `${client.emotes.error} There was an error editing this giveaway, please try again.` })
          })
        }
        break;
        case "time": {
          const time = args[2];
          if (!time || isNaN(ms(time))) {
            return message.reply({ embeds:[
              new MessageEmbed()
              .setColor("#ED4245")
              .setDescription(`${client.emotes.error} You have to specify the new duration of this giveaway (1m, 1h, 1d, etc).`)
            ]})
          }

          client.giveawaysManager.edit(msgId, {
            addTime: ms(time)
          }).then(() => {
            return message.reply({
              embeds: [
                new MessageEmbed()
                  .setColor("#57F287")
                  .setDescription(`${client.emotes.success} The time has been updated!`)
              ]
            })
          }).catch(() => {
            return message.reply({ content: `${client.emotes.error} There was an error editing this giveaway, please try again.` })
          })
        }
        break;
        case "prize": {
          const prize = args.slice(2).join(" ");
          if (!prize) {
            return message.reply({
              embeds: [
                new MessageEmbed()
                  .setColor("#ED4245")
                  .setDescription(`${client.emotes.error} You have to specify a new prize for this giveaway.`)
              ]
            })
          }

          client.giveawaysManager.edit(msgId, {
            newPrize: prize
          }).then(() => {
            return message.reply({
              embeds: [
                new MessageEmbed()
                  .setColor("#57F287")
                  .setDescription(`${client.emotes.success} The prize has been updated!`)
              ]
            })
          }).catch(() => {
            return message.reply({ content: `${client.emotes.error} There was an error editing this giveaway, please try again.` })
          })
        }
      }
    } catch (e) {
      console.log(`[GEDIT_COMMAND]: ${e}`);
    }
  }
}