let config
try {
  config = require('./.env/config.json')
} catch (error) {
  console.error('CONFIG: Copy ./config.json into ./.env/config.json and modify it')
  throw (error)
}

const prefix = config.global.prefix
const { Client, Collection, GatewayIntentBits, Partials, REST, Routes } = require('discord.js')
const fs = require('fs')

let client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, 
  GatewayIntentBits.GuildMembers, GatewayIntentBits.MessageContent], partials: [Partials.Message, Partials.Channel] })
client.commands = new Collection()
const cooldowns = new Collection()
client.slashCommands = new Collection()
let slashCommandArray = []
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))
const slashCommandFiles = fs.readdirSync('./src/slashcommands').filter(file => file.endsWith('.js'))

for (const file of commandFiles) {
  const command = require(`./src/commands/${file}`)
  client.commands.set(command.name, command)
}

for (const file of slashCommandFiles) {
  const slashCommand = require(`./src/slashcommands/${file}`)
  slashCommandArray.push({ name: slashCommand.name, description: slashCommand.description, options: slashCommand.options })
  client.slashCommands.set(slashCommand.name, slashCommand)
}

// removing the semicolon here results in the following error: TypeError: (intermediate value).setToken(...) is not a function
const rest = new REST({ version: '10' }).setToken(config.discord.token);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.')
    const data = await rest.put(Routes.applicationCommands(config.discord.id), {
      body: slashCommandArray
    })
    console.log(`Successfully reloaded ${data.length} application (/) commands.`);
  } catch (err) {
    console.log(err)
  }
})()

client.login(config.discord.token)

client.once('ready', () => {
  console.log('Bot has connected')
  console.log(`Name: ${config.discord.username} \nID: ${config.discord.id}`)
})

client.on('messageCreate', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return

  const args = message.content.slice(prefix.length).split(/ +/)
  const commandName = args.shift().toLowerCase()
  const command = client.commands.get(commandName) ||
    client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName))

  if (!command) return

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}!`

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``
    }

    return message.channel.send(reply)
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Collection())
  }

  const now = Date.now()
  const timestamps = cooldowns.get(command.name)
  const coolDownAmount = (command.cooldown || 3) * 1000

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + coolDownAmount

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000
      return message.reply(`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command`)
    }
  }

  timestamps.set(message.author.id, now)
  setTimeout(() => timestamps.delete(message.author.id), coolDownAmount)

  try {
    command.execute(message, args)
  } catch (error) {
    console.error(error)
    message.reply('There was an error trying to execute that command')
  }
})

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return

  const slashCommandName = interaction.commandName
  const slashCommand = client.slashCommands.get(slashCommandName)
  
  if (!slashCommand) return

  try {
    await slashCommand.execute(interaction)
  } catch (error) {
    console.error(error)
    await interaction.reply('There was an error trying to execute that command')
  }
})