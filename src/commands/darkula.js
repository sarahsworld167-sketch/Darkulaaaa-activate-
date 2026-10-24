const {
  SlashCommandBuilder,
  PermissionFlagsBits
} = require('discord.js');

const activate = require('../handlers/activate');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('darkula')
    .setDescription('Darkula Activate controls')
    .setDefaultMemberPermissions(
      PermissionFlagsBits.ManageChannels
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('activate')
        .setDescription('Create text channels and send a message')
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
            .setDescription('Number of channels to create (1-10)')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(10)
        )
        .addStringOption(option =>
          option
            .setName('message')
            .setDescription('Message to send in every channel')
            .setRequired(true)
            .setMaxLength(1000)
        )
        .addIntegerOption(option =>
          option
            .setName('message_count')
            .setDescription('Messages per channel (1-3)')
            .setRequired(true)
            .setMinValue(1)
            .setMaxValue(3)
        )
    ),

  async execute(interaction) {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.options.getSubcommand() !== 'activate') {
      return;
    }

    await activate.execute(interaction);
  }
};
