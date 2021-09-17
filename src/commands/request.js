const config = require('../../.env/config.json')

module.exports = {
  name: 'request',
  description: 'Request something',
  args: true,
  usage: '',
  guildOnly: true,
  cooldown: 5,
  aliases: [''],
  execute (message, args) {
    var user = "<@!" + message.author.id + ">";

    item = args.join(' ');
    console.log("Query: " + query);

    message.channel.send(user + " requests " + item + " from " + config.owner.id);
  }
}