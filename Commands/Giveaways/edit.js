const { Client, Message, Permissions } = require("discord.js");
const ms = require("ms");

module.exports = {
  name: "edit",
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
        return message.reply({ content: `${client.emotes.error} Proporciona una ID del mensaje al sorteo que quieres editar.`});
      }

      if (isNaN(msgId)) {
        return message.reply({ content: `${client.emotes.error} Proporciona una ID de mensaje valida.`});
      }

      const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === message.guildId && g.messageId === msgId);

      if (!giveaway) {
        return message.reply({ content: `${client.emotes.error} No pude encontrar un sorteo en tu servidor con esa ID.`})
      }

      if (!args[1]) {
        return message.reply({ content: `${client.emotes.error} Tienes que especificar la opcion que quieres editar.\n\n Opciones:\n\`\`\`winners\`\`\`\n\`\`\`time\`\`\`\n\`\`\`prize\`\`\``})
      }

      const options = ["winners", "time", "prize"];

      if (!options.includes(args[1])) {
        return message.reply({ content: `${client.emotes.error} Esa no esa una opcion valida.\n\n Opciones validas:\n\`\`\`winners\`\`\`\n\`\`\`time\`\`\`\n\`\`\`prize\`\`\``})
      }

      switch (args[1]) {
        case "winners": {
          const winners = args[2];
          if (!winners) {
            return message.reply({ content: `${client.emotes.error} Tienes que especificar la cantidad de ganadores para el sorteo.` });
          }

          if (isNaN(winners)) {
            return message.reply({ content: `${client.emotes.error} Introduce un numero valido de ganadores.` })
          }

          client.giveawaysManager.edit(msgId, {
            newWinnerCount: Number(winners)
          }).then(() => {
            return message.reply({ content: `${client.emotes.success} El cantidad de ganadores del sorteo ha sido actualizada!.` })
          }).catch(() => {
            return message.reply({ content: `${client.emotes.error} Error al eliminar el sorteo. El sorteo ha finalizado o no hay ningun sorteo activo.` })
          })
        }
        break;
        case "time": {
          const time = args[2];
          if (!time) {
            return message.reply({ content: `${client.emotes.error} Tienes que especificar la duracion del sorteo (1m, 1h, 1d, etc).` });
          }

          client.giveawaysManager.edit(msgId, {
            addTime: ms(time)
          }).then(() => {
            return message.reply({ content: `${client.emotes.success} La duracion del sorteo ha sido actualizada!.` });
          }).catch(() => {
            return message.reply({ content: `${client.emotes.error} Error al eliminar el sorteo. El sorteo ha finalizado o no hay ningun sorteo activo.` })
          })
        }
        break;
        case "prize": {
          const prize = args.slice(2).join(" ");
          if (!prize) {
            return message.reply({ content: `${client.emotes.error} Tienes que especificar la duracion del sorteo (1m, 1h, 1d, etc).` });
          }

          client.giveawaysManager.edit(msgId, {
            newPrize: prize
          }).then(() => {
            return message.reply({ content: `${client.emotes.success} El premio del sorteo ha sido actualizado!.` });
          }).catch(() => {
            return message.reply({ content: `${client.emotes.error} Error al eliminar el sorteo. El sorteo ha finalizado o no hay ningun sorteo activo.` })
          })
        }
      }

    } catch (e) {
      console.log(`[GEDIT_COMMAND]: ${e}`);
    }
  }
}