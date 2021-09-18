module.exports = {
  name: 'flip',
  description: 'Flip a coin',
  args: false,
  usage: 'Optionally specify a number of coins to flip, if left blank one coin will be flipped',
  guildOnly: true,
  cooldown: 1,
  aliases: ['toss', 'coin'],
  execute (message, args) {
    for (var i = 0; i < args[0]; i++) {
      outcome = (Math.random() < 0.5)
      if (outcome) {
        message.channel.send("<@!" + message.author.id + ">" + " flipped a coin and it came up heads :coin:")
      } else {
        message.channel.send("<@!" + message.author.id + ">" + " flipped a coin and it came up tails :coin:")
      }
    }
  }
}