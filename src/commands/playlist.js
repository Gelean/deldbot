const config = require('../../.env/config.json')
const videos = require('../data/youtube_playlist.json')
//const { YouTube } = require('popyt')
//const youtube = new YouTube(config.youtube.key)

module.exports = {
  name: 'playlist',
  description: 'Pull a Youtube link from a seed file (random video or index)',
  args: false,
  usage: '[index]',
  guildOnly: true,
  cooldown: 1,
  aliases: ['solplaylist'],
  execute (message, args) {
    (async() => {
      try {
        //description: 'Pull a Youtube video from a playlist',
        //https://github.com/jasonhaxstuff/popyt/issues/456
        //var playlist = await youtube.getPlaylist(config.youtube.playlist)
        //console.log(playlist)
        //var playlistItems = await youtube.getPlaylistItems(config.youtube.playlist, 0)
        //console.log(playlistItems)

        switch (args.length) {
          case 0:
            message.channel.send(videos[Math.floor(Math.random() * videos.length)])
            break
          case 1:
            let index = parseInt(args[0])

            if (typeof index !== 'number' || isNaN(index)) {
              message.channel.send('Specify a number idiot')
              return
            }

            if (index >= 0 && index < videos.length) {
              message.channel.send(videos[index])
              //youtubeLink = playlistItems[args - 1]
              //message.channel.send(youtubeLink.url)
              return
            } else {
              message.channel.send(`The index specified is not in range [0,${videos.length - 1}] in the playlist idiot`)
              return
            }

            /*
            for (var i = 0; i < playlistItems.length; i++) {
              console.log(playlistItems[i].url)
            }
            */
          default:
            message.channel.send('Please specify a single index idiot')
            break
        }
      } catch(exception) {
          message.channel.send(`An exception occurred (${exception}), go yell at ${config.owner.id}`)
      }
    })()
  }
}