const config = require('../../.env/config.json')
const https = require('https')
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'crypto',
  description: 'Returns a price for a given cryptocurrency',
  args: true,
  options: [{ name: 'crypto', description: 'The cryptocurrency to look up', type: ApplicationCommandOptionType.String, required: true }],
  usage: '[cryptocurrency]',
  guildOnly: true,
  execute (interaction) {
    (async() => {
      if (config.coinmarketcap.key === 'COINMARKETCAP_KEY') {
        return interaction.reply('The coinmarketcap.key is blank, set it in config.json')
      }
      const cryptocurrency = interaction.options.getString('crypto')
      
      let url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${config.coinmarketcap.key}&symbol=${cryptocurrency}`

      https.get(url, (resp) => {
        let data = cryptoData = ''

        resp.on('data', (chunk) => {
          data += chunk
        })

        resp.on('end', () => {
          cryptoData = JSON.parse(data)
          // console.log(cryptoData)
          // console.log(cryptoData["data"])
          if (cryptoData === '' || cryptoData === null || cryptoData === undefined || cryptoData["data"][cryptocurrency] === undefined) {
            interaction.reply('No results found, please refine your search dimwit')
          } else {
            interaction.reply(`The price of ${cryptocurrency} is: $${cryptoData["data"][cryptocurrency]["quote"]["USD"]["price"].toFixed(2)}`)
          }
        })
      }).on('error', (err) => {
        console.error(err)
        interaction.reply(`An error has occurred: ${err}`)
      })
    })()
  }
}