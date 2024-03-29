# Deldbot

Deldbot is a Discord Bot written in Node.js, utilizing Discord.js and several other open source libraries

## Software, Libraries, and APIs

* [Node.js](https://nodejs.org/en/download/)
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm/)
* [Jest](https://jestjs.io/)
* [discord.js](https://www.npmjs.com/package/discord.js/)
* [d20](https://www.npmjs.com/package/d20/)
* [finnhub](https://www.npmjs.com/package/finnhub/)
* [howlongtobeat](https://www.npmjs.com/package/howlongtobeat/)
* [itad-api-client-ts](https://www.npmjs.com/package/itad-api-client-ts/)
* [openai](https://www.npmjs.com/package/openai)
* [plex-api](https://www.npmjs.com/package/plex-api/)
* [pm2](https://www.npmjs.com/package/pm2/)
* [popyt](https://www.npmjs.com/package/popyt/)
* [Plex API](https://github.com/Arcanemagus/plex-api/wiki/)
* [OMDb API](https://www.omdbapi.com/)
* [Imgur API](https://api.imgur.com/)
* [IsThereAnyDeal API](https://itad.docs.apiary.io/)
* [Youtube Data API](https://developers.google.com/youtube/v3/)
* [Finnhub API](https://finnhub.io/docs/api/)
* [CoinMarketCap API](https://coinmarketcap.com/api/)
* [ChatGPT API](https://platform.openai.com/docs/api-reference/)

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
1. Copy ./config.json into ./.env/config.json
1. Go through the following and generate API keys and tokens for the functionality you want
    1. Obtain the Plex token of your server by referencing the following link: https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/
    1. Obtain an OMDb API key from https://www.omdbapi.com/apikey.aspx
    1. Obtain an ITAD API key by setting up an account and creating a new application at https://isthereanydeal.com/dev/app
    1. Obtain a Youtube API key by setting up an account and creating a new application at https://console.developers.google.com/apis/credentials and enable the YouTube Data API v3 at https://console.developers.google.com/apis/api/youtube.googleapis.com/overview
    1. Obtain a Finnhub API key from https://finnhub.io/docs/api
    1. Register an application and obtain an Imgur client id and secret from https://api.imgur.com/oauth2/addclient
    1. Obtain a CoinMarketCap API key from https://coinmarketcap.com/api
    1. Obtain a ChatGPT API key from https://platform.openai.com/account/api-keys
1. Update ./.env/config.json with your Discord bot's client id, client secret, token, Plex id, Plex token, Plex username, Plex password, Plex token, Plex server hostname, Plex server port, OMDB API key, ITAD API key, Finnhub API key, Youtube API key, Imgur client ID, Imgur client secret, Imgur album ID, CoinMarketCap API key, ChatGPT API key, and ChatGPT organization you wish to use. Many of these are optional depending on what functionality you would like to use.
1. In Discord, go to User Settings > Appearance, enable Developer Mode, right-click your username, Copy ID, paste that number into the owner.id key in ./.env/config.json
1. Run the following: npm run start or node bot.js
    1. If you wish to use pm2 to run the bot to ensure it restarts automatically from crashes, run the following: pm2 start bot.js
    1. You may need to install pm2 with: sudo npm install pm2 -g
1. Voila, you can now start to issue commands in your Discord server and test out if the bot is working right

## Docker image

### Setup the Docker container

1. cd to the root of the deldbot folder
1. docker build -t deldbot-image:latest -f docker/Dockerfile .
1. docker run -it deldbot-image:latest sh
1. docker ps -a

### Tear down the Docker container

1. docker rm $(docker stop $(docker ps -aq --filter ancestor=deldbot-image --format="{{.ID}}"))
1. Alternate tear down commands:
    1. docker ps -aq | xargs -n 1 docker stop
    1. docker ps -aq | xargs -n 1 docker rm
1. docker system prune -a
1. docker images -a

## Running Jest Tests

npm run test

## Webhooks

1. Discord Webhooks: https://support.discordapp.com/hc/en-us/articles/228383668-Intro-to-Webhooks
1. Plex Webhooks: https://tautulli.com/ and https://github.com/Tautulli/Tautulli-Wiki/wiki/Notification-Agents-Guide#discord
1. GitHub Webhooks: https://gist.github.com/jagrosh/5b1761213e33fc5b54ec7f6379034a22
1. Gitlab Webhooks: https://docs.gitlab.com/ee/user/project/integrations/webhooks.html
1. Integromat: https://www.integromat.com/

## Commands and Features

See: `src/commands` for a list of available commands or run !help for more information

## Links and References

* https://discordjs.guide/
* https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID
* https://cog-creators.github.io/discord-embed-sandbox/
* https://www.themoviedb.org/documentation/api?language=en-US
* https://rapidapi.com/imdb/api/movie-database-imdb-alternative
* https://izy521.gitbooks.io/discord-io/content/Methods/Handling_audio.html
* https://gifrun.com
