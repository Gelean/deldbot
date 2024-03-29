const fortunes = require('../data/8ball.json')

module.exports = {
  name: '8ball',
  description: 'Ask the Magic 8-Ball your question',
  args: true,
  usage: '[question]',
  guildOnly: true,
  cooldown: 1,
  aliases: ['eightball', 'eight', '8'],
  execute (message, args) {
    message.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)])
  }
}