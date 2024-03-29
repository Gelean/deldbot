const config = require('../../.env/config.json')
const destroy = require('../data/destroy.json')
const destroyTargets = require('../data/destroy_targets.json')

module.exports = {
  name: 'destroy',
  description: 'Destroys other users with a chance of a backfire or miss',
  args: true,
  usage: '[target]',
  guildOnly: true,
  cooldown: 1,
  aliases: [''],
  execute (message, args) {
    let order = image = index = ''
    let userId = `<@${message.author.id}>`
    let targetIdentified = false
    let destroyTargetKeys = Object.keys(destroyTargets)

    for (let i = 0; i < args.length; i++) {
        targetIdentified = true
        // console.log(args[i])

        if (args[i].indexOf('><') !== -1) {
          targetIdentified = false
        } else if (!args[i].startsWith('<@') && args[i] !== '@everyone' && args[i] !== '@here') {
          targetIdentified = false
        } else if (args[i] === '<@' + config.discord.id + '>') {
          order = `${userId} attempts to destroy ${args[i]}, but fails`
          image = 'https://i.imgur.com/Av8WEet.gifv'
        } else if (args[i] === userId) {
          index = Math.floor(Math.random() * destroy.sepukkuArray.length)
          order = `${userId} ${destroy.sepukkuArray[index][1]}`
          image = destroy.sepukkuArray[index][0]
        } else if (args[i] === '<@' + config.owner.id + '>') {
          order = `${userId}'s gun misfires and kills himself after attempting to shoot <@${config.owner.id}>`
          image = 'https://i.imgur.com/exd2yso.gifv'
        } else if (args[i] === '@here') {
          index = Math.floor(Math.random() * destroy.hereArray.length)
          order = `${userId} ${destroy.hereArray[index][1]}`
          image = destroy.hereArray[index][0]
        } else if (args[i] === '@everyone') {
          index = Math.floor(Math.random() * destroy.everyoneArray.length)
          order = `${userId} ${destroy.everyoneArray[index][1]}`
          image = destroy.everyoneArray[index][0]
        } else if (args[i].includes('<@&')) {
          let fields = args[i].split(/<@&|>/)
          roleId = fields[1]
          let role = message.guild.roles.cache.find(r => r.id === roleId);
          if (destroyTargetKeys.includes(role.name)) {
            order = `${userId} ${destroyTargets[role.name][0][0]} ${args[i]}, ${destroyTargets[role.name][0][2]}`
            image = destroyTargets[role.name][0][1]
          } else {
            targetIdentified = false
          }
        } else {
          // 90% chance of hitting, 10% chance of a backfire/miss
          let backfirePercent = Math.random()
          if (backfirePercent <= 0.9) {
            index = Math.floor(Math.random() * destroy.wmdArray.length)
            order = `${userId} ${destroy.wmdArray[index][0]} ${args[i]} ${destroy.wmdArray[index][2]}`
            image = destroy.wmdArray[index][1]
          } else {
            index = Math.floor(Math.random() * destroy.backfireArray.length)
            order = `${userId} ${destroy.backfireArray[index][0]} ${args[i]} ${destroy.backfireArray[index][2]}`
            image = destroy.backfireArray[index][1]
          }
        }

        if (targetIdentified) {
          message.channel.send(order)
          message.channel.send(image)
          targetIdentified = true
        }
    }

    if (!targetIdentified) {
      message.channel.send('No valid target identified, calling off the attack')
      message.channel.send('https://i.imgur.com/aFh4dvl.gifv')
    }
  }
}