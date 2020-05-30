// TODO: memes <meme name> or <id>
module.exports = {
  name: 'soitbegins',
  description: 'Return So it begins GIF',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 5,
  aliases: ['sib'],
  execute (message, args) {
    message.channel.send('https://imgur.com/owtlQgV')
  }
}
