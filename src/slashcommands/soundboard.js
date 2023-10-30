const { createAudioPlayer, createAudioResource, getVoiceConnection, entersState, joinVoiceChannel, AudioPlayerStatus, NoSubscriberBehavior, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require("ytdl-core");
const soundboard = require('../data/soundboard.json')
const { ApplicationCommandOptionType } = require('discord.js')

module.exports = {
  name: 'soundboard',
  description: 'Play a sound from the soundboard',
  args: true,
  options: [{ name: 'sound', description: 'The soundboard file to play', type: ApplicationCommandOptionType.String, required: false }],
  usage: '[soundboard file name]',
  guildOnly: true,
  execute (interaction) {
    (async() => {
      const voiceChannel = interaction.member.voice.channel;
      if (!voiceChannel) {
        interaction.reply('You need to be in a voice channel to use this command');
        return;
      }

      let soundboardKeys = Object.keys(soundboard)
      // console.log(soundboardKeys)
      let soundboardFile = interaction.options.getString('sound')
      // console.log(soundboardFile)

      // Defer the reply until sound has played
      await interaction.deferReply()

      if (soundboardFile === null) {
        let soundboardIndex = Math.floor(Math.random() * soundboardKeys.length)
        try {
          const audioPlayer = createAudioPlayer({
            behaviors: {
              noSubscriber: NoSubscriberBehavior.Pause,
            },
          });

          const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
          });
      
          connection.subscribe(audioPlayer);
    
          const stream = ytdl(soundboard[soundboardKeys[soundboardIndex]], { filter: 'audioonly' });
          const resource = createAudioResource(stream, { seek: 0, volume: 1 });
          audioPlayer.play(resource);
    
          interaction.editReply(`Now playing ${soundboardKeys[soundboardIndex]} in your voice channel`);

          audioPlayer.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
          });
        } catch (error) {
          console.error(error);
          await interaction.editReply('An error occurred while playing the soundboard file');
        }
        return
      }

      let filteredKeys = soundboardKeys.filter(function(item){return item === soundboardFile})
      // console.log(filteredKeys[0])
      
      if (filteredKeys.length !== 0) {
        try {
          const audioPlayer = createAudioPlayer({
            behaviors: {
              noSubscriber: NoSubscriberBehavior.Pause,
            },
          });

          const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
          });
      
          connection.subscribe(audioPlayer);
    
          const stream = ytdl(soundboard[filteredKeys[0]], { filter: 'audioonly' });
          const resource = createAudioResource(stream, { seek: 0, volume: 1 });
          audioPlayer.play(resource);
    
          await interaction.editReply(`Now playing ${filteredKeys[0]} in your voice channel`);

          audioPlayer.on(AudioPlayerStatus.Idle, () => {
            connection.destroy();
          });
        } catch (error) {
          console.error(error);
          await interaction.editReply('An error occurred while playing the soundboard file');
        }
      } else {
        let currentSoundboardFiles = ''
        for (let i = 0; i < soundboardKeys.length; i++) {
          if (i === 0) {
            currentSoundboardFiles = soundboardKeys[i]
          } else {
            currentSoundboardFiles += ', ' + soundboardKeys[i]
          }
        }
        await interaction.editReply(`Current soundboard files: ${currentSoundboardFiles}`)
      }

    })()
    /*
    //const connection = getVoiceConnection(interaction.guildId);
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    const resource = createAudioResource('sample.mp3');
    connection.subscribe(audioPlayer);

    console.log(resource)

    audioPlayer.play(resource, {volume: 1});
    audioPlayer.on('error', error => {
      console.error(`Error: ${error.message} with resource`);
    })
    */
  }
}