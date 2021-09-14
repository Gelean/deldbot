const config = require('../../.env/config.json')
const hltb = require('howlongtobeat')

// Initialize HLTB Service
var hltbService = new hltb.HowLongToBeatService()

module.exports = {
    name: 'hltb',
    description: 'Searches HowLongToBeat for the average completion time for games',
    args: true,
    usage: '',
    guildOnly: true,
    cooldown: 5,
    aliases: ['howlongtobeat'],
    execute (message, args) {
      var query = hltbOutput = ''
      var noResults = true

      if (args.length == 0) {
        message.channel.send("No game specified, please use: !hltb <query> or !howlongtobeat <query> to search for the average completion time for games")
      } else {
        query = args.join(' ')
        console.log('Query: ' + query)
      }

      (async () => { //async TypeError: (intermediate value) is not a function here too ;
        const hltbResponse = hltbService.search(query)
        const hltbResults = await hltbResponse
        // console.log(hltbResults);

        if (hltbResults.length >= 1) {
          hltbOutput += "Games and Completion Times (Main Story, Main + Extra, Completionist):"
          for (var i = 0; i < hltbResults.length; i++) {
            hltbOutput += '\n' + hltbResults[i].name + ' (' + hltbResults[i].gameplayMain + 'h, ' +
                              hltbResults[i].gameplayMainExtra + 'h, ' + hltbResults[i].gameplayCompletionist + 'h)'
          }
          noResults = false
        }

        if (noResults) {
          message.channel.send("No results found, please refine your search dimwit")
        } else {
          message.channel.send(hltbOutput)
        }
      })()
    }
  }