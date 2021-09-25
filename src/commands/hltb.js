const hltb = require('howlongtobeat')

// Initialize HLTB Service
const hltbService = new hltb.HowLongToBeatService()

module.exports = {
  name: 'hltb',
  description: 'Searches HowLongToBeat for the average completion time for games',
  args: true,
  usage: '[game]',
  guildOnly: true,
  cooldown: 1,
  aliases: ['howlongtobeat'],
  execute (message, args) {
    (async() => {
      let query = hltbOutput = ''
      let noResults = true

      query = args.join(' ')
      console.log(`Query: ${query}`)

      let hltbResponse = hltbService.search(query)
      let hltbResults = await hltbResponse
      hltbResults.sort((a, b) => a.name.localeCompare(b.name, 'en', {ignorePunctuation: true}))
      // console.log(hltbResults)

      if (hltbResults.length >= 1) {
        hltbOutput += '**Games and Completion Times (Main Story, Main + Extra, Completionist)**'
        for (let i = 0; i < hltbResults.length; i++) {
          hltbOutput += `\n${hltbResults[i].name} (${hltbResults[i].gameplayMain}h, ${hltbResults[i].gameplayMainExtra}h, ${hltbResults[i].gameplayCompletionist}h)`
        }
        noResults = false
      }

      if (noResults) {
        message.channel.send('No results found, please refine your search dimwit')
      } else {
        message.channel.send(hltbOutput)
      }
    })()
  }
}