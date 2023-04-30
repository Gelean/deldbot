const config = require('../../.env/config.json')

module.exports = {
  name: 'request',
  description: 'Make a request',
  args: false,
  usage: '[request]',
  guildOnly: true,
  cooldown: 1,
  aliases: [''],
  execute (message, args) {
    query = args.join(' ')
    console.log(`Query: ${query}`)

    if (query.length === 0) {
      message.channel.send(`<@${message.author.id}> requests something from <@${config.owner.id}>`)
    } else {
      message.channel.send(`<@${message.author.id}> requests ${query} from <@${config.owner.id}>`)
    }
  }
}