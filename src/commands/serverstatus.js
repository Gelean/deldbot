const PlexAPI = require('plex-api')
const config = require('../../.env/config.json')

// Initialize Plex
var plex = new PlexAPI({
  hostname: config.plex.hostname,
  port: config.plex.port,
  username: config.plex.username,
  password: config.plex.password,
  token: config.plex.token
})

module.exports = {
  name: 'serverstatus',
  description: 'Returns the status of the Plex server',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 1,
  aliases: ['ss'],
  execute (message, args) {
    plex.query('/').then(function (result) {
      message.channel.send('The Plex server appears to be up')
    }, function (err) {
      message.channel.send(`The Plex server appears to be down, go yell at ${config.owner.id}`)
    })
  }
}