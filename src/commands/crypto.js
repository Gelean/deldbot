const config = require('../../.env/config.json')
const https = require('https')
const Discord = require('discord.js')

module.exports = {
  name: 'crypto',
  description: 'Returns a price for a given cryptocurrency or cryptocurrencies',
  args: true,
  usage: '[cryptocurrency] ([cryptocurrency]...)',
  guildOnly: true,
  cooldown: 1,
  aliases: ['cryptocurrency', 'cryptocurrencies'],
  execute (message, args) {
    let cryptocurrencies = args
    // console.log(`Query: ${cryptocurrencies}`)

    for(let i = 0; i < cryptocurrencies.length; i++) {
      let cryptoQuery = `https://api.binance.com/api/v3/ticker/price?symbol=${cryptocurrencies[i].toUpperCase()}USDT`

      https.get(cryptoQuery, (resp) => {
        let data = cryptoData = ''
  
        resp.on('data', (chunk) => {
          data += chunk
        })
  
        resp.on('end', () => {
          cryptoData = JSON.parse(data)
          // console.log(`data: ${cryptoData.toString()}`)

          if (cryptoData !== null) {
            const currentDate = new Date()
            let month = (1 + currentDate.getMonth()).toString()
            month = month.length > 1 ? month : '0' + month
            let day = currentDate.getDate().toString()
            day = day.length > 1 ? day : '0' + day
            let year = currentDate.getFullYear()
            cryptoDate = `${year}-${month}-${day}`

            let cryptoEmbed = new Discord.MessageEmbed()
            cryptoEmbed.setColor('F0B90B')
              .setURL(`https://www.binance.com/en/trade/${cryptocurrencies[i].toUpperCase()}_USDT`)
              .setTitle(cryptocurrencies[i].toUpperCase())
              .setFooter('Binance', 'https://i.imgur.com/4Rm5H8z.png')
              cryptoEmbed.addField('Date', `${cryptoDate}`, true)
              if (cryptoData.price >= 100) {
                cryptoEmbed.addField('Price', `$${Math.round(cryptoData.price)}`, true)
              } else {
                cryptoEmbed.addField('Price', `$${cryptoData.price}`, true)
              }
            message.channel.send(cryptoEmbed)
          } else {
            message.channel.send(`No cryptocurrency found for ${cryptocurrencies[i]} symbol dimwit`)
          }
        })
      }).on('error', (err) => {
        message.channel.send(`An error has occurred, go yell at ${config.owner.id}`)
      })
      //});
    }
  }
}