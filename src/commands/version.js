const package = require('../../package.json');

module.exports = {
  name: 'version',
  description: 'Bot version',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 5,
  aliases: ['ver'],
  execute (message, args) {
    message.channel.send("Current Version: " + package.version);
  }
}
