const package = require('../../package.json')

module.exports = {
  name: 'repo',
  description: 'Link to Deldbot\'s repository',
  args: false,
  options: [],
  usage: '',
  guildOnly: true,
  execute (interaction) {
    interaction.reply(`Code for Deldbot resides at: ${package.repository.url}`)
  }
}
