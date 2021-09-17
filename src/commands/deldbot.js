const config = require("../../.env/config.json")

module.exports = {
  name: 'deldbot',
  description: 'Deldbot awakens',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 5,
  aliases: [''],
  execute (message, args) {
    var userId = "<@!" + message.author.id + ">"

    if (args.length == 0) {
      message.channel.send("Awaiting orders")
    } else if (args.length == 1 && args[0] !== "destroy") {
      message.channel.send("Incorrect order specified")
    } else if (args.length > 1 && args[0] === "destroy" && !args[1].startsWith("<@") && args[1] !== "@everyone" && args[1] !== "@here") {
      message.channel.send("No target specified for Deldbot to destroy")
    } else if (args.length > 1 && args[0] === "destroy" && userId === config.owner.id) { //handle case of multiple args
      message.channel.send("Deldbot heeds the call of the last Deld and destroys " + args[1])
      message.channel.send("https://i.imgur.com/yha5vhb.gifv")
      sentMessage = true;
    } else {
      message.channel.send("Deldbot does not recognize your authority")
    }
  }
}