const { Collection, Message, MessageEmbed } = require("discord.js");
const { getPrefix } = require("../../Functions/GetPrefix");
const { escapeRegex } = require("../../Functions/EscapeRegex");

/**
 * @param {Message} message
 */

module.exports = async (client, message) => {

  if (!message.guild) return;
  if (message.author.bot) return;
  if (message.channel.type === "DM") return;

  const prefix = await getPrefix(message);
  const prefixregex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`);
  if (!prefixregex.test(message.content)) return;

  const [matchedPrefix] = message.content.match(prefixregex);
  const args = message.content.slice(matchedPrefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if (command.length === 0) {
    if (matchedPrefix.includes(client.user.id)) {
      const mentionEmbed = new MessageEmbed()
        .setColor("#2f3136")
        .setDescription(`Here is my prefix **${prefix}**`)

      return message.reply({ embeds: [mentionEmbed] });
    }
  }

  if (!command) return;
  const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
  if (!cmd) return;

  if (!client.cooldowns.has(cmd.name)) {
    client.cooldowns.set(cmd.name, new Collection())
  }

  if (!message.channel.permissionsFor(message.guild.me).has("EMBED_LINKS")) {
    return message.reply({ content: `${client.emotes.error} I\'m missing the [\`EMBEDS_LINKS\`] permission.`})
  }

  const now = Date.now();
  const timestamps = client.cooldowns.get(cmd.name);
  const cooldownAmount = (cmd.cooldown) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply({ content: `${client.emotes.stopwatch} Please wait **${timeLeft.toFixed(0)} more second(s)** before using the **${cmd.name}** command again.` }).then((sent) => {
        setTimeout(() => {
          sent.delete();
        }, 10000)
      });
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    await cmd.run(client, message, args);
  } catch (error) {
    console.error(error);
  }
}