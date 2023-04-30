const config = require('../../.env/config.json')
const finnhub = require('finnhub');
const { EmbedBuilder } = require('discord.js')
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'stock',
  description: 'Returns a price for a given stock ticker',
  args: true,
  options: [{ name: 'stock', description: 'The stock ticker to look up', type: ApplicationCommandOptionType.String, required: true }],
  usage: '[stock]',
  guildOnly: true,
  execute (interaction) {
    if (config.finnhub.key === 'FINNHUB_KEY') {
      return interaction.reply('The finnhub.key is blank, set it in config.json')
    }

    const stock = interaction.options.getString('stock')

    const api_key = finnhub.ApiClient.instance.authentications['api_key']
    api_key.apiKey = config.finnhub.key
    const finnhubClient = new finnhub.DefaultApi()

    finnhubClient.quote(stock, (error, stockData, response) => {
      // console.log(`data: ${data}`)

      if (stockData.d === null) {
        interaction.reply('No stock found for that ticker dimwit')
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
          .setTitle(stock.toUpperCase())
          //.setURL(`https://www.nasdaq.com/market-activity/stocks/${stocks[i]}`)
          .setURL(`https://www.nasdaq.com/market-activity/stocks/${stock}`)
          .setFooter({text: 'Finnhub', iconURL: 'https://i.imgur.com/B65r4Nk.png'})
          .addFields(
            {name: 'Date:', value: `${stockDate}`, inline: true},
            {name: 'Current Price', value: `$${stockData.c}`, inline: true},
            {name: 'Previous Close', value: `$${stockData.pc}`, inline: true},
            {name: 'Open', value: `$${stockData.o}`, inline: true},
            {name: 'High', value: `$${stockData.h}`, inline: true},
            {name: 'Low', value: `$${stockData.l}`, inline: true}
          )
        interaction.reply({ embeds: [stockEmbed] });
      }
    });
  }
}