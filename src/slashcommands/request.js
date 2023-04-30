const config = require('../../.env/config.json')
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'request',
  description: 'Make a request',
  args: true,
  options: [{ name: 'request', description: 'The media requested', type: ApplicationCommandOptionType.String, required: true }],
  usage: '[request]',
  guildOnly: true,
  execute (interaction) {
    const request = interaction.options.getString('request')
    interaction.reply(`${interaction.user.toString()} requests ${request} from <@${config.owner.id}>`)
  }
}