const videos = require('../data/youtube_playlist.json')

module.exports = {
  name: 'playlist',
  description: 'Pull a Youtube link from a seed file (random video or index)',
  args: false,
  usage: '[index]',
  guildOnly: true,
  cooldown: 5,
  aliases: ['video'],
  execute (message, args) {
    switch (args.length) {
      case 0:
        message.channel.send(videos[Math.floor(Math.random() * videos.length)])
        break
      case 1:
        let index = parseInt(args[0])

        if (typeof index !== 'number' || isNaN(index)) {
          message.channel.send('Please specify a number idiot')
          return
        }

        if (index >= 0 && index < videos.length) {
          message.channel.send(videos[index])
          return
        } else {
          message.channel.send(`The index specified is not in range [0,${videos.length}] in the playlist idiot`)
          return
        }
      default:
        message.channel.send('Please specify a single index idiot')
        break
    }
  }
}
