const config = require('../../.env/config.json')
const { YouTube } = require('popyt')
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'playlist',
  description: 'Pull a Youtube link from a playlist (random video or index)',
  args: true,
  options: [{ name: 'index', description: 'The index of a specific video', type: ApplicationCommandOptionType.Number, required: false }],
  usage: '[index]',
  guildOnly: true,
  execute (interaction) {
    (async() => {
      try {
        if (config.youtube.key === 'YOUTUBE_KEY') {
          return interaction.reply('The youtube.key is blank, set it in config.json')
        }

        if (config.youtube.playlist === 'YOUTUBE_PLAYLIST') {
          return interaction.reply('The youtube.playlist is blank, set it in config.json')
        }

        const index = interaction.options.getNumber('index')

        // Initialize popyt
        const youtube = new YouTube(config.youtube.key)

        // Defer the reply until popyt has responded
        await interaction.deferReply()

        const playlist = await youtube.getPlaylist(config.youtube.playlist)
        const numPages = Math.round(playlist.length / 50)
        const videos = await playlist.fetchVideos({ pages: numPages }, [ 'id' ])

        if (index === null) {
          await interaction.editReply(videos[Math.floor(Math.random() * videos.length)].url)
        } else {
          if (isNaN(index)) {
            await interaction.editReply('Specify a number idiot')
          } else {
            if (index >= 0 && index < videos.length) {
              await interaction.editReply(videos[index].url)
            } else {
              await interaction.editReply(`The index specified is not in the range (0,${videos.length - 1}) of the playlist idiot`)
            }
          }
        }
      } catch(exception) {
        interaction.reply(`An exception occurred (${exception}), go yell at <@${config.owner.id}>`)
      }
    })()
  }
}