const config = require('../../.env/config.json')
const https = require('https')
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'releasedate',
  description: 'Returns the release date for a film or show',
  args: true,
  options: [{ name: 'title', description: 'The title to search for', type: ApplicationCommandOptionType.String, required: true },
            { name: 'year', description: 'The year of the title', type: ApplicationCommandOptionType.Number, required: false }],
  usage: '[title] [year]',
  guildOnly: true,
  execute (interaction) {
    if (config.omdb.key === 'OMDB_KEY') {
      return interaction.reply('The omdb.key is blank, set it in config.json')
    }

    const title = interaction.options.getString('title')
    const year = interaction.options.getNumber('year')

    let omdbQuery = ''
    let useYear = false

    if (year !== null) {
      useYear = true
    }

    if (useYear) {
      omdbQuery = `https://www.omdbapi.com/?apikey=${config.omdb.key}&t=${title}&y=${year}`
    } else {
      omdbQuery = `https://www.omdbapi.com/?apikey=${config.omdb.key}&t=${title}`
    }

    https.get(omdbQuery, (resp) => {
      let data = movieData = ''

      resp.on('data', (chunk) => {
        data += chunk
      })

      resp.on('end', () => {
        movieData = JSON.parse(data)
        //console.log(`data: ${movieData}`)

        if (movieData.Response === 'False') {
          interaction.reply('No movie or show found, please refine your search and consider including a year dimwit')
        } else {
          interaction.reply(`${movieData.Title} (${movieData.Year}): ${movieData.Released}`)
        }
      })
    }).on('error', (err) => {
      interaction.reply(`An error has occurred, go yell at <@${config.owner.id}>`)
    })
  }
}