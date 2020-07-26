# deldbot

Deldbot is a Discord Bot written in Nodejs 10.16.3 and using the plex-api library and several API endpoints

## Software, Libraries, and APIs

* [NodeJS 12.16.2+](https://nodejs.org/en/download/)
* [plex-api 5.3.1+](https://www.npmjs.com/package/plex-api/)
* [discord.io 2.5.3+](https://izy521.gitbooks.io/discord-io/content/)
* [discord.io-gateway6 2.5.3+](https://www.npmjs.com/package/discord.io/)
* [discord.js 12.2.0+](https://www.npmjs.com/package/discord.js/)
* [howlongtobeat 1.2.1+](https://www.npmjs.com/package/howlongtobeat/)
* [itad-api 1.0.4+](https://www.npmjs.com/package/itad-api-client-ts/)
* [pm2 4.4.0+](https://www.npmjs.com/package/pm2)
* [Plex API](https://github.com/Arcanemagus/plex-api/wiki/)
* [OMDb API](https://www.omdbapi.com/)
* [Imgur API](https://api.imgur.com/)
* [HowLongToBeat API](https://itad.docs.apiary.io/)

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
1. On this GitHub page click on Code -> Download ZIP
1. Unzip the repository code somewhere on your machine
1. Open up the windows CMD prompt and run as administrator  (or whatever you use to run code)
1. Change directory to the directory where the bot's code resides
1. Optional if you run into cache issues with the following three commands: npm cache clean --force
1. Run the following: npm install --global pm2
1. Run the following: npm install
   1. The above should work with the package.json, but if you want to get it working manually, run: npm install discord.io winston plex-api howlongtobeat itad-api-client-ts discord.js https://github.com/woor/discord.io/tarball/gateway_v6
1. Obtain the Plex token of your server by referencing the following link: https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/
1. Obtain an OMDb API Key from https://www.omdbapi.com/apikey.aspx
1. Register an application and obtain an Imgur client id and secret from https://api.imgur.com/oauth2/addclient
1. Obtain an ITAD API Key by setting up an account and creating a new app at https://isthereanydeal.com/dev/app
1. Update config.js with the client id, client secret, discord token, plex id, plex token, username, password, plex token, plex server hostname, plex server port, omdb api key, imgur client id, imgur client secret, the id of the imgur album you wish to use, and your itad key. Some of these are optional depending on what functionality you want to use.
1. In Discord, go to User Settings > Appearance, enable Developer Mode, right-click your username, Copy ID, paste that number into USERID in config.js in the ownerId row
1. Run the following: pm2 start bot.js
1. Voila, you can now start to issue commands in your discord server and test out if the bot is working right

## Webhooks

1. Discord Webhooks: https://support.discordapp.com/hc/en-us/articles/228383668-Intro-to-Webhooks
1. Plex Webhooks: https://tautulli.com/ and https://github.com/Tautulli/Tautulli-Wiki/wiki/Notification-Agents-Guide#discord
1. GitHub Webhooks: https://gist.github.com/jagrosh/5b1761213e33fc5b54ec7f6379034a22

## Commands and Features

* `!help`
    * Brings up the help menu
* `!usage <command>`
    * Gives usage details for a given command
* `!serverstatus`
    * Displays the Plex server status
* `!discordstatus`
    * Displays the Discord service status from https://status.discord.com/api/v2/
* `!search <query>`
    * Searches the Plex server for anything matching the given query
* `!playlist [index]`
    * Return a YouTube link from the playlist.txt file
* `!schwifty`
    * Get Schwifty
* `!imgur [index]`
    * Return an imgur link from an Imgur album specified in the config.js
* `!soitbegins`
    * So it begins
* `!godwillsit`
    * God wills it!
* `!absenceofgod`
    * Absence of God
* `!releasedate <query> [year]`
    * Check the release date of a given movie through OMDb
* `!omdbsearch [p1-100] <query>`
    * Run a search through OMDb and return the results
* `!howlongtobeat <query>` OR `!hltb <query>`
    * Run a search through HowLongtoBeat and return the results
* `!isthereanydeal <query>` OR `!itad <query>`
    * Run a search through IsThereAnyDeal and return the results
* `!8ball <query>`
    * The Magic 8-Ball gives you a response for your yes/no query
* `!destroy @<user>`
    * Destroy other users on the server
* `!uptime`
    * Displays the current uptime of the bot

## Links and References

* https://www.themoviedb.org/documentation/api?language=en-US
* https://discordjs.guide/
* https://cog-creators.github.io/discord-embed-sandbox/
* https://github.com/v0idp/Mellow
* https://rapidapi.com/imdb/api/movie-database-imdb-alternative
* https://izy521.gitbooks.io/discord-io/content/Methods/Handling_audio.html
* https://gifrun.com
* https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-
