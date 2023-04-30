module.exports = {
  name: 'flip',
  description: 'Flip a coin',
  args: false,
  usage: '[# of coins]',
  guildOnly: true,
  cooldown: 1,
  aliases: ['toss', 'coin'],
  execute (message, args) {
    let i = 0
    do {
      outcome = (Math.random() < 0.5)
      if (outcome) {
        message.channel.send(`<@${message.author.id}> flipped a coin and it came up heads :coin:`)
      } else {
        message.channel.send(`<@${message.author.id}> flipped a coin and it came up tails :coin:`)
      }
      i++
    } while (i < args[0])
  }
}