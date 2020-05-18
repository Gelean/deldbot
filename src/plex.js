const PlexAPI = require('plex-api')

// Initialize Plex
var plex = new PlexAPI({
  hostname: config.plexHostname,
  port: config.plexPort,
  username: config.plexUsername,
  password: config.plexPassword,
  token: config.plexToken
})

// Check Plex Server Information
plex.query('/').then(function (result) {
  console.log('Sever: %s' + '\n' + 'Plex Version: %s',
    result.MediaContainer.friendlyName,
    result.MediaContainer.version)
}, function (err) {
  console.error('The Plex server appears to be down, go yell at Josh', err)
})
// console.log(plex);
