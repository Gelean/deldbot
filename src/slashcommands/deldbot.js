const config = require('../../.env/config.json')
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'deldbot',
  description: 'Deldbot awakens',
  args: true,
  options: [{ name: 'command', description: 'The command for Deldbot', type: ApplicationCommandOptionType.String, required: false },
            { name: 'target', description: 'The target for Deldbot', type: ApplicationCommandOptionType.String, required: false }],
  usage: '',
  guildOnly: true,
  execute (interaction) {
    const command = interaction.options.getString('command')
    const target = interaction.options.getString('target')

    if (interaction.user.id !== config.owner.id) {
      interaction.reply('Deldbot does not recognize your authority')
    } else if (command === null || target === null || command !== 'destroy') {
      interaction.reply('Awaiting orders')
    } else if (target === '<@' + config.discord.id + '>') {
      message.channel.send('I cannot comply with that order')
    } else if (command === 'destroy' && target === config.owner.id && interaction.user.id === config.owner.id) {
      interaction.reply('No valid target identified for Deldbot to destroy')
    } else if (command === 'destroy' && target !== config.owner.id && interaction.user.id === config.owner.id) {
      interaction.reply(`Deldbot heeds the call of the last Deld and destroys ${target}\nhttps://i.imgur.com/yha5vhb.gifv`)
    } else {
      interaction.reply('Deldbot could not process your command')
    }
  }
}