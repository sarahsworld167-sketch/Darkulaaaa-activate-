require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes
} = require('discord.js');

const darkula = require('./commands/darkula');

const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID || !GUILD_ID) {
  console.error(
    'Missing DISCORD_TOKEN, CLIENT_ID or GUILD_ID in .env'
  );
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();
client.commands.set(darkula.data.name, darkula);

const rest = new REST({ version: '10' })
  .setToken(DISCORD_TOKEN);

async function startBot() {
  try {
    console.log('Registering Darkula commands...');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      {
        body: [darkula.data.toJSON()]
      }
    );

    console.log('Slash command registered!');

    client.on('interactionCreate', async interaction => {
      if (!interaction.isChatInputCommand()) return;

      const command = client.commands.get(
        interaction.commandName
      );

      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error('Command error:', error);

        const response = {
          content: 'An unexpected error occurred.',
          ephemeral: true
        };

        if (interaction.deferred || interaction.replied) {
          await interaction.editReply(response).catch(() => {});
        } else {
          await interaction.reply(response).catch(() => {});
        }
      }
    });

    await client.login(DISCORD_TOKEN);
  } catch (error) {
    console.error('Startup error:', error);
    process.exit(1);
  }
}

client.once('ready', () => {
  console.log(`${client.user.tag} is online!`);
});

startBot();
