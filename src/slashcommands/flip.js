const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'flip', // toss, coin
  description: 'Flip a coin',
  args: true,
  options: [{ name: 'num', description: 'Number of coins to flip', type: ApplicationCommandOptionType.String, required: false }],
  usage: '[# of coins]',
  guildOnly: true,
  execute (interaction) {
    const numCoins = parseInt(interaction.options.getString('num'))

    if (isNaN(numCoins)) numCoins = 1
    let headsCount = tailsCount = i = 0
    do {
      outcome = (Math.random() < 0.5)
      if (outcome) {
        headsCount++
      } else {
        tailsCount++
      }
      i++
    } while (i < numCoins)
    interaction.reply(`${interaction.user.toString()} flipped ${numCoins} coin(s) and came up with ${headsCount} head(s) and ${tailsCount} tail(s) :coin:`)
  }
}