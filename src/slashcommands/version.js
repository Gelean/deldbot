const package = require('../../package.json')

module.exports = {
  name: 'version',
  description: 'Return the running version of Deldbot',
  args: false,
  options: [],
  usage: '',
  guildOnly: true,
  execute (interaction) {
    interaction.reply(`Running version: ${package.version}`)
  }
}
