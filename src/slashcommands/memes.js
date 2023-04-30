const memes = require('../data/memes.json')
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'memes',
  description: 'Display a meme',
  args: true,
  options: [{ name: 'meme', description: 'The meme to display', type: ApplicationCommandOptionType.String, required: false }],
  usage: '[meme name]',
  guildOnly: true,
  execute (interaction) {
    let memeKeys = Object.keys(memes)

    let meme = interaction.options.getString('meme')

    if(meme === null) {
      let memeIndex = Math.floor(Math.random() * memeKeys.length)
      return interaction.reply(memes[memeKeys[memeIndex]])
    }

    let filteredKeys = memeKeys.filter(function(item){ return item === meme })
    
    if(filteredKeys.length !== 0) {
      interaction.reply(memes[filteredKeys[0]])
    } else {
      let currentMemes = ''
      for(let i = 0; i < memeKeys.length; i++) {
        if (i === 0) {
          currentMemes = memeKeys[i]
        } else {
          currentMemes += ', ' + memeKeys[i]
        }
      }
      interaction.reply(`Current memes: ${currentMemes}`)
    }
  }
}
