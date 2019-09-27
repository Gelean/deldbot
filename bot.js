var fs = require('fs');
var Discord = require('discord.io');
var PlexAPI = require('plex-api');
var logger = require('winston');
var config = require('./config.js');

// Configure logger settings
/*
logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';
*/

// Initialize Discord Bot
var bot = new Discord.Client({
   token: config.botToken,
   autorun: true
});

// Initialize Plex
var plex = new PlexAPI({
    hostname: config.hostname,
    port: config.port,
    username: config.plexUsername,
    password: config.plexPassword,
    token: config.plexToken
});

// Check Plex Server Information
plex.query("/").then(function (result) {
    console.log("Sever: %s" + "\n" + "Plex Version: %s",
        result.MediaContainer.friendlyName,
        result.MediaContainer.version);
}, function (err) {
    console.error("The Plex server appears to be down, go yell at Josh", err);
});
//console.log(plex);

//Whenever a library is added, the number increments by 1, on my server:
//Music is 1
//Movies is 3
//TV Shows is 4

//C:\Program Files (x86)\Plex\Plex Media Server>"Plex Media Scanner.exe" --list
//  3: Movies
//  1: Music
//  4: TV Shows

// Ready the bot
bot.on('ready', function (evt) {
    console.log('Bot has connected');
    console.log('Name: ' + bot.username + "\n" + 'ID: ' + bot.id);
});

// Message handling
bot.on('message', function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        args = args.splice(1);
        
        switch(cmd) {
            // Report valid commands
            case 'help':
                bot.sendMessage({
                    to: channelID,
                    message: 'Valid commands: !help, !serverstatus, !search, !playlist, !schwifty'
                });
                logger.info('Command executed: help');
                break;
            // Check the Plex server status and report back if it's running
            case 'serverstatus':
                plex.query("/").then(function (result) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'The Plex server appears to be up'
                    });
                }, function (err) {
                    bot.sendMessage({
                        to: channelID,
                        message: 'The Plex server appears to be down, go yell at Josh',
                        color: black
                    });
                    console.error("The Plex server appears to be down, go yell at Josh", err);
                });
                console.log('Command executed: serverstatus');
                break;
            // Check if a given piece of media (film, television show, anime, or music) exists on the Plex server
            case 'search':
                var query = "";

                if (args.length == 0) {
                    bot.sendMessage({
                        to: channelID,
                        message: "No search term specified, please use: !search <query> to search for albums, movies, and shows on the Plex server"
                    });
                    break;
                } else{
                    for (var i = 0; i < args.length; i++) {
                      query += args[i] + " ";
                    }
                    console.log("Query: " + query);
                }

                // List of query types: https://github.com/Arcanemagus/plex-api/wiki/MediaTypes
                // 1 - movie, 2 - show, 3 - season, 4 - episode, 5 - trailer, 6 - comic, 7 - person, 8 - artist,
                // 9 - album, 10 - track, 11 - photo album, 12 - picture, 13 - photo, 14 - clip, 15 - playlist

                // TODO: Restructure with callbacks
                // Search movies
                plex.query('/search/?type=1&query=' + query).then(function(res) {
                    var results = res.MediaContainer.Metadata;
                    var resultSize = res.MediaContainer.size;
                    var searchOutput = "";

                    if (resultSize >= 1) {
                        searchOutput += "Films:" + "\n"
                        for (var i = 0; i < resultSize; i++) {
                            //console.log(results[i]);
                            searchOutput += results[i].title + "\n";
                        }
                    }
                    bot.sendMessage({
                        to: channelID,
                        message: searchOutput
                    });
                }, function (err) {
                    bot.sendMessage({
                        to: channelID,
                        message: "An error has occurred, go yell at Derek"
                    });
                    console.log('An error occurred in search');
                });

                // Search shows
                plex.query('/search/?type=2&query=' + query).then(function(res) {
                    var results = res.MediaContainer.Metadata;
                    var resultSize = res.MediaContainer.size;
                    var searchOutput = "";

                    if (resultSize >= 1) {
                        searchOutput += "Shows:" + "\n"
                        for (var i = 0; i < resultSize; i++) {
                            //console.log(results[i]);
                            searchOutput += results[i].title + "\n";
                        }
                    }
                    bot.sendMessage({
                        to: channelID,
                        message: searchOutput
                    });
                }, function (err) {
                    bot.sendMessage({
                        to: channelID,
                        message: "An error has occurred, go yell at Derek"
                    });
                    console.log('An error occurred in search');
                });

                // Search albums
                plex.query('/search/?type=9&query=' + query).then(function(res) {
                    var results = res.MediaContainer.Metadata;
                    var resultSize = res.MediaContainer.size;
                    var searchOutput = "";

                    if (resultSize >= 1) {
                        searchOutput += "Albums:" + "\n"
                        for (var i = 0; i < resultSize; i++) {
                            //console.log(results[i]);
                            searchOutput += results[i].title + "\n";
                        }
                    }
                    bot.sendMessage({
                        to: channelID,
                        message: searchOutput
                    });
                }, function (err) {
                    bot.sendMessage({
                        to: channelID,
                        message: "An error has occurred, go yell at Derek"
                    });
                    console.log('An error occurred in search');
                });
                console.log('Command executed: search');
                break;
            // Pull a Youtube link from a seed file (random video or index)
            case 'playlist':
                var youtubeLink = "";
                if (args == "") {
                    fs.readFile("playlist.txt", {"encoding": "utf8"},  function(err, data) {
                        if (err) {
                            console.log('An error occurred in playlist');
                        } else {
                            var lines = data.toString().split('\n');
                            youtubeLink = lines[Math.floor(Math.random() * lines.length)];
                            bot.sendMessage({
                                to: channelID,
                                message: youtubeLink
                            });
                            console.log('Command executed: playlist');
                        }
                    });
                } else {
                    if (args.length > 1) {
                        bot.sendMessage({
                            to: channelID,
                            message: "Please specify a single index idiot"
                        });
                        console.log('Command executed: playlist with index');
                        break;
                    }

                    var argInt = parseInt(args[0], 10);
                    if (typeof argInt != 'number' || isNaN(argInt)) {
                        bot.sendMessage({
                            to: channelID,
                            message: "Please specify a number idiot"
                        });
                        console.log('Command executed: playlist with index');
                        break;
                    }

                    fs.readFile("playlist.txt", {"encoding": "utf8"},  function(err, data) {
                        if (err) {
                            console.log(err);
                        } else {
                            var lines = data.toString().split('\n');
                            if (args >= lines.length) {
                                bot.sendMessage({
                                    to: channelID,
                                    message: "The index specified is larger than the number of items in the playlist idiot"
                                });
                            } else {
                                youtubeLink = lines[args];
                                bot.sendMessage({
                                    to: channelID,
                                    message: youtubeLink
                                });
                            }
                            console.log('Command executed: playlist with index');
                        }
                    });
                }
                break;
            // Return Get Schwifty (Andromulus Remix)
            case 'schwifty':
                bot.sendMessage({
                    to: channelID,
                    message: 'https://www.youtube.com/watch?v=m3RUYMGD9-o'
                });
                logger.info('Command executed: schwifty');
                break;
            //return movie titles
            case 'movietitles':
                plex.query("/library/sections/3/all").then(function (result) {
                    //console.log( result.MediaContainer );
                    const {
                        Metadata
                    } = result.MediaContainer;

                    // Metadata.map(item => {
                    //     console.log(item)
                    //     console.log('---------------------------------')
                    // });

                    console.log(Metadata);
                    //console.log(Metadata[0].title);
                    //console.log(Metadata[0].Media[0]);
                    bot.sendMessage({
                        to: channelID,
                        message: Metadata[0].title
                    });

                }, function (err) {
                    console.error("An error has occurred, go yell at Derek", err);
                });
                console.log('Command executed: movietitles');
                break;
            // Check the release date (theatrical or DVD release) of a given piece of media
            case 'releasedate':
                bot.sendMessage({
                    to: channelID,
                    message: 'releasedate'
                });
                console.log('Command executed: releasedate');
                break;
            //https://gist.github.com/Godimas/ae8e7c7cbd6236622c777d6bcb7a6748
            // Youtube video webhooks - post Dunkey, etc videos to channel in Discord
            // imgur playlist - latest imgur link and greatesthits from sol - https://api.imgur.com/
            // Minigame (lolis)
            // Build up a to-do list of things to watch or do - Set up Mongo
            // Onmbi plex asks command
            // Bot joins audio and plays Rick clips or YouTube clips
            default:
                bot.sendMessage({
                    to: channelID,
                    message: 'Type !help for commands'
                });
                console.log('No command executed');
                break;
        }
    }
});