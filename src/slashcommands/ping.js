module.exports = {
  name: 'ping',
  description: 'Ping',
  args: false,
  options: [],
  usage: '',
  guildOnly: true,
  execute (interaction) {
    interaction.reply(`:ping_pong: Latency is ${Math.round(interaction.client.ws.ping)}ms`)
  }
}
