const prefix = require('../../.env/config.json').global.prefix
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'help',
  description: 'Report valid commands',
  args: true,
  options: [{ name: 'command', description: 'The specific command to learn about', type: ApplicationCommandOptionType.String, required: false }],
  usage: '[command name]',
  guildOnly: false,
  execute (interaction) {
    let slashCommandString = ""
    const { slashCommands } = interaction.client
    //console.log(slashCommands)
    const slashCommandName = interaction.options.getString('command')

    if (slashCommandName === null) {
      slashCommandString = 'Here\'s a list of all my slash commands:\n'
      slashCommandString += slashCommands.map(slashCommand => slashCommand.name).join(', ')
      slashCommandString += `\nPlease supply a command you wish to learn more about, for example\n\`${prefix}help [command name]\``

      // split: true needed?
      return interaction.user.send(slashCommandString)
        .then(() => {
          if (interaction.channel.type === 'dm') return
          interaction.reply('I\'ve sent you a DM with all my commands!')
        })
        .catch(error => {
          console.error(`Could not send help DM to ${interaction.user.toString()}.\n`, error)
          interaction.reply('It seems like I can\'t Dm you! Do you have DMs disabled?')
        })
    }

    const slashCommand = slashCommands.get(slashCommandName.toLowerCase())

    if (!slashCommand) {
      return interaction.reply('That\' not a valid command!')
    }

    slashCommandString += `**Name:** ${slashCommand.name}\n`

    if (slashCommand.description) slashCommandString += `**Description:** ${slashCommand.description}\n`
    if (slashCommand.usage) slashCommandString += `**Usage:** ${prefix}${slashCommand.name} ${slashCommand.usage}\n`

    interaction.reply(slashCommandString)
  }
}
