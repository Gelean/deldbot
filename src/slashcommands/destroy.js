const config = require('../../.env/config.json')
const destroy = require('../data/destroy.json')
const destroyTargets = require('../data/destroy_targets.json')
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'destroy',
  description: 'Destroys other users with a chance of a backfire or miss',
  args: true,
  options: [{ name: 'target', description: 'The target to be destroyed', type: ApplicationCommandOptionType.String, required: true }],
  usage: '[target]',
  guildOnly: true,
  execute (interaction) {
    const target = interaction.options.getString('target')

    let order = image = index = ''
    let targetIdentified = true
    let destroyTargetKeys = Object.keys(destroyTargets)

    if (!target.startsWith('<@') && target !== '@everyone' && target !== '@here') {
      targetIdentified = false
    } else if (target === '<@' + config.discord.id + '>') {
      order = `${interaction.user.toString()} attempts to destroy <@${config.discord.id}>, but fails`
      image = 'https://i.imgur.com/Av8WEet.gifv'
    } else if (target === interaction.user.toString()) {
      index = Math.floor(Math.random() * destroy.sepukkuArray.length)
      order = `${interaction.user.toString()} ${destroy.sepukkuArray[index][1]}`
      image = destroy.sepukkuArray[index][0]
    } else if (target === '<@' + config.owner.id + '>') {
      order = `${interaction.user.toString()}'s gun misfires and kills himself after attempting to shoot <@${config.owner.id}>`
      image = 'https://i.imgur.com/exd2yso.gifv'
    } else if (target === '@here') {
      index = Math.floor(Math.random() * destroy.hereArray.length)
      order = `${interaction.user.toString()} ${destroy.hereArray[index][1]}`
      image = destroy.hereArray[index][0]
    } else if (target === '@everyone') {
      index = Math.floor(Math.random() * destroy.everyoneArray.length)
      order = `${interaction.user.toString()} ${destroy.everyoneArray[index][1]}`
      image = destroy.everyoneArray[index][0]
    } else if (target.startsWith('<@&')) {
      let fields = target.split(/<@&|>/)
      roleId = fields[1]
      let role = interaction.guild.roles.cache.find(r => r.id === roleId);
      if (destroyTargetKeys.includes(role.name)) {
        order = `${interaction.user.toString()} ${destroyTargets[role.name][0][0]} ${target}, ${destroyTargets[role.name][0][2]}`
        image = destroyTargets[role.name][0][1]
      } else {
        targetIdentified = false
      }
    } else {
      // 90% chance of hitting, 10% chance of a backfire/miss
      let backfirePercent = Math.random()
      if (backfirePercent <= 0.9) {
        index = Math.floor(Math.random() * destroy.wmdArray.length)
        order = `${interaction.user.toString()} ${destroy.wmdArray[index][0]} ${target} ${destroy.wmdArray[index][2]}`
        image = destroy.wmdArray[index][1]
      } else {
        index = Math.floor(Math.random() * destroy.backfireArray.length)
        order = `${interaction.user.toString()} ${destroy.backfireArray[index][0]} ${target} ${destroy.backfireArray[index][2]}`
        image = destroy.backfireArray[index][1]
      }
    }

    if (targetIdentified) {
      interaction.reply(`${order}\n${image}`)
    } else {
      interaction.reply(`No valid target identified, calling off the attack\nhttps://i.imgur.com/aFh4dvl.gifv`)
    }
  }
}