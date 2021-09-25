const config = require('../../.env/config.json')
const { YouTube } = require('popyt')
const youtube = new YouTube(config.youtube.key)

module.exports = {
  name: 'youtubesearch',
  description: 'Return the first result of a Youtube search',
  args: true,
  usage: '[query]',
  guildOnly: true,
  cooldown: 1,
  aliases: ['youtube', 'ytsearch'],
  execute (message, args) {
    if (config.youtube.key === 'YOUTUBE_KEY') {
      message.channel.send('The youtube.key is blank, set it in config.json')
      return
    }
    if (config.youtube.playlist === 'YOUTUBE_PLAYLIST') {
      message.channel.send('The youtube.playlist is blank, set it in config.json')
      return
    }

    let query = args.join(' ')
    console.log(`Query: ${query}`)

    try {
      (async() => {
        let video = await youtube.getVideo(query)
        //console.log(video)
        message.channel.send(`https://www.youtube.com/watch?v=${video.id}`)
      })()
    } catch(UnhandledPromiseRejectionWarning) {
        message.channel.send('Nothing found for that search term, please refine your search dimwit')
    }
  }
}
