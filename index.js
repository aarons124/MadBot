const { Client, Collection, Intents, Options } = require("discord.js");
const { DiscordTogether } = require("discord-together");
const { emojis } = require("./Util/Emojis");
const client = new Client({
  makeCache: Options.cacheWithLimits({
    ApplicationCommandManager: 0,
    ChannelManager: Infinity,
    GuildChannelManager: Infinity,
    GuildManager: Infinity,
    GuildMemberManager: {
      maxSize: Infinity,
      sweepInterval: 1800,
      sweepFilter: () => (member) => {
        if (member.id === client.user.id) return false;
        if (member.voice.channelId && client.distube.voices.collection.some(e => e.channel.id === member.voice.channelId)) return false;
        return true;
      },
    },
    MessageManager: 20,
    PermissionOverwriteManager: Infinity,
    StageInstanceManager: Infinity,
    ThreadManager: Infinity,
    ThreadMemberManager: 0,
    UserManager: {
      maxSize: Infinity,
      sweepInterval: 1800,
      sweepFilter: () => (user) => {
        if (user.id === client.user.id) return false;
        if (user.mine) return false;
        return true;
      },
    },
    VoiceStateManager: Infinity
  }),
  restTimeOffset: 500	,
  restGlobalRateLimit: 50,
  allowedMentions: {
    parse: ["users"],
    repliedUser: true
  },
  presence: {
    status: "online",
    activities: [{
      name: "m;help | @MadBot help",
      type: "PLAYING"
    }]
  },
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ]
});

// Declaring global variables
client.emotes = emojis;
client.aliases = new Collection();
client.commands = new Collection();
client.cooldowns = new Collection();
client.discordTogether = new DiscordTogether(client);

// Loading files
["commandsHandler", "eventsHandler"].forEach(handler => {
  require(`./Handlers/${handler}`)(client);
});

client.login(process.env.BOT_TOKEN);