const { Client, VoiceState, Permissions } = require("discord.js");

/**
 * @param {Client} client
 * @param {VoiceState} oldState
 * @param {VoiceState} newState
 */

module.exports = async (client, oldState, newState) => {  
  // Establecer moderador en Stage Channels para poder reproducir musica
  if (newState.channelId && newState.channel.type === "GUILD_STAGE_VOICE" && newState.guild.me.voice.suppress) {
    if (newState.guild.me.permissions.has(Permissions.FLAGS.SPEAK) || newState.channel && newState.channel.permissionsFor(newState.guild.me).has(Permissions.FLAGS.SPEAK)) {
      newState.guild.me.voice.setSuppressed(false).catch(() => { });
    }
  }

  // Ensordecer al bot cada que entre a algun canal stage o de voz
  if (newState.id === client.user.id && newState.channelId !== oldState.channelId && !newState.guild.me.voice.deaf) {
    if (newState.guild.me.permissions.has(Permissions.FLAGS.DEAFEN_MEMBERS) || (newState.channel && newState.channel.permissionsFor(newState.guild.me).has(Permissions.FLAGS.DEAFEN_MEMBERS))) {
      newState.setDeaf(true).catch(() => { });
    }
  }

  // Evitar que quiten el ensordecimiento del bot
  if (newState.id === client.user.id && oldState.serverDeaf === true && newState.serverDeaf === false) {
    if (newState.guild.me.permissions.has(Permissions.FLAGS.DEAFEN_MEMBERS) || (newState.channel && newState.channel.permissionsFor(newState.guild.me).has(Permissions.FLAGS.DEAFEN_MEMBERS))) {
      newState.setDeaf(true).catch(() => { });
    }
  }
}