const prefix = require('../../.env/config.json').global.prefix

module.exports = {
  name: 'help',
  description: 'Report valid commands',
  args: false,
  usage: '[command name]',
  guildOnly: false,
  cooldown: 1,
  aliases: ['commands'],
  execute (message, args) {
    let commandString = ""
    const { commands } = message.client

    console.log(commands)

    if (!args.length) {
      commandString = 'Here\'s a list of all my commands:\n'
      commandString += commands.map(command => command.name).join(', ')
      commandString += `\nPlease supply a command you wish to learn more about, for example\n\`${prefix}help [command name]\``

      return message.author.send(commandString, { split: true })
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

    commandString += `**Name:** ${command.name}\n`

    if (command.aliases) commandString += `**Aliases:** ${command.aliases.join(', ')}\n`
    if (command.description) commandString += `**Description:** ${command.description}\n`
    if (command.usage) commandString += `**Usage:** ${prefix}${command.name} ${command.usage}\n`

    commandString += `**Cooldown:** ${command.cooldown || 3} second(s)\n`

    message.channel.send(commandString, { split: true })
  }
}
