const {
  ChannelType,
  PermissionFlagsBits
} = require('discord.js');

const config = require('../../config/config.json');

module.exports = {
  async execute(interaction) {
    const guild = interaction.guild;

    if (!guild) {
      return interaction.reply({
        content: 'This command must be used in a server.',
        ephemeral: true
      });
    }

    const channelName = interaction.options
      .getString('channel_name')
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .slice(0, 45);

    const amount = interaction.options.getInteger(
      'channel_amount'
    );

    const message = interaction.options.getString('message');

    const messageCount = interaction.options.getInteger(
      'message_count'
    );

    if (!channelName) {
      return interaction.reply({
        content: 'Please enter a valid channel name.',
        ephemeral: true
      });
    }

    if (amount > config.maxChannelsPerRun ||
        messageCount > config.maxMessagesPerChannel) {
      return interaction.reply({
        content: 'The requested amount exceeds the configured limits.',
        ephemeral: true
      });
    }

    const botMember = guild.members.me;

    if (!botMember ||
        !botMember.permissions.has(
          PermissionFlagsBits.ManageChannels
        ) ||
        !botMember.permissions.has(
          PermissionFlagsBits.ViewChannel
        ) ||
        !botMember.permissions.has(
          PermissionFlagsBits.SendMessages
        )) {
      return interaction.reply({
        content: 'The bot needs Manage Channels, View Channels and Send Messages permissions.',
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });

    let created = 0;
    let messagesSent = 0;
    let errors = 0;

    for (let i = 1; i <= amount; i++) {
      try {
        const channel = await guild.channels.create({
          name: `${channelName}-${i}`,
          type: ChannelType.GuildText,
          reason: `Requested by ${interaction.user.tag}`
        });

        created++;

        for (let j = 0; j < messageCount; j++) {
          try {
            await channel.send({
              content: message,
              allowedMentions: { parse: [] }
            });

            messagesSent++;
          } catch (error) {
            console.error('Message sending failed:', error.message);
            errors++;
            break;
          }
        }
      } catch (error) {
        console.error('Channel creation failed:', error.message);
        errors++;
      }
    }

    await interaction.editReply({
      content:
        `**Darkula Activate finished!**\n` +
        `Channels created: ${created}/${amount}\n` +
        `Messages sent: ${messagesSent}\n` +
        `Errors: ${errors}`
    });
  }
};
