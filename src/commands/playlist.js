const config = require('../../.env/config.json')
const { YouTube } = require('popyt')

module.exports = {
  name: 'playlist',
  description: 'Pull a Youtube link from a playlist (random video or index)',
  args: false,
  usage: '[index]',
  guildOnly: true,
  cooldown: 1,
  aliases: ['solplaylist'],
  execute (message, args) {
    (async() => {
      try {
        if (config.youtube.key === 'YOUTUBE_KEY') {
          message.channel.send('The youtube.key is blank, set it in config.json')
          return
        }

        if (config.youtube.playlist === 'YOUTUBE_PLAYLIST') {
          message.channel.send('The youtube.playlist is blank, set it in config.json')
          return
        }

        // Initialize popyt
        const youtube = new YouTube(config.youtube.key)

        const playlist = await youtube.getPlaylist(config.youtube.playlist)
        const numPages = Math.round(playlist.length / 50)
        const videos = await playlist.fetchVideos({ pages: numPages }, [ 'id' ])

        switch (args.length) {
          case 0:
            message.channel.send(videos[Math.floor(Math.random() * videos.length)].url)
            break
          case 1:
            const index = parseInt(args[0])

            if (typeof index !== 'number' || isNaN(index)) {
              message.channel.send('Specify a number idiot')
              return
            }

            if (index >= 0 && index < videos.length) {
              message.channel.send(message.channel.send(videos[index].url))
              return
            } else {
              message.channel.send(`The index specified is not in the range (0,${videos.length - 1}) of the playlist idiot`)
              return
            }
          default:
            message.channel.send('Please specify a single index or no index idiot')
            break
        }
      } catch(exception) {
        message.channel.send(`An exception occurred (${exception}), go yell at <@${config.owner.id}>`)
      }
    })()
  }
}