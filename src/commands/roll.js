var d20 = require('d20')

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
      roll = d20.roll(20)
      if (roll === 8 || roll === 11 || roll === 18) {
        message.channel.send(`<@!${message.author.id}> rolled an ${roll} on a d20 :game_die:`)
      } else {
        message.channel.send(`<@!${message.author.id}> rolled a ${roll} on a d20 :game_die:`)
      }
    }

    for (let i = 0; i < args.length; i++) {
      dice = args[i].split('d')
      //console.log('total number of dice: ' + args)
      //console.log('# of dice: ' + dice[0])
      //console.log('# of sides: ' + dice[1])

      if (dice[0] !== '') {
        length = dice[0]
      } else {
        length = 1
      }

      for (let j = 0; j < length; j++) {
        roll = d20.roll(dice[1])
        if (roll === 8 || roll === 11 || roll === 18) {
          message.channel.send(`<@!${message.author.id}> rolled an ${roll} on a d${dice[1]} :game_die:`)
        } else {
          message.channel.send(`<@!${message.author.id}> rolled a ${roll} on a d${dice[1]} :game_die:`)
        }
      }
    }
  }
}