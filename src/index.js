require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes
} = require('discord.js');

const darkula = require('./commands/darkula');

const { DISCORD_TOKEN, CLIENT_ID } = process.env;

if (!DISCORD_TOKEN || !CLIENT_ID) {
  console.error(
    'Missing DISCORD_TOKEN or CLIENT_ID in environment variables.'
  );

  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();

client.commands.set(
  darkula.data.name,
  darkula
);

const rest = new REST({
  version: '10'
}).setToken(DISCORD_TOKEN);

async function registerCommands() {
  console.log('Registering global slash commands...');

  await rest.put(
    Routes.applicationCommands(CLIENT_ID),
    {
      body: [
        darkula.data.toJSON()
      ]
    }
  );

  console.log('Global slash commands registered!');
}

client.once('ready', () => {
  console.log(
    `Darkula Activate is online as ${client.user.tag}`
  );

  console.log(
    `Connected to ${client.guilds.cache.size} server(s).`
  );
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const command = client.commands.get(
    interaction.commandName
  );

  if (!command) {
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error('Command execution error:', error);

    const response = {
      content: 'An error occurred while executing the command.',
      ephemeral: true
    };

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(response).catch(() => {});
    } else {
      await interaction.reply(response).catch(() => {});
    }
  }
});

async function startBot() {
  try {
    await registerCommands();

    await client.login(DISCORD_TOKEN);
  } catch (error) {
    console.error('Failed to start Darkula Activate:', error);

    process.exit(1);
  }
}

startBot();
