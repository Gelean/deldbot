const https = require('https')

module.exports = {
  name: 'discordstatus',
  description: 'Returns the status of the Discord service',
  args: false,
  options: [],
  usage: '',
  guildOnly: true,
  execute (interaction) {
    let discordOptions = {
      hostname: 'srhpyqt94yxb.statuspage.io',
      path: '/api/v2/incidents/unresolved.json',
      method: 'GET'
    }

    https.get(discordOptions, (resp) => {
      let data = ''
      //console.log('statusCode:', resp.statusCode)
      //console.log('headers:', resp.headers)

      resp.on('data', (chunk) => {
          data += chunk
      })

      resp.on('end', () => {
        discordData = JSON.parse(data)
        //console.log('data:', discordData)

        if (discordData.incidents.length == 0 || discordData.incidents === undefined) {
          interaction.reply(`There are no ongoing incidents\nhttps://status.discord.com`)
        } else {
          let incidents = ''
          for (let i = 0; i < discordData.incidents.length; i++) {
            incidents += `${discordData.incidents[i].name} - ${discordData.incidents[i].shortlink}\n`
          }
          interaction.reply(incidents)
        }
      })
    }).on('error', (err) => {
      console.error(err)
      interaction.reply(`An error has occurred, go yell at <@${config.owner.id}>`)
    })
  }
}
