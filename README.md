# deldbot

Deldbot is a Discord Bot written in Node.js, utilizing Discord.js and several other open source libraries

## Software, Libraries, and APIs

* [Node.js 14.16.1+](https://nodejs.org/en/download/)
* [npm 6.14.12+](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Jest ^27.2.0+](https://jestjs.io/)
* [discord.js 12.5.3+](https://www.npmjs.com/package/discord.js/)
* [d20 1.4.1+](https://www.npmjs.com/package/d20)
* [plex-api 5.3.1+](https://www.npmjs.com/package/plex-api/)
* [howlongtobeat 1.5.0+](https://www.npmjs.com/package/howlongtobeat/)
* [itad-api-client-ts 1.0.4+](https://www.npmjs.com/package/itad-api-client-ts/)
* [pm2 5.1.1+](https://www.npmjs.com/package/pm2)
* [popyt ^5.0.0+](https://www.npmjs.com/package/popyt)
* [Plex API](https://github.com/Arcanemagus/plex-api/wiki/)
* [OMDb API](https://www.omdbapi.com/)
* [Imgur API](https://api.imgur.com/)
* [IsThereAnyDeal API](https://itad.docs.apiary.io/#)
* [HowLongToBeat API](https://itad.docs.apiary.io/)
* [Youtube Data API](https://developers.google.com/youtube/v3)

## Installation & Configuration

These steps provide a good walkthrough of creating and running a Discord bot: https://www.digitaltrends.com/gaming/how-to-make-a-discord-bot/

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
1. Open up the Windows CMD prompt and run as administrator or open up a Linux terminal
1. Change directory to where the downloaded code resides
1. Run the following: npm install
  1. Optional: if you run into cache issues use the following: npm cache clean --force
1. Obtain the Plex token of your server by referencing the following link: https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/
1. Obtain an OMDb API Key from https://www.omdbapi.com/apikey.aspx
1. Register an application and obtain an Imgur client id and secret from https://api.imgur.com/oauth2/addclient
1. Obtain an ITAD API Key by setting up an account and creating a new application at https://isthereanydeal.com/dev/app
1. Obtain a Youtube API Key by setting up an account and creating a new application at https://console.developers.google.com/apis/credentials and enable the YouTube Data API v3 at https://console.developers.google.com/apis/api/youtube.googleapis.com/overview
1. Update config.js with the client id, client secret, discord token, plex id, plex token, username, password, plex token, plex server hostname, plex server port, omdb api key, imgur client id, imgur client secret, the id of the imgur album you wish to use, itad key, and your Youtube API key. Some of these are optional depending on what functionality you want to use.
1. In Discord, go to User Settings > Appearance, enable Developer Mode, right-click your username, Copy ID, paste that number into USERID in config.js in the ownerId row
1. Run the following: node start bot.js
  1. If you wish to use pm2 to run the bot and ensure it restarts automatically from crashes, run the following: pm2 start bot.js
1. Voila, you can now start to issue commands in your discord server and test out if the bot is working right

## Running Jest Tests

npm run test

## Webhooks

1. Discord Webhooks: https://support.discordapp.com/hc/en-us/articles/228383668-Intro-to-Webhooks
1. Plex Webhooks: https://tautulli.com/ and https://github.com/Tautulli/Tautulli-Wiki/wiki/Notification-Agents-Guide#discord
1. GitHub Webhooks: https://gist.github.com/jagrosh/5b1761213e33fc5b54ec7f6379034a22
1. Gitlab Webhooks: https://docs.gitlab.com/ee/user/project/integrations/webhooks.html
1. Integromat: https://www.integromat.com/

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
* `!youtubesearch <query>`
    * Return a YouTube video
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
* `!dealwithit`
    * Deal With It
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
* `!repo`
    * Displays the URL for this repo
* `!version`
    * Displays the current version of the bot

## Links and References

* https://discordjs.guide/
* https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID
* https://cog-creators.github.io/discord-embed-sandbox/
* https://www.themoviedb.org/documentation/api?language=en-US
* https://rapidapi.com/imdb/api/movie-database-imdb-alternative
* https://izy521.gitbooks.io/discord-io/content/Methods/Handling_audio.html
* https://gifrun.com