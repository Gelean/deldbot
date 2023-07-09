const config = require('../../.env/config.json')
const { Configuration, OpenAIApi } = require('openai')

module.exports = {
  name: 'chatgpt',
  description: 'Consult chatgpt',
  args: true,
  usage: '[message]',
  guildOnly: true,
  cooldown: 1,
  aliases: ['openai'],
  execute (message, args) {
    (async() => {
      if (config.chatgpt.key === 'CHATGPT_KEY') {
        return interaction.reply('The chatgpt.key is blank, set it in config.json')
      }

      if (config.chatgpt.organization === 'CHATGPT_ORGANIZATION') {
        return interaction.reply('The chatgpt.organization is blank, set it in config.json')
      }

      let query = args.join(' ')
      console.log(`Query: ${query}`)

      // Initialize ChatGPT
      const configuration = new Configuration({
          organization: config.chatgpt.organization,
          apiKey: config.chatgpt.key,
      })
      const openai = new OpenAIApi(configuration)

      //const modelList = await openai.listModels()
      //console.log(modelList)

      // Defer the reply until ChatGPT has responded
      //await interaction.deferReply()

      try {
        const completion = await openai.createCompletion({
          model: "text-davinci-003",
          //model: "gpt-3.5-turbo",
          prompt: query,
        })
        message.channel.send(completion.data.choices[0].text)
        //await interaction.editReply(completion.data.choices[0].text)
      } catch (error) {
        if (error.response) {
          message.channel.send(error.response.data.error.message)
        } else {
          message.channel.send(error.message)
        }
      }
    })()
  }
}