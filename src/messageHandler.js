const config = require("../.env/config.json")

/*
const prefix = config.global.prefix
const Discord = require('discord.js')
const fs = require('fs')

var client = new Discord.Client()
client.commands = new Discord.Collection()
const cooldowns = new Discord.Collection()
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`)
  client.commands.set(command.name, command)
}

client.login(config.discord.token)

client.once('ready', () => {
  console.log('Bot has connected')
  console.log("Name: " + config.discord.username + "\n" + "ID: " + config.discord.id);
})

client.on('message', message => {
*/

// Message handling
bot.on('message', function (user, userID, channelID, message, evt) {
  // The bot needs to know if it will execute a command
  // It will listen for messages that start with `!`
  if (message.substring(0, 1) == '!') {
    var args = message.substring(1).split(' ')
    var cmd = args[0]
    args = args.splice(1)

    switch (cmd.toLowerCase()) {
      // Check if a given piece of media (film, show, anime, or album) exists on the Plex server
      case 'search':
        var query = ''
        var searchOutput = ''
        var noResults = true

        if (args.length == 0) {
          sendChannelMessage(channelID, 'No search term specified, please use: !search <query> to search for movies, ' +
                        'shows, and albums on the Plex server', 'search')
          break
        } else {
          query = args.join(' ')
          console.log('Query: ' + query)
        }

        if (query.toLowerCase() === "derek's book") {
          sendUserMessage(userID, 'Go fuck yourself', 'search')
          break
        }

        (async () => {
          // List of query types: https://github.com/Arcanemagus/plex-api/wiki/MediaTypes

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
            sendChannelMessage(channelID, 'No results found, please refine your search dimwit', 'search')
          } else {
            sendChannelMessage(channelID, searchOutput, 'search')
          }
        })()
        break
      // Return the top result in an embed with a Plex link
      case 'embedsearch':
        var query = ''
        var searchOutput = ''
        var noResults = true

        if (args.length == 0) {
          sendChannelMessage(channelID, 'No search term specified, please use: !embedsearch <query> to search for albums, ' +
                        'movies, and shows on the Plex server', 'embedsearch')
          break
        } else {
          query = args.join(' ')
          console.log('Query: ' + query)
        }

        if (query.toLowerCase() === "derek's book") {
          sendUserMessage(userID, 'Go fuck yourself', 'embedsearch')
          break
        }

        (async () => {
          const filmResponse = plex.query('/search/?type=1&query=' + query)
          const filmResults = await filmResponse

          if (filmResults.MediaContainer.size >= 1) {
            const botMessage = bot.sendMessage({
              to: channelID,
              message: 'Films:'
            })
            const botResultsMessage = await botMessage
            for (var i = 0; i < filmResults.MediaContainer.size; i++) {
              // Investigate making search results Plex links using embeds
              var film = {
                'title': filmResults.MediaContainer.Metadata[i].title,
                'url': 'https://app.plex.tv/desktop#!/server/' + config.plex.id + '/details?key=%2Flibrary%2Fmetadata%2F' +
                                    filmResults.MediaContainer.Metadata[i].ratingKey + '&context=library%3Acontent.library',
                'color': 15048717,
                'footer': {
                  'icon_url': 'https://i.imgur.com/QhElb95.png',
                  'text': 'Plex'
                }
                // "thumbnail": {
                //      url: "https://app.plex.tv/desktop#!/server/id/
                // }
              }
              bot.sendMessage({
                to: channelID,
                embed: film
              })
            }
            noResults = false
          }

          const showResponse = plex.query('/search/?type=2&query=' + query)
          const showResults = await showResponse

          if (showResults.MediaContainer.size >= 1) {
            const botMessage = bot.sendMessage({
              to: channelID,
              message: 'Shows:'
            })
            // const botResultsMessage = await botMessage;
            for (var i = 0; i < showResults.MediaContainer.size; i++) {
              var show = {
                'title': showResults.MediaContainer.Metadata[i].title,
                'url': 'https://app.plex.tv/desktop#!/server/' + config.plex.id + '/details?key=%2Flibrary%2Fmetadata%2F' +
                                    showResults.MediaContainer.Metadata[i].ratingKey + '&context=library%3Acontent.library',
                'color': 15048717,
                'footer': {
                  'icon_url': 'https://dl2.macupdate.com/images/icons256/42311.png',
                  'text': 'Plex'
                }
              }
              const botResultsMessage = await botMessage
              bot.sendMessage({
                to: channelID,
                embed: show
              })
            }
            noResults = false
          }

          const albumResponse = plex.query('/search/?type=9&query=' + query)
          const albumResults = await albumResponse

          if (albumResults.MediaContainer.size >= 1) {
            const botMessage = bot.sendMessage({
              to: channelID,
              message: 'Albums:'
            })
            // const botResultsMessage = await botMessage;
            for (var i = 0; i < albumResults.MediaContainer.size; i++) {
              var album = {
                'title': albumResults.MediaContainer.Metadata[i].title,
                'url': 'https://app.plex.tv/desktop#!/server/' + config.plex.id + '/details?key=%2Flibrary%2Fmetadata%2F' +
                                    albumResults.MediaContainer.Metadata[i].ratingKey + '&context=library%3Acontent.library',
                'color': 15048717,
                'footer': {
                  'icon_url': 'https://dl2.macupdate.com/images/icons256/42311.png',
                  'text': 'Plex'
                }
              }
              const botResultsMessage = await botMessage
              bot.sendMessage({
                to: channelID,
                embed: album
              })
            }
            noResults = false
          }

          if (noResults) {
            sendChannelMessage(channelID, 'No results found, please refine your search dimwit', 'embedsearch')
          } else {
            console.log('Command executed: embedsearch')
          }
        })()
        break
      // Pull an Imgur link from an album (random image or index)
      // TODO: need an imgur count command and a link to post the imgur library
      case 'imgur':
        https.get(imgurOptions, (resp) => {
          let data = ''
          console.log("data:", imgurData.data);

          resp.on('data', (chunk) => {
            data += chunk
          })

          resp.on('end', () => {
            imgurData = JSON.parse(data)
            console.log(imgurData.data.link)
            console.log(imgurData.data.images)

            if (args == '') {
              var randomIndex = Math.floor(Math.random() * imgurData.data.images.length)
              console.log(randomIndex)
              sendChannelMessage(channelID, imgurData.data.images[randomIndex].link, 'imgur')
            } else {
              if (args.length > 1) {
                sendChannelMessage(channelID, 'Please specify a single index idiot', 'imgur (index)')
                return
              }

              var argInt = parseInt(args[0], 10)
              if (typeof argInt !== 'number' || isNaN(argInt)) {
                sendChannelMessage(channelID, 'Please specify a number idiot', 'imgur (index)')
                return
              }

              if (args >= imgurData.data.images.length) {
                sendChannelMessage(channelID, 'The index specified is larger than the number of items in the album idiot', 'playlist (index)')
              } else {
                sendChannelMessage(channelID, imgurData.data.images[argInt].link, 'imgur (index)')
              }
            }
          })
        }).on('error', (err) => {
          console.error(err)
          sendChannelMessage(channelID, 'An error has occurred, go yell at ' + config.owner.id, 'imgur')
        })
        break
      // Check OMDb for film and show release date information
      case 'releasedate':
        var query = ''
        var year = ''
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

        if (query == '') {
          sendChannelMessage(channelID, 'Supply a movie or show name idiot', 'releasedate')
          break
        }

        if (!useYear) {
          http.get('http://www.omdbapi.com/?apikey=' + config.omdb.key + '&t=' + query, (resp) => {
            let data = ''
            var movieData = ''

            resp.on('data', (chunk) => {
              data += chunk
            })

            resp.on('end', () => {
              movieData = JSON.parse(data)
              console.log("data:", movieData)

              if (movieData.Response == 'False') {
                sendChannelMessage(channelID, 'No movie or show found, please refine your search and consider including a year dimwit', 'releasedate')
              } else {
                sendChannelMessage(channelID, movieData.Title + ' (' + movieData.Year + '): ' + movieData.Released, 'releasedate')
              }
            })
          }).on('error', (err) => {
            sendChannelMessage(channelID, 'An error has occurred, go yell at ' + config.owner.id, 'releasedate')
          })
        } else {
          http.get('http://www.omdbapi.com/?apikey=' + config.omdb.key + '&t=' + query + '&y=' + year, (resp) => {
            let data = ''
            var movieData = ''

            resp.on('data', (chunk) => {
              data += chunk
            })

            resp.on('end', () => {
              movieData = JSON.parse(data)
              console.log("data:", movieData)

              if (movieData.Response == 'False') {
                sendChannelMessage(channelID, 'No movie or show found, please refine your search and consider ' +
                                    'including a year dimwit', 'releasedate (year)')
              } else {
                sendChannelMessage(channelID, movieData.Title + ' (' + movieData.Year + '): ' + movieData.Released, 'releasedate (year)')
              }
            })
          }).on('error', (err) => {
            sendChannelMessage(channelID, 'An error has occurred, go yell at ' + config.owner.id, 'releasedate (year)')
          })
        }
        break
      // Check OMDb for film and show information
      case 'omdbsearch':
        var query = ''
        var page = ''
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

        if (usePagination) {
          var omdbQuery = 'http://www.omdbapi.com/?apikey=' + config.omdb.key + '&s=' + query + '&page=' + page
        } else {
          var omdbQuery = 'http://www.omdbapi.com/?apikey=' + config.omdb.key + '&s=' + query
        }

        http.get(omdbQuery, (resp) => {
          let data = ''
          var movieData = ''
          var searchOutput = ''

          resp.on('data', (chunk) => {
            data += chunk
          })

          resp.on('end', () => {
            movieData = JSON.parse(data)
            console.log("data:", movieData)

            if (movieData.Response == 'False') {
              sendChannelMessage(channelID, 'No movie or show found, please refine your search and consider including a year dimwit', 'omdbsearch')
            } else {
              searchOutput += 'Films and Shows:' + '\n'

              for (var i = 0; i < movieData.Search.length; i++) {
                // console.log(movieData.Search[i]);
                searchOutput += movieData.Search[i].Title + ' (' + movieData.Search[i].Year + ')\n'
              }
              searchOutput += 'Total Results: ' + movieData.totalResults + ' (' + Math.ceil(movieData.totalResults / 10) + ' pages)'
              sendChannelMessage(channelID, searchOutput, 'omdbsearch')
            }
          })
        }).on('error', (err) => {
          sendChannelMessage(channelID, 'An error has occurred, go yell at ' + config.owner.id, 'omdbsearch')
        })
        break
      // Check HowLongToBeat for game completion times
      case 'hltb':
      case 'howlongtobeat':
        var query = ''
        var hltbOutput = ''
        var noResults = true

        if (args.length == 0) {
          sendChannelMessage(channelID, 'No game specified, please use: !hltb <query> or !howlongtobeat <query> to search for the average completion time for games', 'howlongtobeat')
          break
        } else {
          query = args.join(' ')
          console.log('Query: ' + query)
        }

        (async () => {
          const hltbResponse = hltbService.search(query)
          const hltbResults = await hltbResponse
          // console.log(hltbResults);

          if (hltbResults.length >= 1) {
            hltbOutput += 'Games and Completion Times (Main Story, Main + Extra, Completionist):'
            for (var i = 0; i < hltbResults.length; i++) {
              hltbOutput += '\n' + hltbResults[i].name + ' (' + hltbResults[i].gameplayMain + 'h, ' +
                                hltbResults[i].gameplayMainExtra + 'h, ' + hltbResults[i].gameplayCompletionist + 'h)'
            }
            noResults = false
          }

          if (noResults) {
            sendChannelMessage(channelID, 'No results found, please refine your search dimwit', 'howlongtobeat')
          } else {
            sendChannelMessage(channelID, hltbOutput, 'howlongtobeat')
          }
        })()
        break
      // Check IsThereAnyDeal for game deals
      case 'itad':
      case 'isthereanydeal':
        var query = ''
        var noResults = true
        var title = ''
        var fieldCount = 0
        var gameEmbed = new DiscordJs.MessageEmbed()

        if (args.length == 0) {
          sendChannelMessage(channelID, 'No game specified, please use: !itad <query> or !isthereanydeal <query> to search for prices for a games', 'isthereanydeal')
          break
        } else {
          query = args.join(' ')
          console.log('Query: ' + query)
        }

        /*
        const response = await igdb()
          .fields(['name', 'movies', 'age']) // fetches only the name, movies, and age fields
          .fields('name,movies,age') // same as above
          .limit(50) // limit to 50 results
          .offset(10) // offset results by 10
          .sort('name') // default sort direction is 'asc' (ascending)
          .sort('name', 'desc') // sorts by name, descending
          .search('mario') // search for a specific name (search implementations can vary)
          .where(`first_release_date > ${new Date().getTime() / 1000}`) // filter the results
          .request('/games'); // execute the query and return a response object
        console.log(response.data);

        async() => {
          const shops = await itadApi.getShops();
        };
        */

        sendChannelMessage(channelID, 'Please wait a few moments while the closest result can be found', 'isthereanydeal');
        (async () => {
          const itadOutput = await itadApi.getDealsFull({
            shops: ['steam', 'gog', 'origin', 'epic', 'battlenet', 'uplay', 'squenix', 'humblestore'],
            limit: 50,
            sort: 'time'
          }, query)

          itadOutput.list.sort((a, b) => a.title.localeCompare(b.title, 'en', { ignorePunctuation: true }))
           // console.log(itadOutput);
           // console.log(itadOutput.list);

          if (itadOutput.count >= 1) {
            for (var i = 0; i < itadOutput.count; i++) {
              var itadElement = itadOutput.list[i]
              // console.log(itadElement);
              // console.log(itadElement.title);

              if (title === '' && !itadElement.title.includes('Offer') && !itadElement.title.includes('Currency') && !itadElement.title.includes('Pass') &&
                                !itadElement.title.includes('Pack') && itadElement.is_dlc === false && itadElement.image !== null && itadElement.achievements === true) {
                /* if (!query.toLowerCase().includes("complete") && (itadElement.title.includes("Complete") || itadElement.title.includes("Collection"))) {
                  console.log(query);
                  console.log(itadElement.title)
                  break;
                }
                else if (!query.toLowerCase().includes("goty") && (itadElement.title.includes("Game of the Year") || itadElement.title.includes("GOTY"))) {
                  console.log(query);
                  console.log(itadElement.title)
                  break;
                }
                */

                title = itadElement.title
                gameEmbed.setColor('046EB2')
                  .setTitle(title)
                  .setURL(itadElement.urls.game)
                  .setImage(itadElement.image)
                  .setFooter('IsThereAnyDeal', 'https://i.imgur.com/Y53EOrA.jpg')
              }
              if (itadElement.shop.name === 'Epic Game Store') {
                itadElement.shop.name = 'Epic'
              }
              //title === ""
              if (title === itadElement.title && !itadElement.title.includes('Offer') && !itadElement.title.includes('Currency') &&
                                !itadElement.title.includes('Pass') && !itadElement.title.includes('Pack') &&
                                itadElement.is_dlc === false && itadElement.image !== null && itadElement.achievements === true 
                                && fieldCount < 8) {
                gameEmbed.addField('Sale Price (' + itadElement.shop.name + ')', '$' + itadElement.price_new.toString(), true)
                gameEmbed.addField('List Price (' + itadElement.shop.name + ')', '$' + itadElement.price_old.toString(), true)
                gameEmbed.addField('Discount', itadElement.price_cut.toString() + '%', true)
                fieldCount++
                noResults = false
              }
            }
          }

          if (noResults) {
            sendChannelMessage(channelID, 'No results found, please refine your search dimwit', 'isthereanydeal')
          } else {
            sendEmbedMessage(channelID, gameEmbed, 'isthereanydeal')
          }
        })()
        break
      default:
        sendChannelMessage(channelID, 'Type !help for commands', 'default')
        break
    }
  }
})
