const PlexAPI = require('plex-api')
const config = require('../../.env/config.json')
const _ = require('lodash');
const { ApplicationCommandOptionType } = require('discord.js')

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
  // console.error('The Plex server appears to be down')
  process.on('unhandledRejection', error => {
    console.error(err)
  })
})

module.exports = {
  name: 'search',
  description: 'Searches the Plex server for the given query and reports matching films, shows, or albums',
  args: true,
  options: [{ name: 'media', description: 'The media to locate', type: ApplicationCommandOptionType.String, required: true },
            { name: 'medium', description: 'The medium to confine the search to', type: ApplicationCommandOptionType.String,
              choices: [{ name: 'Films', value: 'films' }, { name: 'Shows', value: 'shows' }, { name: 'Albums', value: 'albums' }], required: false }],
  usage: '[$films|$shows|$albums] [query]',
  guildOnly: true,
  execute (interaction) {
    (async () => {
      if (config.plex.token === 'PLEX_TOKEN') {
        return interaction.reply('The plex.token is blank, set it in config.json')
      }

      if (plexIsDown) {
        return interaction.reply(`The Plex server appears to be down, go yell at <@${config.owner.id}>`)
      }

      const media = interaction.options.getString('media')
      const medium = interaction.options.getString('medium')
      let findFilms = findShows = findAlbums = false

      if (medium === 'films') {
        findFilms = true
      } else if (medium === 'shows') {
        findShows = true
      } else if (medium === 'albums') {
        findAlbums = true
      } else {
        findFilms = findShows = findAlbums = true
      }

      let searchOutput = ''
      let noResults = true

      if (media.toLowerCase() === `derek's book` || media.toLowerCase() === `dereks book`) {
        return interaction.user.send('Go fuck yourself')
      }
      // List of query types: https://github.com/Arcanemagus/plex-api/wiki/MediaTypes

      if (findFilms) {
        const filmResponse = plex.query(`/search/?type=1&query=${media}`)
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
        const showResponse = plex.query(`/search/?type=2&query=${media}`)
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
        const albumResponse = plex.query(`/search/?type=9&query=${media}`)
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
        interaction.reply('No results found, please refine your search dimwit')
      } else {
        interaction.reply(searchOutput)
      }
    })()
  }
}