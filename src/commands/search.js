const PlexAPI = require('plex-api')
const config = require("../../.env/config.json")

// Initialize Plex
var plex = new PlexAPI({
  hostname: config.plex.hostname,
  port: config.plex.port,
  username: config.plex.username,
  password: config.plex.password,
  token: config.plex.token
})
var plexIsDown = false;

plex.query('/').then(function (result) {
  console.log('Sever: %s' + '\n' + 'Plex Version: %s',
    result.MediaContainer.friendlyName,
    result.MediaContainer.version)
}).catch(err => {
  plexIsDown = true;
  console.error('The Plex server appears to be down')
  process.on('unhandledRejection', error => {
    console.error(err)
  });
})

module.exports = {
  name: 'search',
  description: 'Searches the Plex server for the given query and reports matching films, shows, or albums',
  args: true,
  usage: '',
  guildOnly: true,
  cooldown: 1,
  aliases: ['plex', 'plexsearch'],
  execute (message, args) {
    if (plexIsDown) {
      message.channel.send("The Plex server appears to be down, go yell at " + config.owner.id);
    }

    var query = searchOutput = ''
    var noResults = true

    if (args.length == 0) { //picked up automatically now
      message.channel.send("No search term specified, please use: !search <query> to search for movies, shows, and albums on the Plex server");
      //break
    } else {
      query = args.join(' ')
      console.log('Query: ' + query)
    }

    if (query.toLowerCase() === "derek's book") {
      message.author.send("Go fuck yourself")
      //break
    }

    (async () => {
      // List of query types: https://github.com/Arcanemagus/plex-api/wiki/MediaTypes ;

      const filmResponse = plex.query('/search/?type=1&query=' + query)
      const filmResults = await filmResponse

      if (filmResults.MediaContainer.size >= 1) {
        searchOutput += 'Films:'
        for (var i = 0; i < filmResults.MediaContainer.size; i++) {
          // console.log(filmResults.MediaContainer.Metadata[i]);
          searchOutput += '\n' + filmResults.MediaContainer.Metadata[i].title
        }
        noResults = false
      }

      const showResponse = plex.query('/search/?type=2&query=' + query)
      const showResults = await showResponse

      if (showResults.MediaContainer.size >= 1) {
        searchOutput += '\nShows:'
        for (var i = 0; i < showResults.MediaContainer.size; i++) {
          // console.log(showResults.MediaContainer.Metadata[i]);
          searchOutput += '\n' + showResults.MediaContainer.Metadata[i].title
        }
        noResults = false
      }

      const albumResponse = plex.query('/search/?type=9&query=' + query)
      const albumResults = await albumResponse

      if (albumResults.MediaContainer.size >= 1) {
        searchOutput += '\nAlbums:'
        for (var i = 0; i < albumResults.MediaContainer.size; i++) {
          // console.log(albumResults.MediaContainer.Metadata[i]);
          searchOutput += '\n' + albumResults.MediaContainer.Metadata[i].title
        }
        noResults = false
      }

      if (noResults) {
        message.channel.send("No results found, please refine your search dimwit");
      } else {
        message.channel.send(searchOutput);
      }
    })()
  }
}