const config = require('../../.env/config.json')

module.exports = {
  name: 'uptime',
  description: 'Returns Deldbot\'s uptime',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 1,
  aliases: ['up'],
  execute (message, args) {
    if (message.client.presence.status === 'online') {
      let now = new Date().getTime()
      let totalSeconds = (now - message.client.readyTimestamp) / 1000

      let days = Math.floor(totalSeconds / 86400)
      totalSeconds -= days * 86400
      let hours = Math.floor(totalSeconds / 3600)
      totalSeconds -= hours * 3600
      let minutes = Math.floor(totalSeconds / 60)
      totalSeconds -= minutes * 60
      let seconds = Math.floor(totalSeconds)

      message.channel.send(`${config.discord.username} has been online for ${days} day(s), ${hours} hour(s), ${minutes} minute(s), ${seconds} second(s)`)
    } else {
      message.channel.send(`${config.discord.username} is currently offline`)
    }
  }
}
