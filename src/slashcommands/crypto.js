// This command is now broken:
// https://www.quantconnect.com/forum/discussion/14508/binance-support-just-said-that-they-are-no-longer-working-with-us-based-ips/p1

const config = require('../../.env/config.json')
const https = require('https')
const { EmbedBuilder } = require('discord.js')
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'crypto',
  description: 'Returns a price for a given cryptocurrency',
  args: true,
  options: [{ name: 'crypto', description: 'The cryptocurrency to look up', type: ApplicationCommandOptionType.String, required: false }],
  usage: '[cryptocurrency]',
  guildOnly: true,
  execute (interaction) {
    const cryptocurrency = interaction.options.getString('crypto')

    let cryptoQuery = `https://api.binance.com/api/v3/ticker/price?symbol=${cryptocurrency.toUpperCase()}USDT`

    https.get(cryptoQuery, (resp) => {
      let data = cryptoData = ''

      resp.on('data', (chunk) => {
        data += chunk
      })

      resp.on('end', () => {
        cryptoData = JSON.parse(data)
        // console.log(`data: ${data}`)

        if (cryptoData.code === null) {
          const currentDate = new Date()
          let month = (1 + currentDate.getMonth()).toString()
          month = month.length > 1 ? month : '0' + month
          let day = currentDate.getDate().toString()
          day = day.length > 1 ? day : '0' + day
          let year = currentDate.getFullYear()
          cryptoDate = `${year}-${month}-${day}`

          let cryptoEmbed = new EmbedBuilder()
            .setColor('F0B90B')
            .setURL(`https://www.binance.com/en/trade/${cryptocurrency.toUpperCase()}_USDT`)
            .setTitle(cryptocurrency.toUpperCase())
            .setFooter({text: 'Binance', iconURL: 'https://i.imgur.com/4Rm5H8z.png'})

          cryptoEmbed.addField('Date', `${cryptoDate}`, true)
          if (cryptoData.price >= 100) {
            cryptoEmbed.addField({name: 'Price', value: `$${Math.round(cryptoData.price)}`, inline: true})
          } else {
            cryptoEmbed.addField({name: 'Price', value: `$${cryptoData.price}`, inline: true})
          }
          
          interaction.reply({ embeds: [cryptoEmbed] });
        } else {
          interaction.reply(`No cryptocurrency found for ${cryptocurrency.toUpperCase()} symbol dimwit`)
        }
      })
    }).on('error', (err) => {
      interaction.reply(`An error has occurred, go yell at <@${config.owner.id}>`)
    })
  }
}