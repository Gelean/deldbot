const hltb = require('howlongtobeat')
const { ApplicationCommandOptionType } = require('discord.js')

// Initialize HLTB Service
const hltbService = new hltb.HowLongToBeatService()

module.exports = {
  name: 'hltb',
  description: 'Searches HowLongToBeat for the average completion time for games',
  args: true,
  options: [{ name: 'game', description: 'The game to look up', type: ApplicationCommandOptionType.String, required: true }],
  usage: '[game]',
  guildOnly: true,
  execute (interaction) {
    (async() => {
      const game = interaction.options.getString('game')

      // Defer the reply until hltb has responded
      await interaction.deferReply()

      let hltbOutput = ''
      let hltbResponse = hltbService.search(game)
      let hltbResults = await hltbResponse
      hltbResults.sort((a, b) => a.name.localeCompare(b.name, 'en', {ignorePunctuation: true}))
      // console.log(hltbResults)

      if (hltbResults.length >= 1) {
        hltbOutput += '**Games and Completion Times (Main Story, Main + Extra, Completionist)**'
        for (let i = 0; i < hltbResults.length; i++) {
          hltbOutput += `\n${hltbResults[i].name} (${hltbResults[i].gameplayMain}h, ${hltbResults[i].gameplayMainExtra}h, ${hltbResults[i].gameplayCompletionist}h)`
        }
        await interaction.editReply(hltbOutput)
      } else {
        await interaction.editReply('No results found, please refine your search dimwit')
      }
    })()
  }
}