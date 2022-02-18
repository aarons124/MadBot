require("dotenv").config();
const mongoose = require("mongoose");
const { DisTube } = require("distube");
const { SpotifyPlugin } = require("@distube/spotify");
const { YtDlpPlugin } = require("@distube/yt-dlp");
const { MessageEmbed } = require("discord.js");
const { SoundCloudPlugin } = require("@distube/soundcloud");
const { removeMarkdown } = require("../../Functions/RemoveMarkdown");

module.exports = (client) => {

  require("../../Systems/GiveawaySystem")(client);
  // Ready log
  console.log(`${client.user.tag} is now ready on ${client.guilds.cache.size} guilds!`);

  // Connecting to MongoDB
  mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Mongoose events
  mongoose.connection
    .on("connecting", () => {
      console.log("Trying to establish a connection to MongoDB");
    })
    .on("connected", () => {
      console.log("Connection to MongoDB successfully established");
    })
    .on("error", (err) => {
      console.log(`Connection to MongoDB failed: ${err}`);
    })
    .on("disconnected", () => {
      console.log("MongoDB connection closed");
    });

  // Initializing the DisTube client
  client.distube = new DisTube(client, {
    emitNewSongOnly: true,
    leaveOnStop: true,
    leaveOnFinish: true,
    youtubeCookie: process.env.COOKIE,
    youtubeIdentityToken: process.env.YOUTUBE_TOKEN,
    emptyCooldown: 300,
    nsfw: true,
    emitAddSongWhenCreatingQueue: false,
    youtubeDL: false,
    plugins: [
      new SpotifyPlugin({
        parallel: true,
        emitEventsAfterFetching: true,
        api: {
          clientId: process.env.SPOTIFY_ID,
          clientSecret: process.env.SPOTIFY_SECRET
        }
      }),
      new SoundCloudPlugin(),
      new YtDlpPlugin()
    ],
    ytdlOptions: {
      highWaterMark: 1024 * 1024 * 64,
      quality: "highestaudio",
      format: "audioonly",
      liveBuffer: 60000,
      dlChunkSize: 1024 * 1024 * 64,
      filter: "audioonly",
    }
  })

    .on("initQueue", (queue) => {
      queue.autoplay = false;
      queue.volume = 100;
    })

    .on("playSong", (queue, song) => {
      return queue.textChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor("#5865F2")
            .setTitle("Now playing ♪")
            .setDescription(`__[${removeMarkdown(song.name)}](${song.url})__ by __[${song.uploader.name}](${song.uploader.url})__`)
        ]
      });
    })

    .on("addList", (queue, playlist) => {
      return queue.textChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor("#5865F2")
            .setDescription(`Queued **${playlist.name}** with **${playlist.songs.length}** songs`)
        ]
      });
    })

    .on("addSong", (queue, song) => {
      return queue.textChannel.send({
        embeds: [
          new MessageEmbed()
            .setColor("#5865F2")
            .setDescription(`Queued [${removeMarkdown(song.name)}](${song.url}) by [${song.member}]`)
        ]
      });
    })
    .on("error", (channel, error) => {
      channel.send({
        embeds: [
          new MessageEmbed()
            .setColor("RED")
            .setDescription(`${error.message}`)
        ]
      });
    })
}