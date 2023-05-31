const config = require('../../.env/config.json')
const https = require('https')

module.exports = {
  name: 'crypto',
  description: 'Returns a price for a given cryptocurrency or cryptocurrencies',
  args: true,
  usage: '[cryptocurrency] ([cryptocurrency]...)',
  guildOnly: true,
  cooldown: 1,
  aliases: ['cryptocurrency', 'cryptocurrencies'],
  execute (message, args) {
    if (config.coinmarketcap.key === 'COINMARKETCAP_KEY') {
      return message.channel.send('The coinmarketcap.key is blank, set it in config.json')
    }

    let cryptocurrencies = args
    // console.log(`Query: ${cryptocurrencies}`)

    for (let i = 0; i < cryptocurrencies.length; i++) {
      let url = `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?CMC_PRO_API_KEY=${config.coinmarketcap.key}&symbol=${cryptocurrencies[i]}`

      https.get(url, (resp) => {
        let data = cryptoData = ''

        resp.on('data', (chunk) => {
          data += chunk
        })

        resp.on('end', () => {
          cryptoData = JSON.parse(data)
          // console.log(cryptoData)
          // console.log(cryptoData["data"])
          if (cryptoData === '' || cryptoData === null || cryptoData === undefined || cryptoData["data"][cryptocurrencies[i]] === undefined) {
            message.channel.send('No results found, please refine your search dimwit')
          } else {
            message.channel.send(`The price of ${cryptocurrencies[i]} is: $${cryptoData["data"][cryptocurrencies[i]]["quote"]["USD"]["price"].toFixed(2)}`)
          }
        })
      }).on('error', (err) => {
        console.error(err)
        message.channel.send(`An error has occurred: ${err}`)
      })
    }
  }
}