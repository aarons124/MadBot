const { Permissions } = require("discord.js");
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

  run: (client, message, args) => {
    
    try {
      if (!message.member.permissions.has(Permissions.FLAGS.MANAGE_MESSAGES)) {
        return message.reply({ content: `${client.emotes.error} No tienes los permisos necesarios [\`GESTIONAR_MENSAJES\`] para usar este comando.` });
      }

      const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
      const duration = args[1];
      const winners = args[2];
      const prize = args.slice(3).join(" ");

      if (!channel) {
        return message.reply({ content: `${client.emotes.error} Tienes que mencionar el canal donde se iniciara el sorteo.` });
      }

      if (!channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.VIEW_CHANNEL, { checkAdmin: true })) {
        return message.reply({ content: `${client.emotes.error} No tengo permiso para \`VER\` ese canal.` })
      }

      if (!channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.SEND_MESSAGES, { checkAdmin: true })) {
        return message.reply({ content: `${client.emotes.error} No tengo permiso para \`ENVIAR_MENSAJES\` en ese canal.` })
      }

      if (!channel.permissionsFor(message.guild.me).has(Permissions.FLAGS.EMBED_LINKS, { checkAdmin: true })) {
        return message.reply({ content: `${client.emotes.error} No tengo permiso para \`INSERTAR_ENLACES\` en ese canal.` })
      }

      if (isNaN(ms(duration))) {
        return message.reply({ content: `${client.emotes.error} Tienes que especificar la duracion del sorteo (1m, 1h, 1d, etc).` });
      }

      if (!winners) {
        return message.reply({ content: `${client.emotes.error} Tienes que especificar la cantidad de ganadores para el sorteo.` });
      }

      if (isNaN(winners)) {
        return message.reply({ content: `${client.emotes.error} Introduce un numero valido de ganadores.` })
      }

      if (!prize) {
        return message.reply({ content: `${client.emotes.error} Tienes que especificar el premio del sorteo.` });
      }

      client.giveawaysManager.start(channel, {
        duration: ms(duration),
        winnerCount: Number(winners),
        prize: prize,
        embedColorEnd: "#2f3136",
        messages: {
          giveaway: '🎉🎉 **SORTEO** 🎉🎉',
          giveawayEnded: '🎉🎉 **SORTEO TERMINADO** 🎉🎉',
          drawing: 'Termina en: {timestamp}',
          dropMessage: 'Sé el primero en reaccionar con 🎉 !',
          inviteToParticipate: 'Reacciona con 🎉 para participar!',
          winMessage: 'Felicidades {winners}! Ganaste el sorteo para **{this.prize}**!',
          embedFooter: '{this.winnerCount} ganador(es)',
          noWinner: 'Sorteo cancelado, no hay participaciones válidas.',
          hostedBy: 'Alojado por: {this.hostedBy}',
          winners: 'Ganador(es):',
          endedAt: 'Terminó en',
        }
      }).then(async () => {
        return message.reply({ content: `${client.emotes.sorteo} El sorteo para \`${prize}\` a sido iniciado en ${channel}.`})
      });
    } catch (e) {
      console.log(`[GSTART_COMMAND]: ${e}`);
    }
  }
}