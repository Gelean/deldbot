const config = require('../../.env/config.json')
const finnhub = require('finnhub');
const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'stock',
  description: 'Returns a price for a given stock ticker or tickers',
  args: true,
  usage: '[ticker] ([ticker]...)',
  guildOnly: true,
  cooldown: 1,
  aliases: ['stocks'],
  execute (message, args) {
    if (config.finnhub.key === 'FINNHUB_KEY') {
      message.channel.send('The finnhub.key is blank, set it in config.json')
      return
    }

    let stocks = args

    const api_key = finnhub.ApiClient.instance.authentications['api_key']
    api_key.apiKey = config.finnhub.key
    const finnhubClient = new finnhub.DefaultApi()

    for(let i = 0; i < stocks.length; i++) {
      finnhubClient.quote(stocks[i], (error, stockData, response) => {
        // console.log(`data: ${data}`)

        if (stockData.d === null) {
          message.channel.send('No stock found for that ticker dimwit')
        } else {
          let stockDate = new Date()
          let month = (1 + stockDate.getMonth()).toString()
          month = month.length > 1 ? month : '0' + month
          let day = stockDate.getDate().toString()
          day = day.length > 1 ? day : '0' + day
          let year = stockDate.getFullYear()
          stockDate = `${year}-${month}-${day}`

          let stockEmbed = new EmbedBuilder()
            .setColor('#1DB954')
            .setTitle(stocks[i].toUpperCase())
            .setURL(`https://www.nasdaq.com/market-activity/stocks/${stocks[i]}`)
            .setFooter({text: 'Finnhub', iconURL: 'https://i.imgur.com/B65r4Nk.png'})
            .addFields(
              {name: 'Date:', value: `${stockDate}`, inline: true},
              {name: 'Current Price', value: `$${stockData.c}`, inline: true},
              {name: 'Previous Close', value: `$${stockData.pc}`, inline: true},
              {name: 'Open', value: `$${stockData.o}`, inline: true},
              {name: 'High', value: `$${stockData.h}`, inline: true},
              {name: 'Low', value: `$${stockData.l}`, inline: true}
            )
          message.channel.send({ embeds: [stockEmbed] });
        }
      });
    }
  }
}