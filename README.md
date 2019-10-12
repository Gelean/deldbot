# deldbot

## Description

Deldbot is a Discord Bot written in Nodejs 10.16.3 and uses the plex-api library.

## Features

* Pull Youtube links from a playlist file
* Check if the Plex server is up
* Search for entries in the Plex server

## Software, Libraries, and APIs

* [NodeJS 10.x+](https://nodejs.org/en/download/)
* [Plex-Api 5.2.5+](https://www.npmjs.com/package/plex-api/)
* [Discord.io 2.5.3+](https://izy521.gitbooks.io/discord-io/content/)
* [Discord.io-gateway6 2.5.3+](https://www.npmjs.com/package/discord.io)
* [OMDb API](https://www.omdbapi.com/)
* [Imgur API](https://api.imgur.com/)

## Installation & Configuration

The steps on the following page provide a good guide of the steps in creating and running a Discord bot: https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/

1. Go to discordapp.com/developers/applications
1. Click on New Application and supply a name
1. Click on your new application 
1. Copy the Client ID and Client Secret
1. Click on Bot under Settings on the left hand side
1. Enter a username and copy the Token
1. Check what permissions will be needed, all of the text permissions should be sufficient (522304)
1. Open up the following URL, replacing the CLIENT_ID and permissions with your own values: https://discordapp.com/oauth2/authorize?&client_id=CLIENT_ID&scope=bot&permissions=0
1. On this Github page click on Clone or download -> Download ZIP
1. Unzip the repository code somewhere on your machine
1. Open up the windows CMD prompt and run as administrator  (or whatever you use to run code)
1. Change directory to the directory where the bot's code resides
1. Run the following: npm install discord.io winston plex-api –save
1. Run the following: npm install https://github.com/woor/discord.io/tarball/gateway_v6
1. Obtain the Plex token of your server by referencing the following link: https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/
1. Obtain an OMDb API Key from https://www.omdbapi.com/apikey.aspx
1. Register an application and obtain an Imgur client id and secret from https://api.imgur.com/oauth2/addclient
1. Update config.js with the client id, client secret, discord token, plex id, plex token, username, password, plex token, plex server hostname, plex server port, omdb api key, imgur client id, imgur client secret, and the id of the imgur album you wish to use. Some of these are optional depending on what functionality you want to use.
1. Run the following: node bot.js
1. Keep it running for the bot to work
1. Voila, you can now start to issue commands in your discord server and test out if the bot is working right

## Webhooks

1. Discord Webhooks: https://support.discordapp.com/hc/en-us/articles/228383668-Intro-to-Webhooks
1. Plex Webhooks: https://tautulli.com/ and https://github.com/Tautulli/Tautulli-Wiki/wiki/Notification-Agents-Guide#discord
1. Github Webhooks: https://gist.github.com/jagrosh/5b1761213e33fc5b54ec7f6379034a22

## Links and References

* https://www.themoviedb.org/documentation/api?language=en-US
* https://discordjs.guide/
* https://cog-creators.github.io/discord-embed-sandbox/
* https://github.com/v0idp/Mellow
* https://rapidapi.com/imdb/api/movie-database-imdb-alternative
