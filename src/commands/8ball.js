const fortunes = require('../data/8ball.json')

module.exports = {
  name: '8ball',
  description: 'The Magic 8-Ball',
  args: true,
  usage: 'question',
  guildOnly: true,
  cooldown: 5,
  aliases: ['eightball', 'eight', '8'],
  execute (message, args) {
    message.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)])
  }
}
