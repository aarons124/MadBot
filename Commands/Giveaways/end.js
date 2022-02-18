const { Client, Message, Permissions } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "end",
  aliases: ["ed"],
  cooldown: 4,
  category: "Sorteos",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: (client, message, args) => {
    
    try {
      if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
        return message.reply({ content: `${client.emotes.error} No tienes los permisos necesarios [\`GESTIONAR_MENSAJES\`] para usar este comando.` });
      }

      const msgId = args[0];

      if (!msgId) {
        return message.reply({ content: `${client.emotes.error} Proporciona una ID del mensaje al sorteo que quieres terminar.`});
      }

      if (isNaN(msgId)) {
        return message.reply({ content: `${client.emotes.error} Proporciona una ID de mensaje valida.`});
      }

      const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === message.guildId && g.messageId === msgId);

      if (!giveaway) {
        return message.reply({ content: `${client.emotes.error} No pude encontrar un sorteo en tu servidor con esa ID.`})
      }

      client.giveawaysManager.end(msgId).then(() => {
        return message.reply({ content: `${client.emotes.success} El sorteo ha sido terminado con exito!.`})
      }).catch(() => {
        return message.reply({ content: `${client.emotes.error} Error al terminar el sorteo. El sorteo ya ha sido finalizado o no hay ningun sorteo activo.` })
      })

    } catch (e) {
      console.log(`[GDELETE_COMMAND]: ${e}`);
    }
  }
}