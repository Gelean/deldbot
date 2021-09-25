const memes = require('../data/memes.json')

module.exports = {
  name: 'memes',
  description: 'Display a meme',
  args: false,
  usage: '[meme name]',
  guildOnly: true,
  cooldown: 1,
  aliases: ['meme', 'mm'],
  execute (message, args) {
    let memeKeys = Object.keys(memes)

    if(args.length === 0) {
      let memeIndex = Math.floor(Math.random() * memeKeys.length)
      message.channel.send(memes[memeKeys[memeIndex]])
      return
    }

    let filteredKeys = memeKeys.filter(function(item){return item === args[0]})
    
    if(filteredKeys.length !== 0) {
      message.channel.send(memes[filteredKeys[0]])
    } else {
      let currentMemes = ''
      for(let i = 0; i < memeKeys.length; i++) {
        if (i === 0) {
          currentMemes = memeKeys[i]
        } else {
          currentMemes += ', ' + memeKeys[i]
        }
      }
      message.channel.send(`Current memes: ${currentMemes}`)
    }
  }
}
