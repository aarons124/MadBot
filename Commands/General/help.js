const { Client, Message, MessageEmbed } = require("discord.js");
const { getPrefix } = require("../../Functions/GetPrefix");

module.exports = {
  name: "help",
  aliases: [],
  cooldown: 4,
  category: "General",
  userPermissions: [],
  botPermissions: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
  description: "Help command, shows all the available commands",
  
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {

    try {
      if (!args[0]) {
        const General = message.client.commands.filter(x => x.category == 'General').map((x) => '`' + x.name + '`').join(', ');
        const Activities = message.client.commands.filter(x => x.category == 'Activities').map((x) => '`' + x.name + '`').join(', ');
        const Music = message.client.commands.filter(x => x.category == 'Music').map((x) => '`' + x.name + '`').join(', ');
        const Sorteos = message.client.commands.filter(x => x.category == 'Giveaways').map((x) => '`' + x.name + '`').join(', ');
        const Config = message.client.commands.filter(x => x.category == 'Administrador').map((x) => '`' + x.name + '`').join(', ');

        const helpEmbed = new MessageEmbed()
          .setColor(message.guild.me.displayHexColor)
          .addFields(
            { name: "**General**", value: `${General}`, inline: false },
            { name: "**Settings**", value: `${Config}`, inline: false },
            { name: "**Giveaways**", value: `${Sorteos}`, inline: false },
            { name: "**Activities**", value: `${Activities}`, inline: false },
            { name: "**Music**", value: `${Music}`, inline: false }
          )
          .setTimestamp(new Date())
          .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: "png" }))
          .setFooter({ text: `Type '${await getPrefix(message)}help <command>' for information about a command`})

        return message.reply({ embeds: [helpEmbed] });
        
      } else {

        const cmd = args.shift().toLowerCase();
        const command = client.commands.get(cmd) || client.aliases.get(client.commands.get(cmd));

        if (!command) {
          return message.reply({
            embeds: [
              new MessageEmbed()
                .setColor("#ED4245")
                .setDescription(`${client.emotes.error} I could't find that command.`)
            ]
          })
        }

        return message.reply({
          embeds: [
            new MessageEmbed()
              .setColor("ORANGE")
              .setTitle(`${command.name}`)
              .setDescription(`${command.description}`)
              .addFields(
                { name: "**Category**", value: `\`${command.category}\``, inline: true },
                { name: "**Aliases**", value: `\`${command.aliases.length < 1 ? 'No aliases' : command.aliases.join(', ')}\``, inline: true },
                { name: "**Cooldown**", value: `\`${command.cooldown} seconds\``, inline: true },
                { name: "**Usage**", value: `\`${await getPrefix(message)}${command.usage}\``, inline: true },
                { name: "**Member Permissions**", value: `${command.userPermissions.length < 1 ? '`No permissions needed`' : `\`${command.userPermissions.join(", ")}\``}`, inline: true },
                { name: "**Bot Permissions**", value: `${command.botPermissions.length < 1 ? 'No permissions needed' : `\`${command.botPermissions.join(", ")}\``}`, inline: true }
              )
              .setFooter({ text: "Syntaxis: [] optional | <> required"})
          ]
        })
      }
    } catch (e) {
      console.log(`[HELP_COMMAND]: ${e}`);
    }
  }
}