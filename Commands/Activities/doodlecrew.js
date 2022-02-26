const { Client, Message, MessageEmbed, Permissions } = require("discord.js");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 */

module.exports = {
  name: "doodlecrew",
  aliases: [""],
  cooldown: 4,
  category: "Activities",
  userPermissions: [],
  botPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  description: "Create a doodle-crew sesion",
  usage: "doodlecrew",

  run: async (client, message, args) => {
    try {
      if (!message.guild.me.permissions.has(Permissions.FLAGS.CREATE_INSTANT_INVITE)) {
        return message.reply({ content: `${client.emotes.error} Necesito el permiso de \`crear_invitaciones\` para poder ejecutar el comando.`})
      }

      const channel = message.member.voice.channelId;
      if (!channel) {
        return message.reply({ content: `${client.emotes.error} Tienes que estar en un canal de voz primero.`})
      }

      client.discordTogether.createTogetherCode(channel, "doodlecrew").then(async (invite) => {
        return message.reply({ content: `${client.emotes.success} Sesion de Doodlecrew creada en:\n ${invite.code}`})
      }).catch(() => { return message.reply({ content: `${client.emotes.error} Ocurrio un error al crear la sesion, intenta de nuevo mas tarde.` })});

    } catch (e) {
      console.log(`[BAN_COMMAND]: ${e}`);
    }
  }
}