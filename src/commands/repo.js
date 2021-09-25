const package = require('../../package.json')

module.exports = {
  name: 'repo',
  description: 'Link to Deldbot\'s repository',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 1,
  aliases: ['repository'],
  execute (message, args) {
    message.channel.send(`Code for Deldbot resides at: ${package.repository.url}`)
  }
}
