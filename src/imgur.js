// Initialize Imgur Options
var imgurOptions = {
  hostname: 'api.imgur.com',
  path: '/3/album/' + config.imgurAlbum,
  headers: { 'Authorization': 'Client-ID ' + config.imgurClientId },
  method: 'GET'
}
