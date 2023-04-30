const config = require('../../.env/config.json')

module.exports = {
  name: 'deldbot',
  description: 'Deldbot awakens',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 1,
  aliases: [''],
  execute (message, args) {
    if (args.length === 0) {
      message.channel.send('Awaiting orders')
    } else if (args.length === 1 && args[0] !== 'destroy') {
      message.channel.send('Incorrect order specified')
    } else if (args[1] === '<@' + config.discord.id + '>') {
      message.channel.send('I cannot comply with that order')
    } else if (args.length > 1 && args[0] === 'destroy' && !args[1].startsWith('<@') && args[1] !== '@everyone' && args[1] !== '@here') {
      message.channel.send('No target specified for Deldbot to destroy')
    } else if (args.length > 1 && args[0] === 'destroy' && message.author.id === config.owner.id) {
      message.channel.send(`Deldbot heeds the call of the last Deld and destroys ${args[1]}`)
      message.channel.send('https://i.imgur.com/yha5vhb.gifv')
    } else {
      message.channel.send('Deldbot does not recognize your authority')
    }
  }
}