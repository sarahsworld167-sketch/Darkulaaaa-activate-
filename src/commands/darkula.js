const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require('discord.js');

const activate = require('../handlers/activate');

const ALLOWED_USER_IDS = [
  '1420684626141249598',
  '1307666797318766606'
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('darkula')
    .setDescription('Darkula Activate commands')
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageChannels
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('activate')
        .setDescription('Create channels and send messages')
        .addStringOption(option =>
          option
            .setName('channel_name')
            .setDescription('Base name for the channels')
            .setRequired(true)
            .setMaxLength(50)
        )
        .addIntegerOption(option =>
          option
            .setName('channel_amount')
            .setDescription('Number of channels to create')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10)
        )
        .addStringOption(option =>
          option
            .setName('message')
            .setDescription('Message to send')
            .setRequired(true)
            .setMaxLength(1000)
        )
        .addIntegerOption(option =>
          option
            .setName('message_count')
            .setDescription('Messages per channel')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(3)
        )
    ),

  async execute(interaction) {
    const isAdmin = interaction.memberPermissions?.has(
      PermissionFlagsBits.ManageChannels
    );

    const isAllowedUser = ALLOWED_USER_IDS.includes(
      interaction.user.id
    );

    if (!isAdmin && !isAllowedUser) {
      return interaction.reply({
        content: '❌ You are not allowed to use this command.',
        ephemeral: true
      });
    }

    if (interaction.options.getSubcommand() === 'activate') {
      return activate.execute(interaction);
    }
  }
};
