const config = require('../../.env/config.json')
const https = require("https");

module.exports = {
  name: 'omdbsearch',
  description: 'Searches OMDb for the given query and reports matching films, shows, or albums. Returns ten results at a time so you may optionally pass in a page index to filter through the results',
  args: true,
  usage: '',
  guildOnly: true,
  cooldown: 5,
  aliases: ['omdb', 'omdb_search'],
  execute (message, args) {
    //if key is not found in the config - error out - do the same for hltb, itad, and the others
    var query = page = ''
    var usePagination = false
    for (var i = 0; i < args.length; i++) {
      if (i == 0 && args[0].includes('p')) {
        usePagination = true
        var fields = args[0].split('p')
        page = fields[1]
        console.log("page:", page)
      } else {
        query += args[i] + '+'
      }
    }
    // Remove the last + from the query
    query = query.substring(0, query.length - 1)
    console.log('Query: ' + query)

    //remove
    if (query == '') {
      message.channel.send("Supply a movie or show name idiot")
      //break
    }

    if (usePagination) {
      var omdbQuery = 'https://www.omdbapi.com/?apikey=' + config.omdb.key + '&s=' + query + '&page=' + page
    } else {
      var omdbQuery = 'https://www.omdbapi.com/?apikey=' + config.omdb.key + '&s=' + query
    }

    https.get(omdbQuery, (resp) => {
      var data = movieData = searchOutput = ''

      resp.on('data', (chunk) => {
        data += chunk
      })

      resp.on('end', () => {
        movieData = JSON.parse(data)
        console.log("data:", movieData)

        if (movieData.Response == 'False') {
          message.channel.send("No movie or show found, please refine your search and consider including a year dimwit")
        } else {
          searchOutput += 'Films and Shows:' + '\n'

          for (var i = 0; i < movieData.Search.length; i++) {
            // console.log(movieData.Search[i]);
            searchOutput += movieData.Search[i].Title + ' (' + movieData.Search[i].Year + ')\n'
          }
          searchOutput += 'Total Results: ' + movieData.totalResults + ' (' + Math.ceil(movieData.totalResults / 10) + ' pages)'
          message.channel.send(searchOutput)
        }
      })
    }).on('error', (err) => {
      message.channel.send("An error has occurred, go yell at " + config.owner.id)
    })
  }
}