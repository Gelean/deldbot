const config = require('../../.env/config.json')
const http = require('http')
const Discord = require('discord.js')

module.exports = {
  name: 'stock',
  description: 'Returns a price for a given stock ticker or tickers',
  args: true,
  usage: '[ticker] ([ticker]...)',
  guildOnly: true,
  cooldown: 1,
  aliases: ['stocks'],
  execute (message, args) {
    if (config.marketstack.key === 'MARKETSTACK_KEY') {
      message.channel.send('The marketstack.key is blank, set it in config.json')
      return
    }

    let stocks = args
    // console.log(`Query: ${stocks}`)

    for(let i = 0; i < stocks.length; i++) {
      let stockQuery = `http://api.marketstack.com/v1/eod/latest?access_key=${config.marketstack.key}&symbols=${stocks[i]}`
  
      http.get(stockQuery, (resp) => {
        let data = stockData = ''
  
        resp.on('data', (chunk) => {
          data += chunk
        })
  
        resp.on('end', () => {
          stockData = JSON.parse(data)
          // console.log(`data: ${stockData}`)

          if (stockData.error.code === 'no_valid_symbols_provided') {
            message.channel.send('No stock found for that ticker dimwit')
          } else {
            let stockDate = new Date(stockData.data[0].date)
            let month = (1 + stockDate.getMonth()).toString()
            month = month.length > 1 ? month : '0' + month
            let day = stockDate.getDate().toString()
            day = day.length > 1 ? day : '0' + day
            let year = stockDate.getFullYear()
            stockDate = `${year}-${month}-${day}`

            let stockEmbed = new Discord.MessageEmbed()
            stockEmbed.setColor('02283E')
              .setTitle(stocks[i].toUpperCase())
              .setFooter('Marketstack', 'https://i.imgur.com/ZW5XwhM.jpg')
              stockEmbed.addField('Date', `${stockDate}`, true)
              stockEmbed.addField('Open', `$${stockData.data[0].open}`, true)
              stockEmbed.addField('Close', `$${stockData.data[0].close}`, true)
            message.channel.send(stockEmbed)
          }
        })
      }).on('error', (err) => {
        message.channel.send(`An error has occurred, go yell at ${config.owner.id}`)
      })
    }
  }
}