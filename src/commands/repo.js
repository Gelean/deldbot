const package = require('../../package.json');

module.exports = {
  name: 'repo',
  description: 'Link to the repository',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 1,
  aliases: ['repository'],
  execute (message, args) {
    message.channel.send("Code for this bot resides at: " + package.repository.url);
  }
}
