/*
const Discord = require('discord.js')
const fs = require('fs')

var client = new Discord.Client()
client.commands = new Discord.Collection()
const cooldowns = new Discord.Collection()
*/

/*execute (message, args) {
  message.channel.send(fortunes[Math.floor(Math.random() * fortunes.length)])
}*/

function sendChannelMessage(channelID, text, method) {
  bot.sendMessage({
    to: channelID,
    message: text
  })
  /*
  const channel = <client>.channels.cache.get('<id>');
  channel.send('<content>');
  */
  console.log('Command executed: ' + method)
}

function sendUserMessage(userID, text, method) {
  bot.sendMessage({
    to: userID,
    message: text
  })
  /*
  const user = <client>.users.cache.get('<id>');
  user.send('<content>');
  */
  console.log('Command executed: ' + method)
}

function sendEmbedMessage(channelID, embed, method) {
  bot.sendMessage({
    to: channelID,
    embed: embed
  })
  /*
  const channel = <client>.channels.cache.get('<id>');
  channel.send('<content>');
  */
  console.log('Command executed: ' + method)
}

module.exports = { sendChannelMessage, sendUserMessage, sendEmbedMessage }
