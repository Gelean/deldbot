const config = require('../../.env/config.json')
const itad = require('itad-api-client-ts')
const Discord = require('discord.js')

// Initialize ITAD Service
var itadApi = new itad.IsThereAnyDealApi(config.itad.key)
async () => {
  const shops = await itadApi.getShops()
}

module.exports = {
  name: 'itad',
  description: 'Searches IsThereAnyDeal for deals on games',
  args: true,
  usage: '',
  guildOnly: true,
  cooldown: 5,
  aliases: ['isthereanydeal'],
  execute (message, args) {
    var query = title = ''

    if (args.length == 0) {
      message.channel.send("No game specified, please use: !itad <query> or !isthereanydeal <query> to search for prices for a games")
      //break
    } else {
      query = args.join(' ')
      console.log('Query: ' + query)
    }

    var noResults = true
    var fieldCount = 0
    var gameEmbed = new Discord.MessageEmbed(); //get rid of semicolon by fixing "TypeError: (intermediate value) is not a function"
    //let Embed = new Discord.MessageEmbed()
    //https://www.codegrepper.com/code-examples/javascript/Discord.Rich+Embed()+discord.js+v12

    (async () => { //this might be causing the typescript error
      const itadOutput = await itadApi.getDealsFull({
        shops: ['steam', 'gog', 'origin', 'epic', 'battlenet', 'uplay', 'squenix', 'humblestore'],
        limit: 50,
        sort: 'time'
      }, query)

      itadOutput.list.sort((a, b) => a.title.localeCompare(b.title, 'en', { ignorePunctuation: true }))
      // console.log(itadOutput)
      // console.log(itadOutput.list)

      if (itadOutput.count >= 1) {
        for (var i = 0; i < itadOutput.count; i++) {
          var itadElement = itadOutput.list[i]
          //console.log(itadElement)
          //console.log(itadElement.title)

          if (title === '' && !itadElement.title.includes('Offer') && !itadElement.title.includes('Currency') && !itadElement.title.includes('Pass') &&
                            !itadElement.title.includes('Pack') && itadElement.is_dlc === false && itadElement.image !== null) {
            /* if (!query.toLowerCase().includes("complete") && (itadElement.title.includes("Complete") || itadElement.title.includes("Collection"))) {
              console.log(query)
              console.log(itadElement.title)
              break
            }
            else if (!query.toLowerCase().includes("goty") && (itadElement.title.includes("Game of the Year") || itadElement.title.includes("GOTY"))) {
              console.log(query)
              console.log(itadElement.title)
              break
            }
            */

            title = itadElement.title
            gameEmbed.setColor('046EB2')
              .setTitle(title)
              .setURL(itadElement.urls.game)
              .setImage(itadElement.image)
              .setFooter('IsThereAnyDeal', 'https://i.imgur.com/Y53EOrA.jpg')
          }
          if (itadElement.shop.name === 'Epic Game Store') {
            itadElement.shop.name = 'Epic'
          }
          // console.log(title)
          // console.log(itadElement.title)
          if (title === itadElement.title && !itadElement.title.includes('Offer') && !itadElement.title.includes('Currency') &&
                            !itadElement.title.includes('Pass') && !itadElement.title.includes('Pack') &&
                            itadElement.is_dlc === false && itadElement.image !== null
                            && fieldCount < 8) {
            gameEmbed.addField('Sale Price (' + itadElement.shop.name + ')', '$' + itadElement.price_new.toString(), true)
            gameEmbed.addField('List Price (' + itadElement.shop.name + ')', '$' + itadElement.price_old.toString(), true)
            gameEmbed.addField('Discount', itadElement.price_cut.toString() + '%', true)
            fieldCount++
            noResults = false
          }
        }
      }

      if (noResults) {
        message.channel.send("No results found, please refine your search dimwit")
      } else {
        message.channel.send(gameEmbed)
      }
    })()
  }
}