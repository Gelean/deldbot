const package = require('../../package.json')

module.exports = {
  name: 'version',
  description: 'Return the running version of Deldbot',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 1,
  aliases: ['ver'],
  execute (message, args) {
    message.channel.send(`Running version: ${package.version}`)
  }
}
