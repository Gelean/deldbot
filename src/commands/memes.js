// TODO: Dynamically add memes to aliases array
const memes = require('../data/memes.json')

module.exports = {
  name: 'memes',
  description: 'Display a meme',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 0,
  aliases: ['mm'],
  execute (message, args) {
    if(args.length === 0) {
      let memeKeys = Object.keys(memes)
      let memeIndex = Math.floor(Math.random() * memeKeys.length)

      message.channel.send(memes[memeKeys[memeIndex]])
    }
  }
}
