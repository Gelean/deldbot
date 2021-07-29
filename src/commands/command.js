const prefix = require('../../.env/config.json').global.prefix

module.exports = {
  name: 'help',
  description: 'Report valid commands',
  args: false,
  usage: '[arguments name]',
  guildOnly: false,
  cooldown: 5,
  aliases: ['commands'],
  execute (message, args) {
    const data = []
    const { commands } = message.client

    if (!args.length) {
      data.push('Here\'s a list of all my commands:')
      data.push(commands.map(command => command.name).join(', '))
      data.push(`\nPlease supply a command you wish to learn more about, for example\n\`${prefix}help [command name]\``)

      return message.author.send(data, { split: true })
        .then(() => {
          if (message.channel.type === 'dm') return
          message.reply('I\'ve sent you a DM with all my commands!')
        })
        .catch(error => {
          console.error(`Could not send help DM to ${message.author.tag}.\n`, error)
          message.reply('It seems like I can\'t Dm you! Do you have DMs disabled?')
        })
    }

    const name = args[0].toLowerCase()
    const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name))

    if (!command) {
      return message.reply('That\' not a valid command!')
    }

    data.push(`**Name:** ${command.name}`)

    if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`)
    if (command.description) data.push(`**Description:** ${command.description}`)
    if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`)

    data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`)

    message.channel.send(data, { split: true })
  }
}
