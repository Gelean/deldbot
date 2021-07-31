const PlexAPI = require('plex-api')
const config = require("../.env/config.json")

// Initialize Plex
var plex = new PlexAPI({
  hostname: config.plex.hostname,
  port: config.plex.port,
  username: config.plex.username,
  password: config.plex.password,
  token: config.plex.token
})

// Check Plex Server Information
plex.query('/').then(function (result) {
  console.log('Sever: %s' + '\n' + 'Plex Version: %s',
    result.MediaContainer.friendlyName,
    result.MediaContainer.version)
}, function (err) {
  console.error('The Plex server appears to be down, go yell at ' + config.owner.id, err)
})
// console.log(plex);
