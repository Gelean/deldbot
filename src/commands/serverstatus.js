// const PlexAPI = require('plex-api')
const config = require('../../.env/config.json')
const { execFileSync } = require('node:child_process');

// Initialize Plex
/*
let plex = new PlexAPI({
  hostname: config.plex.hostname,
  port: config.plex.port,
  username: config.plex.username,
  password: config.plex.password,
  token: config.plex.token
})
*/

module.exports = {
  name: 'serverstatus',
  description: 'Returns the status of Plex servers',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 1,
  aliases: ['ss'],
  execute (message, args) {
    const serverList = config.serverList
    const output = execFileSync(
      'curl',
      [
        '-sS',
        '-H', `X-Plex-Token: ${config.plex.token}`,
        '-H', `X-Plex-Client-Identifier: deldbot`,
        '-H', 'X-Plex-Product: deldbot',
        '-H', 'Accept: application/json',
        'https://plex.tv/api/v2/resources?includeHttps=1&includeRelay=1',
      ],
      { encoding: 'utf8', timeout: 10000 }
    );
    jsonOutput = JSON.parse(output)

    const serverMap = new Map(serverList.map(server => [server.name, server]));
    const matchedPlexServers = jsonOutput
      .filter(plexServer => serverMap.has(plexServer.name))
      .map(plexServer => {
        const serverConfig = serverMap.get(plexServer.name);
        return {
          ...plexServer,
          owner: serverConfig.owner,
          ownerId: serverConfig.ownerId
        }
      })

    var messageText = ""
    for (let i = 0; i < matchedPlexServers.length; i++) {
      if (matchedPlexServers[i].presence == true) {
        messageText += `${matchedPlexServers[i].owner}'s server is up\n`
      } else {
        messageText += `${matchedPlexServers[i].owner}'s server appears to be down, go yell at <@${matchedPlexServers[i].ownerId}>\n`
      }
    }
    message.channel.send(messageText)
  }
}