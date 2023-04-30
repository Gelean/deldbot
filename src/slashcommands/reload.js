const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'reload',
  description: 'Reloads a command',
  args: true,
  options: [{ name: 'command', description: 'The command to reload', type: ApplicationCommandOptionType.String, required: true }],
  usage: '[command name]',
  guildOnly: true,
  execute (interaction) {
    const slashCommandName = interaction.options.getString('command')
    const slashCommand = interaction.client.slashCommands.get(slashCommandName)

    if (!slashCommand) {
      return interaction.reply(`There is no slash command with name \`${slashCommandName}\`, ${interaction.user.toString()}!`)
    }

    delete require.cache[require.resolve(`./${slashCommand.name}.js`)]

    try {
      const newCommand = require(`./${slashCommand.name}.js`)
      interaction.client.slashCommands.set(newCommand.name, newCommand)
      interaction.reply(`Command \`${slashCommand.name}\` was reloaded!`)
    } catch (error) {
      console.log(error)
      interaction.reply(`There was an error while reloading a command \`${slashCommand.name}\`:\n\`${error.message}\``)
    }
  }
}
