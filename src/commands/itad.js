const config = require('../../.env/config.json')
const itad = require('itad-api-client-ts')
const { EmbedBuilder } = require('discord.js')

module.exports = {
  name: 'itad',
  description: 'Searches IsThereAnyDeal for deals on games',
  args: true,
  usage: '[query]',
  guildOnly: true,
  cooldown: 1,
  aliases: ['isthereanydeal'],
  execute (message, args) {
    (async() => {
      if (config.itad.key === 'ITAD_KEY') {
        message.channel.send('The itad.key is blank, set it in config.json')
        return
      }

      // Initialize ITAD Service
      const itadApi = new itad.IsThereAnyDealApi(config.itad.key)
      async () => {
        const shops = await itadApi.getShops()
      }

      let query = title = ''
      let noResults = true
      let fieldCount = 0
      let gameEmbed = new EmbedBuilder()

      query = args.join(' ')
      // console.log(`Query: ${query}`)

      const itadOutput = await itadApi.getDealsFull({
        shops: ['steam', 'gog', 'origin', 'epic', 'battlenet', 'uplay', 'squenix', 'humblestore'],
        limit: 50,
        sort: 'time'
      }, query)

      itadOutput.list.sort((a, b) => a.title.localeCompare(b.title, 'en', { ignorePunctuation: true }))
      // console.log(itadOutput)
      // console.log(itadOutput.list)

      if (itadOutput.count >= 1) {
        for (let i = 0; i < itadOutput.count; i++) {
          let itadElement = itadOutput.list[i]
          // console.log(itadElement)
          // console.log(itadElement.title)

          if (title === '' && !itadElement.title.includes('Offer') && !itadElement.title.includes('Currency') && !itadElement.title.includes('Pass') &&
              !itadElement.title.includes('Pack') && itadElement.is_dlc === false && itadElement.image !== null) {
              /* if (!query.toLowerCase().includes('complete') && (itadElement.title.includes('Complete') || itadElement.title.includes('Collection'))) {
                console.log(query)
                console.log(itadElement.title)
                break
              }
              else if (!query.toLowerCase().includes('goty') && (itadElement.title.includes('Game of the Year') || itadElement.title.includes('GOTY'))) {
                console.log(query)
                console.log(itadElement.title)
                break
              } */

            title = itadElement.title
            gameEmbed.setColor('046EB2')
              .setTitle(title)
              .setURL(itadElement.urls.game)
              .setImage(itadElement.image)
              .setFooter({text: 'IsThereAnyDeal', iconURL: 'https://i.imgur.com/Y53EOrA.jpg'})
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
            gameEmbed.addFields(
              {name: 'Sale Price (' + itadElement.shop.name + ')', value: '$' + itadElement.price_new.toString(), inline: true},
              {name: 'List Price (' + itadElement.shop.name + ')', value: '$' + itadElement.price_old.toString(), inline: true},
              {name: 'Discount', value: itadElement.price_cut.toString() + '%', inline: true}
            )
            fieldCount++
            noResults = false
          }
        }
      }

      if (noResults) {
        message.channel.send('No results found, please refine your search dimwit')
      } else {
        message.channel.send({ embeds: [gameEmbed] })
      }
    })()
  }
}