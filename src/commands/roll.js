let d20 = require('d20')

module.exports = {
  name: 'roll',
  description: 'Roll x number of dice with x sides',
  args: false,
  usage: '[# of dice]d[# of sides] ([# of dice]d[# of sides]...)',
  guildOnly: true,
  cooldown: 1,
  aliases: ['dice', 'd20'],
  execute (message, args) {
    let roll = dice = length = ''
    if (args.length === 0) {
      roll = d20.roll(6)
      if (roll === 8 || roll === 11 || roll === 18) {
        article = "an"
      } else {
        article = "a"
      }
      message.channel.send(`<@${message.author.id}> rolled ${article} ${roll} on a d6 :game_die:\n`)
    }

    for (let i = 0; i < args.length; i++) {
      dice = args[i].split('d')
      // console.log('total number of dice: ' + args)
      // console.log('# of dice: ' + dice[0])
      // console.log('# of sides: ' + dice[1])

      if (dice[0] !== '') {
        length = dice[0]
      } else {
        length = 1
      }

      let rollText = article = ""

      for (let j = 0; j < length; j++) {
        roll = d20.roll(dice[1])
        if (roll === 8 || roll === 11 || roll === 18) {
          article = "an"
        } else {
          article = "a"
        }
        rollText += `<@${message.author.id}> rolled ${article} ${roll} on a d${dice[1]} :game_die:\n`
      }
      message.channel.send(rollText)
    }
  }
}