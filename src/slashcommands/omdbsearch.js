const config = require('../../.env/config.json')
const https = require('https')
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'omdbsearch',
  description: 'Returns matching films or shows',
  args: true,
  options: [{ name: 'title', description: 'The title to search for', type: ApplicationCommandOptionType.String, required: true },
            { name: 'page', description: 'The page of the results', type: ApplicationCommandOptionType.Number, required: false }],
  usage: '[title] p[page]',
  guildOnly: true,
  execute (interaction) {
    if (config.omdb.key === 'OMDB_KEY') {
      return interaction.reply('The omdb.key is blank, set it in config.json')
    }

    const title = interaction.options.getString('title')
    let page = interaction.options.getNumber('page')

    let omdbQuery = ''
    let usePagination = false

    if (page !== null) {
      usePagination = true
    } else {
      page = 1
    }

    if (usePagination) {
      omdbQuery = `https://www.omdbapi.com/?apikey=${config.omdb.key}&s=${title}&page=${page}`
    } else {
      omdbQuery = `https://www.omdbapi.com/?apikey=${config.omdb.key}&s=${title}`
    }

    https.get(omdbQuery, (resp) => {
      let data = movieData = searchOutput = ''

      resp.on('data', (chunk) => {
        data += chunk
      })

      resp.on('end', () => {
        movieData = JSON.parse(data)
        //console.log(`data: ${movieData}`)

        if (movieData.Response === 'False') {
          interaction.reply('No movie or show found, please refine your search and consider including a year dimwit')
        } else {
          searchOutput += `**Films and Shows (Page ${page}):**\n`

          for (let i = 0; i < movieData.Search.length; i++) {
            // console.log(movieData.Search[i])
            searchOutput += `${movieData.Search[i].Title} (${movieData.Search[i].Year})\n`
          }
          searchOutput += `**Total Results:** ${movieData.totalResults} (${Math.ceil(movieData.totalResults / 10)} page(s))`

          interaction.reply(searchOutput)
        }
      })
    }).on('error', (err) => {
      interaction.reply(`An error has occurred, go yell at <@${config.owner.id}>`)
    })
  }
}