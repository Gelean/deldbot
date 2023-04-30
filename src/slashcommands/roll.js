let d20 = require('d20')
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'roll',
  description: 'Roll x number of dice with x sides',
  args: true,
  options: [{ name: 'num', description: 'Number of dice to roll', type: ApplicationCommandOptionType.Number, required: true }, 
            { name: 'sides', description: 'Number of sides per die', type: ApplicationCommandOptionType.Number, required: true }],
  usage: '[# of dice]d[# of sides]',
  guildOnly: true,
  execute (interaction) {
    let roll = dice = length = ''
    const numDice = interaction.options.getNumber('num')
    const sides = interaction.options.getNumber('sides')

    if (numDice < 1 || sides < 1) {
      return interaction.reply('You\'ve entered an improper number of dice or number of sides, fix it dimwit')
    }

    let rollText = article = ""
    for (let i = 0; i < numDice; i++) {
      roll = d20.roll(sides)
      if (roll === 8 || roll === 11 || roll === 18) {
        article = "an"
      } else {
        article = "a"
      }
      rollText += `${interaction.user.toString()} rolled ${article} ${roll} on a d${sides} :game_die:\n`
    }
    interaction.reply(rollText)
  }
}