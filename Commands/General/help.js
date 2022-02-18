const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "help",
  aliases: [],
  cooldown: 4,
  category: "General",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: (client, message, args) => {

    try {
      if (!args[0]) {
        const General = message.client.commands.filter(x => x.category == 'General').map((x) => '`' + x.name + '`').join(', ');
        const Activities = message.client.commands.filter(x => x.category == 'Actividades').map((x) => '`' + x.name + '`').join(', ');
        const Music = message.client.commands.filter(x => x.category == 'Music').map((x) => '`' + x.name + '`').join(', ');
        const Sorteos = message.client.commands.filter(x => x.category == 'Sorteos').map((x) => '`' + x.name + '`').join(', ');
        const Config = message.client.commands.filter(x => x.category == 'Administrador').map((x) => '`' + x.name + '`').join(', ');

        const helpEmbed = new MessageEmbed()
          .setColor("YELLOW")
          .setTitle("Menu de Ayuda")
          .setAuthor({ name: `${message.author.tag}`, iconURL: `${message.author.displayAvatarURL({ dynamic: true, format: "png" })}` })
          .setDescription(`Hola **${message.author.tag}**, aqui te dejo mis comandos para que sepas usarme.`)
          .addFields(
            { name: "**General**", value: `${General}`, inline: false },
            { name: "**Administrador**", value: `${Config}`, inline: false },
            { name: "**Sorteos**", value: `${Sorteos}`, inline: false },
            { name: "**Actividades**", value: `${Activities}`, inline: false },
            { name: "**Musica**", value: `${Music}`, inline: false }
          )
          .setTimestamp(new Date().toDateString())
          .setThumbnail(message.guild.iconURL({ dynamic: true, format: "png" }))

        return message.reply({ embeds: [helpEmbed] });
      } else {

        const cmd = args.shift().toLowerCase();
        const command = client.comands.get(cmd) || client.aliases.get(client.commands.get(cmd));

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
              .setDescription("Los valores encerrados con [] son opcionales\nLos valores encerrados con <> son obligatorios.")
              .addFields(
                { name: "**Categoria**", value: `${command.category}`, inline: true },
                { name: "**Aliases**", value: `${command.aliases.length < 1 ? 'No aliases' : command.aliases.join(', ')}`, inline: true }
              )
          ]
        })
      }
    } catch (e) {
      console.log(`[HELP_COMMAND]: ${e}`);
    }
  }
}