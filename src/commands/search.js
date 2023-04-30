const PlexAPI = require('plex-api')
const config = require('../../.env/config.json')
const _ = require('lodash');

// Initialize Plex Service
let plex = new PlexAPI({
  hostname: config.plex.hostname,
  port: config.plex.port,
  username: config.plex.username,
  password: config.plex.password,
  token: config.plex.token
})
let plexIsDown = false

plex.query('/').then(function (result) {
  console.log(`Server: %s \nPlex Version: %s`,
    result.MediaContainer.friendlyName,
    result.MediaContainer.version)
}).catch(err => {
  plexIsDown = true
  console.error('The Plex server appears to be down')
  process.on('unhandledRejection', error => {
    console.error(err)
  })
})

module.exports = {
  name: 'search',
  description: 'Searches the Plex server for the given query and reports matching films, shows, or albums',
  args: true,
  usage: '[$films|$shows|$albums] [query]',
  guildOnly: true,
  cooldown: 1,
  aliases: ['plex', 'plexsearch'],
  execute (message, args) {
    (async () => {
      if (config.plex.token === 'PLEX_TOKEN') {
        message.channel.send('The plex.token is blank, set it in config.json')
        return
      }

      if (plexIsDown) {
        message.channel.send(`The Plex server appears to be down, go yell at <@${config.owner.id}>`)
        return
      }

      let query = searchOutput = ''
      let findFilms = findShows = findAlbums = true
      let noResults = true

      if (args[0] === "$films" || args[0] === "$shows" || args[0] === "$albums") {
        findFilms = findShows = findAlbums = false
      }

      while (args[0] === "$films" || args[0] === "$shows" || args[0] === "$albums") {
        if (args[0] === "$films") {
          findFilms = true
        }
        if (args[0] === "$shows") {
          findShows = true
        }
        if (args[0] === "$albums") {
          findAlbums = true
        }
        args.shift();
      }

      query = args.join(' ')
      console.log(`Query: ${query}`)

      if (query.toLowerCase() === `derek's book` || query.toLowerCase() === `dereks book`) {
        message.author.send('Go fuck yourself')
        return
      }
      // List of query types: https://github.com/Arcanemagus/plex-api/wiki/MediaTypes

      if (findFilms) {
        const filmResponse = plex.query(`/search/?type=1&query=${query}`)
        const filmResults = await filmResponse

        if (filmResults.MediaContainer.size >= 1) {
          searchOutput += '**Films:**'
          for (let i = 0; i < filmResults.MediaContainer.size; i++) {
            // console.log(filmResults.MediaContainer.Metadata[i])
            searchOutput += '\n' + filmResults.MediaContainer.Metadata[i].title
          }
          noResults = false
        }
      }

      if (findShows) {
        const showResponse = plex.query(`/search/?type=2&query=${query}`)
        const showResults = await showResponse

        if (showResults.MediaContainer.size >= 1) {
          searchOutput += '\n**Shows:**'
          for (let i = 0; i < showResults.MediaContainer.size; i++) {
            // console.log(showResults.MediaContainer.Metadata[i])
            searchOutput += '\n' + showResults.MediaContainer.Metadata[i].title
          }
          noResults = false
        }
      }

      if (findAlbums) {
        const albumResponse = plex.query(`/search/?type=9&query=${query}`)
        const albumResults = await albumResponse

        if (albumResults.MediaContainer.size >= 1) {
          searchOutput += '\n**Albums:**'
          for (let i = 0; i < albumResults.MediaContainer.size; i++) {
            // console.log(albumResults.MediaContainer.Metadata[i])
            searchOutput += '\n' + albumResults.MediaContainer.Metadata[i].title
          }
          noResults = false
        }
      }

      if (noResults) {
        message.channel.send('No results found, please refine your search dimwit')
      } else {
        message.channel.send(searchOutput)
      }
    })()
  }
}