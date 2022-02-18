const { Client, Collection, Intents, Options } = require("discord.js");
const { DiscordTogether } = require("discord-together");
const { emojis } = require("./Util/Emojis");
const client = new Client({
  makeCache: Options.cacheWithLimits({
    ApplicationCommandManager: 0,
    BaseGuildEmojiManager: 0,
    ChannelManager: Infinity,
    GuildChannelManager: Infinity,
    GuildBanManager: 0,
    GuildInviteManager: 0,
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
    GuildStickerManager: 0,
    MessageManager: 20,
    PermissionOverwriteManager: Infinity,
    PresenceManager: 0,
    ReactionManager: 0,
    ReactionUserManager: 0,
    RoleManager: Infinity,
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
    parse: ["users", "roles"],
    repliedUser: true
  },
  presence: {
    status: "online",
    activities: [{
      name: "%help",
      type: "PLAYING"
    }]
  },
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_INVITES
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