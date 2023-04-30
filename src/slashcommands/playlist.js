const config = require('../../.env/config.json')
const videos = require('../data/youtube_playlist.json')
const { ApplicationCommandOptionType } = require('discord.js')
//const { YouTube } = require('popyt')
//const youtube = new YouTube(config.youtube.key)

module.exports = {
  name: 'playlist',
  description: 'Pull a Youtube link from a seed file (random video or index)',
  args: true,
  options: [{ name: 'index', description: 'The index of a specific video', type: ApplicationCommandOptionType.Number, required: false }],
  usage: '[index]',
  guildOnly: true,
  execute (interaction) {
    (async() => {
      try {
        //description: 'Pull a Youtube video from a playlist',
        //https://github.com/jasonhaxstuff/popyt/issues/456
        //let playlist = await youtube.getPlaylist(config.youtube.playlist)
        //console.log(playlist)
        //let playlistItems = await youtube.getPlaylistItems(config.youtube.playlist, 0)
        //console.log(playlistItems)

        const index = interaction.options.getNumber('index')

        if (index === null) {
          interaction.reply(videos[Math.floor(Math.random() * videos.length)])
        } else {
          if (isNaN(index)) {
            interaction.reply('Specify a proper number idiot')
          } else {
            if (index >= 0 && index < videos.length) {
              interaction.reply(videos[index])
              //youtubeLink = playlistItems[index - 1]
              //interaction.reply(youtubeLink.url)
            } else {
              interaction.reply(`The index specified is not in range [0,${videos.length - 1}] in the playlist idiot`)
            }
          }
        }
      } catch(exception) {
        interaction.reply(`An exception occurred (${exception}), go yell at <@${config.owner.id}>`)
      }
    })()
  }
}