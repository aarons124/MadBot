const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
  name: "queue",
  aliases: ["q"],
  cooldown: 4,
  category: "Music",

  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */

  run: async (client, message, args) => {

    try {
      // Declaring the queue constant
      const queue = client.distube.getQueue(message);
      // If there isn't any queue or the queue is empty, return a message
      if (!queue || queue.songs.length < 1) {
        return message.reply({
          embeds: [
            new MessageEmbed()
            .setColor("#ED4245")
            .setDescription(`${client.emotes.error} The queue is currently empty.`)
          ]
        })
      }

      let page = args.length && Number(args[0]) ? Number(args[0]) : 1;

      const multiple = 10;

      const maxPages = Math.ceil(queue.songs.length / multiple);

      if (page < 1 || page > maxPages) page = 1;

      const end = page * multiple;
      const start = end - multiple;

      const tracks = queue.songs.slice(start, end);

      const qu = `${tracks.map((song, i) => `${start + (++i)}.- [${song.name}](${song.url}) • [${song.member.toString()}]`).join("\n")}`

      //song ${start + 1} to ${end > queue.songs.length ? `${queue.songs.length}` : `${end}`}

      message.reply({
        embeds: [
          new MessageEmbed()
          .setColor("#57F287")
          .setDescription(`${qu}`)
          .setFooter({ text: `Page ${page}/${maxPages} | ${queue.songs.length} song(s) queued`})
        ]
      })
    } catch (e) {
      // Catch if there is any errors
      console.log(`[QUEUE_COMMAND]: ${e}`);
    }
  }
}