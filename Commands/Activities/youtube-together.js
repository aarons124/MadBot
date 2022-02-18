const { Client, Message, Permissions } = require("discord.js");

/**
 * @param {Client} client
 * @param {Message} message
 * @param {String[]} args
 */

module.exports = {
  name: "youtube-together",
  aliases: ["yt", "youtube"],
  cooldown: 4,
  category: "Actividades",

  run: async (client, message, args) => {
    try {
      if (!message.guild.me.permissions.has(Permissions.FLAGS.CREATE_INSTANT_INVITE)) {
        return message.reply({ content: `${client.emotes.error} Necesito el permiso de \`crear_invitaciones\` para poder ejecutar el comando.`})
      }

      const channel = message.member.voice.channelId;
      if (!channel) {
        return message.reply({ content: `${client.emotes.error} Tienes que estar en un canal de voz primero.`})
      }

      client.discordTogether.createTogetherCode(channel, "youtube").then(async (invite) => {
        return message.reply({ content: `${client.emotes.success} Sesion de YouTube-Together creada en:\n ${invite.code}`})
      }).catch(() => { return message.reply({ content: `${client.emotes.error} Ocurrio un error al crear la sesion, intenta de nuevo mas tarde.` })});
    } catch (e) {
      console.log(`[BAN_COMMAND]: ${e}`);
    }
  }
}