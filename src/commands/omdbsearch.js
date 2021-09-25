const config = require('../../.env/config.json')
const https = require('https')

module.exports = {
  name: 'omdbsearch',
  description: 'Returns matching films or shows',
  args: true,
  usage: '[query] p[page]',
  guildOnly: true,
  cooldown: 1,
  aliases: ['omdb'],
  execute (message, args) {
    if (config.omdb.key === 'OMDB_KEY') {
      message.channel.send('The omdb.key is blank, set it in config.json')
      return
    }

    let query = page = omdbQuery = ''
    let usePagination = false

    console.log(args)

    for (let i = 0; i < args.length; i++) {
      if (args[i].includes('p')) {
        let fields = args[i].split('p')
        page = fields[1]
        usePagination = true
        console.log(`page: ${page}`)
      } else {
        query += args[i] + '+'
      }
    }

    query = query.substring(0, query.length - 1)
    console.log(`Query: ${query}`)

    //remove
    if (query === '') {
      message.channel.send('Supply a movie or show name idiot')
      return
    }

    if (usePagination) {
      omdbQuery = `https://www.omdbapi.com/?apikey=${config.omdb.key}&s=${query}&page=${page}`
    } else {
      omdbQuery = `https://www.omdbapi.com/?apikey=${config.omdb.key}&s=${query}`
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
          message.channel.send('No movie or show found, please refine your search and consider including a year dimwit')
        } else {
          searchOutput += '**Films and Shows:**\n'

          for (let i = 0; i < movieData.Search.length; i++) {
            // console.log(movieData.Search[i])
            searchOutput += `${movieData.Search[i].Title} (${movieData.Search[i].Year})\n`
          }
          searchOutput += `**Total Results:** ${movieData.totalResults} (${Math.ceil(movieData.totalResults / 10)} pages)`

          message.channel.send(searchOutput)
        }
      })
    }).on('error', (err) => {
      message.channel.send(`An error has occurred, go yell at ${config.owner.id}`)
    })
  }
}