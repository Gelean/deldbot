function sendChannelMessage (channelID, text, method) {
  bot.sendMessage({
    to: channelID,
    message: text
  })
  console.log('Command executed: ' + method)
}

function sendUserMessage (userID, text, method) {
  bot.sendMessage({
    to: userID,
    message: text
  })
  console.log('Command executed: ' + method)
}

function sendEmbedMessage (channelID, embed, method) {
  bot.sendMessage({
    to: channelID,
    embed: embed
  })
  console.log('Command executed: ' + method)
}

module.exports = { sendChannelMessage, sendUserMessage, sendEmbedMessage }
