const config = require('../../.env/config.json')
const https = require("https");

module.exports = {
  name: 'releasedate',
  description: 'Checks the release date for a film or show. OMDb only returns one result for a given query, so refine it and optionally specify a year to increase the likelihood of finding the media you want',
  args: true,
  usage: '',
  guildOnly: true,
  cooldown: 5,
  aliases: [''],
  execute (message, args) {
    //if key is not found in the config - error out - do the same for hltb, itad, and the others
    var query = year = ''
    var useYear = false
    for (var i = 0; i < args.length; i++) {
      // If the search has more than one term and the last argument is numeric, assume it is the year
      var argInt = parseInt(args[i], 10)
      if ((i + 1) == args.length && args.length > 1 && !isNaN(argInt) && argInt > 1888) {
        year = args[i]
        useYear = true
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

    if (useYear) {
      var omdbQuery = 'https://www.omdbapi.com/?apikey=' + config.omdb.key + '&t=' + query + '&y=' + year
    } else {
      var omdbQuery = 'https://www.omdbapi.com/?apikey=' + config.omdb.key + '&t=' + query
    }

    https.get(omdbQuery, (resp) => {
      let data = ''
      var movieData = ''

      resp.on('data', (chunk) => {
        data += chunk
      })

      resp.on('end', () => {
        movieData = JSON.parse(data)
        console.log("data:", movieData)

        if (movieData.Response == 'False') {
          message.channel.send("No movie or show found, please refine your search and consider including a year dimwit")
        } else {
          message.channel.send(movieData.Title + ' (' + movieData.Year + '): ' + movieData.Released)
        }
      })
    }).on('error', (err) => {
      message.channel.send("An error has occurred, go yell at " + config.owner.id)
    })
  }
}