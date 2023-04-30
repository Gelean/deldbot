const fortunes = require('../data/8ball.json')
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: '8ball',
  description: 'Ask the Magic 8-Ball your question',
  args: true,
  options: [{ name: 'question', description: 'A yes or no question', type: ApplicationCommandOptionType.String, required: true }],
  usage: '[question]',
  guildOnly: true,
  execute (interaction) {
    interaction.reply(fortunes[Math.floor(Math.random() * fortunes.length)])
  }
}