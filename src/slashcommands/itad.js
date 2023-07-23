const config = require('../../.env/config.json')
const itad = require('itad-api-client-ts')
const { EmbedBuilder } = require('discord.js')
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'itad', // isthereanydeal
  description: 'Searches IsThereAnyDeal for deals on games',
  args: true,
  options: [{ name: 'game', description: 'The game to search for', type: ApplicationCommandOptionType.String, required: true },
            { name: 'shop', description: 'Limit search to a particular shop', 
            choices: [
              { name: 'steam', value: 'steam' }, 
              { name: 'gog', value: 'gog'},
              { name: 'origin', value: 'origin' },
              { name: 'epic', value: 'epic' },
              { name: 'battlenet', value: 'battlenet' },
              { name: 'uplay', value: 'uplay' },
              { name: 'squenix', value: 'squenix' },
              { name: 'humblestore', value: 'humblestore' }
            ], type: ApplicationCommandOptionType.String, required: false }],
  usage: '[query]',
  guildOnly: true,
  execute (interaction) {
    (async() => {
      if (config.itad.key === 'ITAD_KEY') {
        return interaction.reply('The itad.key is blank, set it in config.json')
      }

      const game = interaction.options.getString('game')
      const shop = interaction.options.getString('shop')

      // Initialize ITAD Service
      const itadApi = new itad.IsThereAnyDealApi(config.itad.key)

      let title = ''
      let noResults = true
      let fieldCount = 0
      let gameEmbed = new EmbedBuilder()
      let shopArray = []

      // Defer the reply until ITAD has responded
      await interaction.deferReply()

      if (shop !== null) {
        shopArray = [shop.toLowerCase()]
      } else {
        /*
        async () => {
          const shops = await itadApi.getShops()
        }
        */
        shopArray = ['steam', 'gog', 'origin', 'epic', 'battlenet', 'uplay', 'squenix', 'humblestore']
      }

      const itadOutput = await itadApi.getDealsFull({
        shops: shopArray,
        limit: 50,
        sort: 'time'
      }, game)

      itadOutput.list.sort((a, b) => a.title.localeCompare(b.title, 'en', { ignorePunctuation: true }))
      // console.log(itadOutput)
      // console.log(itadOutput.list)

      if (itadOutput.count >= 1) {
        for (let i = 0; i < itadOutput.count; i++) {
          let itadElement = itadOutput.list[i]
          // console.log(itadElement)
          // console.log(itadElement.title)

          if (title === '' && itadElement.title.toLowerCase().includes(game.toLowerCase()) && !itadElement.title.includes('Offer') &&
              !itadElement.title.includes('Currency') && !itadElement.title.includes('Pass') &&
              !itadElement.title.includes('Pack') && !itadElement.title.includes('Soundtrack') &&
              !itadElement.title.includes('Artbook') && itadElement.is_dlc === false && itadElement.image !== null) {
              /* if (!game.toLowerCase().includes('complete') && (itadElement.title.includes('Complete') || itadElement.title.includes('Collection'))) {
                console.log(game)
                console.log(itadElement.title)
                break
              }
              else if (!game.toLowerCase().includes('goty') && (itadElement.title.includes('Game of the Year') || itadElement.title.includes('GOTY'))) {
                console.log(game)
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
          if (itadElement.shop.name === 'Humble Store') {
            itadElement.shop.name = 'Humble'
          }
          // console.log(title)
          // console.log(itadElement.title)
          if (title === itadElement.title && !itadElement.title.includes('Offer') && !itadElement.title.includes('Currency') &&
              !itadElement.title.includes('Pass') && !itadElement.title.includes('Pack') && !itadElement.title.includes('Soundtrack') &&
              !itadElement.title.includes('Artbook') && itadElement.is_dlc === false && itadElement.image !== null
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
        await interaction.editReply('No results found, please refine your search dimwit')
      } else {
        await interaction.editReply({ embeds: [gameEmbed] })
      }
    })()
  }
}