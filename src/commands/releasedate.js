const config = require('../../.env/config.json')
const https = require('https')

module.exports = {
  name: 'releasedate',
  description: 'Returns the release date for a film or show',
  args: true,
  usage: '[title] [year]',
  guildOnly: true,
  cooldown: 1,
  aliases: [''],
  execute (message, args) {
    if (config.omdb.key === 'OMDB_KEY') {
      message.channel.send('The omdb.key is blank, set it in config.json')
      return
    }

    let query = year = omdbQuery = ''
    let useYear = false

    for (let i = 0; i < args.length; i++) {
      // If the search has more than one term and the last argument is numeric, assume it is the year
      let argInt = parseInt(args[i], 10)
      if ((i + 1) === args.length && args.length > 1 && !isNaN(argInt) && argInt > 1888) {
        year = args[i]
        useYear = true
      } else {
        query += args[i] + '+'
      }
    }

    query = query.substring(0, query.length - 1)
    console.log(`Query: ${query}`)

    if (useYear) {
      omdbQuery = `https://www.omdbapi.com/?apikey=${config.omdb.key}&t=${query}&y=${year}`
    } else {
      omdbQuery = `https://www.omdbapi.com/?apikey=${config.omdb.key}&t=${query}`
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
          message.channel.send('No movie or show found, please refine your search and consider including a year dimwit')
        } else {
          message.channel.send(`${movieData.Title} (${movieData.Year}): ${movieData.Released}`)
        }
      })
    }).on('error', (err) => {
      message.channel.send(`An error has occurred, go yell at <@${config.owner.id}>`)
    })
  }
}