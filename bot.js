var fs = require('fs');
var http = require('http');
var https = require('https');
var dns = require('dns');
var Discord = require('discord.io');
var PlexAPI = require('plex-api');
var logger = require('winston');
var config = require('./config.js');

/*TODO
0. Add functionality to search by genre (ex: horror, thriller) or year (1990, 1991)
1. Make search work just for films (f), shows (s), or albums (a)
2. Return "no results found idiot"
4. Investigate making search results Plex links
5. Ombi integration for requests
6. Check drobo disk space (http://drobo-utils.sourceforge.net/ ?)
7. Pull images/memes from playlist or Imgur
8. Minigame (lolis)
9. Bot joins audio and plays Rick clips or YouTube clips
10. Build up a to-do list of things to watch or do - Set up Mongo
11. madamada voice chat when someone enters
deldbucks (schrutebucks)

!search weaboo movies
!search suicide
!search sudoku seppuku
*/

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
                    message: 'Valid commands: !help, !serverstatus, !search, !playlist, !schwifty, !releasedate, !8ball'
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
                var noResults = true;

                if (args.length == 0) {
                    bot.sendMessage({
                        to: channelID,
                        message: "No search term specified, please use: !search <query> to search for albums, movies, and shows on the Plex server"
                    });
                    break;
                } else {
                    for (var i = 0; i < args.length; i++) {
                      query += args[i] + " ";
                    }
                    console.log("Query: " + query);
                }

                if (query === "derek's book" || query === "Derek's book") {
                     bot.sendMessage({
                        to: userID,
                        message: "Fuck you"
                    });
                    console.log('Command executed: search');
                    break;
                }

                // List of query types: https://github.com/Arcanemagus/plex-api/wiki/MediaTypes
                // 1 - movie, 2 - show, 3 - season, 4 - episode, 5 - trailer, 6 - comic, 7 - person, 8 - artist,
                // 9 - album, 10 - track, 11 - photo album, 12 - picture, 13 - photo, 14 - clip, 15 - playlist

                //https://blog.cloudboost.io/execute-asynchronous-tasks-in-series-942b74697f9c?gi=28073aa910e6
                //https://stackoverflow.com/questions/5010288/how-to-make-a-function-wait-until-a-callback-has-been-called-using-node-js

                /*
                plex.query('/library/sections/3/all?genre=' + query).then(function(res) {
                    console.log(query);
                    var results = res.MediaContainer.Metadata;
                    var resultSize = res.MediaContainer.size;
                    var searchOutput = "";

                    console.log(res);

                    if (resultSize >= 1) {
                        searchOutput += "Films:" + "\n"
                        for (var i = 0; i < resultSize; i++) {
                            console.log(results[i]);
                            searchOutput += results[i].title + "\n";
                            console.log(results[i].Genre);
                            console.log(results[i].Genre.length);
                            for (var j = 0; j < results[i].Genre.length; j++) {
                                if (results[i].Genre[j].tag)
                                console.log(results[i].Genre[j].tag);
                            }
                        }
                        searchOutput += "\u200b";
                        if (noResults) {
                            noResults = false;
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
                */

                /*var film = {
                    'title': results[i].title,
                    'url': 'https://app.plex.tv/desktop#!/server/dac55db844ca7b42e719206517f3623ced586cad/details?key=%2Flibrary%2Fmetadata%2F'
                        + results[i].ratingKey + '&context=library%3Acontent.library',
                    'color': 15048717,
                    'footer': {
                        'icon_url': 'https://dl2.macupdate.com/images/icons256/42311.png',
                        'text': 'Plex'
                    }
                    //'thumbnail': {
                    //      url: 'https://app.plex.tv/desktop#!/server/dac55db844ca7b42e719206517f3623ced586cad/
                };
                bot.sendMessage({
                    to: channelID,
                    embed: film
                });*/

                // TODO: Restructure with callbacks
                // Search movies
                plex.query("/search/?type=1&query=" + query).then(function(res) {
                    var results = res.MediaContainer.Metadata;
                    var resultSize = res.MediaContainer.size;
                    var searchOutput = "";

                    /*bot.sendMessage({
                        to: channelID,
                        message: "Films:\n"
                    });*/

                    if (resultSize >= 1) {
                        searchOutput += "Films:" + "\n"
                        for (var i = 0; i < resultSize; i++) {
                            //console.log(results[i]);
                            searchOutput += results[i].title + "\n";
                            //console.log(results[i].Genre);
                            //console.log(results[i].Genre.length);
                            //for (var j = 0; j < results[i].Genre.length; j++) {
                                //if (results[i].Genre[j].tag) {
                                //    console.log(results[i].Genre[j].tag);
                                //}
                            //}
                        }
                        searchOutput += "\u200b";
                        if (noResults) {
                            noResults = false;
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
                plex.query("/search/?type=2&query=" + query).then(function(res) {
                    var results = res.MediaContainer.Metadata;
                    var resultSize = res.MediaContainer.size;
                    var searchOutput = "";

                    if (resultSize >= 1) {
                        searchOutput += "Shows:" + "\n"
                        for (var i = 0; i < resultSize; i++) {
                            //console.log(results[i]);
                            searchOutput += results[i].title + "\n";
                        }
                        searchOutput += "\u200b";
                        if (noResults) {
                            noResults = false;
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
                plex.query("/search/?type=9&query=" + query).then(function(res) {
                    var results = res.MediaContainer.Metadata;
                    var resultSize = res.MediaContainer.size;
                    var searchOutput = "";

                    /*bot.sendMessage({
                        to: channelID,
                        message: "Albums:\n"
                    });*/

                    if (resultSize >= 1) {
                        searchOutput += "Albums:" + "\n"
                        for (var i = 0; i < resultSize; i++) {
                            //console.log(results[i]);
                            searchOutput += results[i].title + "\n";
                        }
                        searchOutput += "\u200b";
                        if (noResults) {
                            noResults = false;
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
            // Genre search
            //case 'searchgenre':
            //plex.query("/library/sections/3/all").then(function (result) {
            //console.log( result.MediaContainer );
            //const {
            //    Metadata
            //        } = result.MediaContainer;
            // Return release date of film
            //break;
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
                console.log('Command executed: schwifty');
                break;
            // Check OMDb for film and show information
            case 'releasedate': 
                var query = '';
                var year = '';
                var useYear = false;
                for (var i = 0; i < args.length; i++) {
                    // If the search has more than one term and the last argument is numeric, assume it is the year
                    var argInt = parseInt(args[i], 10);
                    if ((i + 1) == args.length && args.length > 1 && !isNaN(argInt) && argInt > 1888) {
                        year = args[i];
                        useYear = true;
                    } else {
                        query += args[i] + "+";
                    }
                }
                // Remove the last + from the query
                query = query.substring(0, query.length - 1);
                console.log("Query: " + query);

                if (query == '') {
                    bot.sendMessage({
                        to: channelID,
                        message: "Supply a movie or show name idiot"
                    });
                    console.log('Command executed: releasedate');
                    break;
                }

                if (!useYear) {
                    http.get('http://www.omdbapi.com/?apikey=' + config.omdbKey + '&t=' + query, (resp) => {
                        let data = '';
                        var movieData = '';
                        var searchOutput = '';

                        resp.on('data', (chunk) => {
                            data += chunk;
                        });

                        resp.on('end', () => {
                            movieData = JSON.parse(data);
                            console.log(movieData);

                            if (movieData.Response == "False") {
                                bot.sendMessage({
                                    to: channelID,
                                    message: "No movie or show found, please refine your search and consider including a year"
                                });
                            } else{
                                bot.sendMessage({
                                    to: channelID,
                                    message: movieData.Title + " (" + movieData.Year + "): " + movieData.Released
                                });
                            }
                            console.log('Command executed: releasedate');
                        });

                    }).on("error", (err) => {
                        console.log("Error: " + err.message);
                        console.log('Command executed: releasedate');
                    });
                } else {
                    http.get('http://www.omdbapi.com/?apikey=' + config.omdbKey + '&t=' + query + '&y=' + year, (resp) => {
                        let data = '';
                        var movieData = '';
                        var searchOutput = '';

                        resp.on('data', (chunk) => {
                            data += chunk;
                        });

                        resp.on('end', () => {
                            movieData = JSON.parse(data);
                            console.log(movieData);

                            if (movieData.Response == "False") {
                                bot.sendMessage({
                                    to: channelID,
                                    message: "No movie or show found, please refine your search and consider including a year"
                                });
                            } else{
                                bot.sendMessage({
                                    to: channelID,
                                    message: movieData.Title + " (" + movieData.Year + "): " + movieData.Released
                                });
                            }
                            console.log('Command executed: releasedate');
                        });

                    }).on("error", (err) => {
                        console.log("Error: " + err.message);
                        console.log('Command executed: releasedate');
                    });
                }
                break;
            case 'omdbsearch':
                //first 10 - page 1, 11-20 page 2, 21-30 page 3
                //pagination - &page=2 //star trek - 29 pages
                var query = '';
                for (var i = 0; i < args.length; i++) {
                  query += args[i] + "+";
                }
                // Remove the last + from the query
                query = query.substring(0, query.length - 1);
                console.log("Query: " + query);

                http.get('http://www.omdbapi.com/?apikey=' + config.omdbKey + '&s=' + query, (resp) => {
                    let data = '';
                    var movieData = '';
                    var searchOutput = '';

                    resp.on('data', (chunk) => {
                        data += chunk;
                    });

                    resp.on('end', () => {
                        movieData = JSON.parse(data);
                        console.log(movieData);
                        console.log(movieData.totalResults);

                        var totalResults = 0;
                        var page = 1;

                        searchOutput += "Films and Shows:" + "\n"
                        do {
                            for (var i = 0; i < movieData.Search.length; i++) {
                                //console.log(results[i]);
                                searchOutput += movieData.Search[i].Title + " (" + movieData.Search[i].Year + ")\n";
                            }
                            totalResults += movieData.Search.length;
                            //http.get('http://www.omdbapi.com/?apikey=' + config.omdbKey + '&s=' + query, (resp) => {
                            //resp.on('data', (chunk) => {
                            //    data += chunk;
                            //});
                            //resp.on('end', () => {
                            //    movieData = JSON.parse(data);
                            //    console.log(movieData);
                            //}
                        } while (totalResults < movieData.totalResults)
                        searchOutput += "\u200b";
                        /*if (noResults) {
                            noResults = false;
                        }*/

                        bot.sendMessage({
                            to: channelID,
                            message: searchOutput
                        });
                        console.log('Command executed: omdbsearch');
                    });

                }).on("error", (err) => {
                    console.log("Error: " + err.message);
                    console.log('Command executed: omdbsearch');
                });
                break;
            case '8ball':
                if (args.length == 0) {
                    bot.sendMessage({
                        to: channelID,
                        message: "Ask a question moron"
                    });
                    break;
                }
                var magicResults = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes - definitely.', 'You may rely on it.',
                    'As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.', 
                    'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.','Concentrate and ask again.',
                    'Don\'t count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.'];
                var magicResult = magicResults[Math.floor(Math.random() * magicResults.length)];
                bot.sendMessage({
                    to: channelID,
                    message: magicResult
                });
                console.log('Command executed: 8ball');
                break;
            /*case 'oracle':
                var divineResults = ['It is certain.', 'It is decidedly so.', 'Without a doubt.', 'Yes - definitely.', 'You may rely on it.',
                    'As I see it, yes.', 'Most likely.', 'Outlook good.', 'Yes.', 'Signs point to yes.', 
                    'Reply hazy, try again.', 'Ask again later.', 'Better not tell you now.', 'Cannot predict now.','Concentrate and ask again.',
                    'Don\'t count on it.', 'My reply is no.', 'My sources say no.', 'Outlook not so good.', 'Very doubtful.'];
                var divineResult = divineResults[Math.floor(Math.random() * divineResults.length)];
                bot.sendMessage({
                    to: channelID,
                    message: divineResult
                });
                console.log('Command executed: magic');
                break;*/
            // Request
            /*case 'request':
                function requestMovie(ombi, msg, movieMsg, movie) {
                    if ((!ombi.requestmovie || msg.member.roles.some(role => role.name === ombi.requestmovie)) && (!movie.available && !movie.requested && !movie.approved)) {
                        msg.reply('If you want to request this movie please click on the ⬇ reaction.');
                        movieMsg.react('⬇');
                        
                        movieMsg.awaitReactions((reaction, user) => reaction.emoji.name === '⬇' && user.id === msg.author.id, { max: 1, time: 120000 })
                        .then(collected => {
                            if (collected.first()) {
                                post({
                                    headers: {'accept' : 'application/json',
                                    'Content-Type' : 'application/json',
                                    'ApiKey': ombi.apikey,
                                    'ApiAlias' : `${msg.author.username}#${msg.author.discriminator}`,
                                    'UserName' : ombi.username ? ombi.username : undefined,
                                    'User-Agent': `Mellow/${process.env.npm_package_version}`},
                                    url: (checkURLPrefix(ombi.host) ? ombi.host : `http://${ombi.host}`) + ((ombi.port) ? ':' + ombi.port : '') + '/api/v1/Request/movie/',
                                    body: JSON.stringify({ "theMovieDbId": movie.theMovieDbId })
                                }).then((resolve) => {
                                    return msg.reply(`Requested ${movie.title} in Ombi.`);
                                }).catch((error) => {
                                    console.error(error);
                                    return msg.reply('There was an error in your request.');
                                });
                            }
                        }).catch(collected => {
                            return movieMsg;
                        });
                    }
                    return movieMsg;
                }
                break;*/
            // Default response
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