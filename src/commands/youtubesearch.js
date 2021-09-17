const config = require('../../.env/config.json')
const package = require('../../package.json')
const { YouTube } = require('popyt')

// Initialize Popyt Youtube API
var youtube = new YouTube(config.youtube.key)

module.exports = {
  name: 'youtubesearch',
  description: 'Return the top result of a Youtube search',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 5,
  aliases: ['youtube', 'ytsearch'],
  execute (message, args) {
    var query = "";

    if (args.length == 0) {
        message.channel.send("No search term specified, please use: !youtubesearch <query> to search for Youtube videos")
        //break;
    } else {
        query = args.join(' ')
        console.log("Query: " + query)
    }

    (async() => {   
      try {
          var video = await youtube.getVideo(query)
          //console.log(video)
          message.channel.send("https://www.youtube.com/watch?v=" + video.id)
      } catch(UnhandledPromiseRejectionWarning) {
          message.channel.send("Nothing found for that search term, please refine your search dimwit")
      }
    })();
  }
}
