const config = require('../../.env/config.json')
const { YouTube } = require('popyt')
const { ApplicationCommandOptionType } = require('discord.js')
const youtube = new YouTube(config.youtube.key)

module.exports = {
  name: 'youtubesearch',
  description: 'Return the first result of a Youtube search',
  args: true,
  options: [{ name: 'query', description: 'The search query', type: ApplicationCommandOptionType.String, required: true }],
  usage: '[query]',
  guildOnly: true,
  execute (interaction) {
    if (config.youtube.key === 'YOUTUBE_KEY') {
      return interaction.reply('The youtube.key is blank, set it in config.json')
    }
    if (config.youtube.playlist === 'YOUTUBE_PLAYLIST') {
      return interaction.reply('The youtube.playlist is blank, set it in config.json')
    }

    const query = interaction.options.getString('query')
    console.log(`Query: ${query}`)

    try {
      (async() => {
        let video = await youtube.getVideo(query)
        // console.log(video)
        interaction.reply(`https://www.youtube.com/watch?v=${video.id}`)
      })()
    } catch(UnhandledPromiseRejectionWarning) {
       interaction.reply('Nothing found for that search term, please refine your search dimwit')
    }
  }
}
