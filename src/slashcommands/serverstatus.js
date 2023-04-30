const PlexAPI = require('plex-api')
const config = require('../../.env/config.json')

// Initialize Plex
let plex = new PlexAPI({
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
  options: [],
  usage: '',
  guildOnly: true,
  execute (interaction) {
    plex.query('/').then(function (result) {
      interaction.reply('The Plex server appears to be up')
    }, function (err) {
      interaction.reply(`The Plex server appears to be down, go yell at <@${config.owner.id}>`)
    })
  }
}