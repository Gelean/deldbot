module.exports = {
  name: 'ping',
  description: 'Ping',
  args: false,
  usage: '',
  guildOnly: true,
  cooldown: 5,
  aliases: [''],
  execute (message, args) {
    message.channel.send(`:ping_pong: Latency is ${Math.round(message.client.ws.ping)}ms`);
  }
}
