const https = require("https");

module.exports = {
  name: 'discordstatus',
  description: 'Check Discord status',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 1,
  aliases: ['discord'],
  execute (message, args) {
    // Initialize Discord API Options
    var discordOptions = {
      hostname: "srhpyqt94yxb.statuspage.io",
      path: "/api/v2/incidents/unresolved.json",
      method: "GET"
    };
    https.get(discordOptions, (resp) => {
      let data = "";
      //console.log("statusCode:", resp.statusCode);
      //console.log("headers:", resp.headers);
      resp.on("data", (chunk) => {
          data += chunk;
      });
      resp.on("end", () => {
        discordData = JSON.parse(data);
        //console.log("data:", discordData);
        if (discordData.incidents.length == 0 || discordData.incidents === undefined) {
          message.channel.send("There are no ongoing incidents");
          message.channel.send("https://status.discord.com");
        } else {
          for (var i = 0; i < discordData.incidents.length; i++) {
            message.channel.send(discordData.incidents[i].name);
            message.channel.send(discordData.incidents[i].shortlink);
          }
        }
      });
    }).on("error", (err) => {
        console.error(err);
        message.channel.send("An error has occurred, go yell at " + config.ownerId);
    });
  }
}
