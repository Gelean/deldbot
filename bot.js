const fs = require("fs");
const http = require("http");
const https = require("https");
const Discord = require("discord.io");
const PlexAPI = require("plex-api");
const logger = require("winston");
const config = require("./config.js");
const hltb = require("howlongtobeat");

function sendChannelMessage(channelID, text, method) {
    bot.sendMessage({
        to: channelID,
        message: text
    });
    console.log("Command executed: " + method);
}

function sendUserMessage(userID, text, method) {
    bot.sendMessage({
        to: userID,
        message: text
    });
    console.log("Command executed: " + method);
}

function totalPages(number) {
    return Math.ceil(number / 10);
}

// Initialize Discord Bot
var bot = new Discord.Client({
   token: config.botToken,
   autorun: true
});

// Initialize Plex
var plex = new PlexAPI({
    hostname: config.plexHostname,
    port: config.plexPort,
    username: config.plexUsername,
    password: config.plexPassword,
    token: config.plexToken
});

// Initialize Imgur Options
var imgurOptions = {
    hostname: "api.imgur.com",
    path: "/3/album/" + config.imgurAlbum,
    headers: {"Authorization": "Client-ID " + config.imgurClientId},
    method: "GET"
};

// Check Plex Server Information
plex.query("/").then(function (result) {
    console.log("Sever: %s" + "\n" + "Plex Version: %s",
        result.MediaContainer.friendlyName,
        result.MediaContainer.version);
}, function (err) {
    console.error("The Plex server appears to be down, go yell at Josh", err);
});
//console.log(plex);

// Initialize HLTB Service
var hltbService = new hltb.HowLongToBeatService();

// Ready the bot
bot.on("ready", function (evt) {
    console.log("Bot has connected");
    console.log("Name: " + bot.username + "\n" + "ID: " + bot.id);
});

// Message handling
bot.on("message", function (user, userID, channelID, message, evt) {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (message.substring(0, 1) == "!") {
        var args = message.substring(1).split(" ");
        var cmd = args[0];
        args = args.splice(1);
        
        switch(cmd) {
            // Report valid commands
            case "help":
                sendChannelMessage(channelID, "Valid commands: !help, !usage, !serverstatus, !search, !playlist, !schwifty, " +
                    "!imgur, !soitbegins, !releasedate, !omdbsearch, !hltb, !howlongtobeat, !8ball, !uptime", "help");
                break;
            // Give usage information for a given command
            case "usage":
                var noResults = false;
                var usageString = "";

                if (args[0] == "help") {
                    usageString = "Good lord, the help command should be self explanatory";
                } else if (args[0] == "usage") {
                    usageString = "Trying to get meta are you?";
                } else if (args[0] == "serverstatus") {
                    usageString  = "Description: Returns the status of the Plex server (up or down)";
                    usageString += "\nUsage: !serverstatus";
                } else if (args[0] == "search") {
                    usageString  = "Description: Searches the Plex server for the given query and reports matching films, shows, or albums";
                    usageString += "\nUsage: !search <query>";
                } else if (args[0] == "playlist") {
                    var data = fs.readFileSync("playlist.txt", {"encoding": "utf8"});
                    var entries = data.toString().split("\n");
                    var numEntries = parseInt(entries.length);
                    usageString  = "Description: Returns a random youtube video from the SoL YouTube playlist. May specify an index from 0 to " + (numEntries - 1) + " for a specific video.";
                    usageString += "\nUsage: !playlist [index]";
                } else if (args[0] == "schwifty") {
                    usageString  = "Description: Get Schwifty";
                    usageString += "\nUsage: !schwifty";
                } else if (args[0] == "imgur") {
                    usageString  = "Description: Returns a random image from the SoL Imgur album. May specify an index for a specific image."
                    usageString += "\nUsage: !imgur [index]";
                } else if (args[0] == "soitbegins") {
                    usageString  = "Description: So it begins";
                    usageString += "\nUsage: !soitbegins";
                } else if (args[0] == "releasedate") {
                    usageString  = "Description: Checks the release date for a film or show. OMDb only returns one result for a given query, so refine it and optionally "
                        + "specify a year to increase the likelihood of finding the media you want.";
                    usageString += "\nUsage: !releasedate <query> [year]";
                } else if (args[0] == "omdbsearch") {
                    usageString  = "Description: Searches OMDb for the given query and reports matching films, shows, or albums. Returns ten results at a time so you "
                        + "may optionally pass in a page index to filter through the results";
                    usageString += "\nUsage: !omdbsearch [p1-100] <query>";
                } else if (args[0] == "howlongtobeat") {
                    usageString  = "Description: Searches HowLongToBeat for the average completion time for games";
                    usageString += "\nUsage: !howlongtobeat <query>";
                } else if (args[0] == "8ball") {
                    usageString  = "Description: What does the Magic 8 Ball say?";
                    usageString += "\nUsage: !8ball <question>";
                } else if (args[0] == "uptime") {
                    usageString  = "Description: Reports how long " + bot.username + " has been online";
                    usageString += "\nUsage: !uptime";
                } else {
                    noResults = true;
                }

                if (noResults) {
                    sendChannelMessage(channelID, "Please supply a command you wish to learn more about, for example !usage search", "usage");
                } else {
                    sendChannelMessage(channelID, usageString, "usage");
                }
                break;
            // Check the Plex server status and report back if it"s running
            case "serverstatus":
                plex.query("/").then(function (result) {
                    sendChannelMessage(channelID, "The Plex server appears to be up", "serverstatus");
                }, function (err) {
                    sendChannelMessage(channelID, "The Plex server appears to be down, go yell at Josh", "serverstatus");
                });
                break;
            // Check if a given piece of media (film, show, anime, or album) exists on the Plex server
            case "search":
                var query = "";
                var searchOutput = '';
                var noResults = true;

                if (args.length == 0) {
                    sendChannelMessage(channelID, "No search term specified, please use: !search <query> to search for movies, "
                        + "shows, and albums on the Plex server", "search");
                    break;
                } else {
                    query = args.join(' ');
                    console.log("Query: " + query);
                }

                if (query.toLowerCase() === "derek's book") {
                    sendUserMessage(userID, "Go fuck yourself", "search");
                    break;
                }

                (async() => {

                    // List of query types: https://github.com/Arcanemagus/plex-api/wiki/MediaTypes

                    const filmResponse = plex.query("/search/?type=1&query=" + query);
                    const filmResults = await filmResponse;

                    if (filmResults.MediaContainer.size >= 1) {
                        searchOutput += "Films:";
                        for (var i = 0; i < filmResults.MediaContainer.size; i++) {
                            //console.log(filmResults.MediaContainer.Metadata[i]);
                            searchOutput += "\n" + filmResults.MediaContainer.Metadata[i].title;
                        }
                        noResults = false;
                    }

                    const showResponse = plex.query("/search/?type=2&query=" + query);
                    const showResults = await showResponse;

                    if (showResults.MediaContainer.size >= 1) {
                        searchOutput += "\nShows:";
                        for (var i = 0; i < showResults.MediaContainer.size; i++) {
                            //console.log(showResults.MediaContainer.Metadata[i]);
                            searchOutput += "\n" + showResults.MediaContainer.Metadata[i].title;
                        }
                        noResults = false;
                    }

                    const albumResponse = plex.query("/search/?type=9&query=" + query);
                    const albumResults = await albumResponse;

                    if (albumResults.MediaContainer.size >= 1) {
                        searchOutput += "\nAlbums:";
                        for (var i = 0; i < albumResults.MediaContainer.size; i++) {
                            //console.log(albumResults.MediaContainer.Metadata[i]);
                            searchOutput += "\n" + albumResults.MediaContainer.Metadata[i].title;
                        }
                        noResults = false;
                    }

                    if (noResults) {
                        sendChannelMessage(channelID, "No results found, please refine your search dimwit", "search");
                    } else {
                        sendChannelMessage(channelID, searchOutput, "search");
                    }

                })();
                break;
            // Return the top result in an embed with a Plex link
            case "embedsearch":
                var query = "";
                var searchOutput = '';
                var noResults = true;

                if (args.length == 0) {
                    sendChannelMessage(channelID, "No search term specified, please use: !embedsearch <query> to search for albums, "
                        + "movies, and shows on the Plex server", "embedsearch");
                    break;
                } else {
                    query = args.join(' ');
                    console.log("Query: " + query);
                }

                if (query.toLowerCase() === "derek's book") {
                    sendUserMessage(userID, "Go fuck yourself", "embedsearch");
                    break;
                }

                (async() => {

                    const filmResponse = plex.query("/search/?type=1&query=" + query);
                    const filmResults = await filmResponse;

                    if (filmResults.MediaContainer.size >= 1) {
                        const botMessage = bot.sendMessage({
                            to: channelID,
                            message: "Films:"
                        });
                        const botResultsMessage = await botMessage;
                        for (var i = 0; i < filmResults.MediaContainer.size; i++) {

                            // Investigate making search results Plex links using embeds
                            var film = {
                                "title": filmResults.MediaContainer.Metadata[i].title,
                                "url": "https://app.plex.tv/desktop#!/server/" + config.plexId + "/details?key=%2Flibrary%2Fmetadata%2F"
                                    + filmResults.MediaContainer.Metadata[i].ratingKey + "&context=library%3Acontent.library",
                                "color": 15048717,
                                "footer": {
                                    "icon_url": "https://dl2.macupdate.com/images/icons256/42311.png",
                                    "text": "Plex"
                                }
                                //"thumbnail": {
                                //      url: "https://app.plex.tv/desktop#!/server/id/
                                //}
                            };
                            bot.sendMessage({
                                to: channelID,
                                embed: film
                            });
                        }
                        noResults = false;
                    }

                    const showResponse = plex.query("/search/?type=2&query=" + query);
                    const showResults = await showResponse;

                    if (showResults.MediaContainer.size >= 1) {
                        const botMessage = bot.sendMessage({
                            to: channelID,
                            message: "Shows:"
                        });
                        //const botResultsMessage = await botMessage;
                        for (var i = 0; i < showResults.MediaContainer.size; i++) {
                            var show = {
                                "title": showResults.MediaContainer.Metadata[i].title,
                                "url": "https://app.plex.tv/desktop#!/server/" + config.plexId + "/details?key=%2Flibrary%2Fmetadata%2F"
                                    + showResults.MediaContainer.Metadata[i].ratingKey + "&context=library%3Acontent.library",
                                "color": 15048717,
                                "footer": {
                                    "icon_url": "https://dl2.macupdate.com/images/icons256/42311.png",
                                    "text": "Plex"
                                }
                            };
                            const botResultsMessage = await botMessage;
                            bot.sendMessage({
                                to: channelID,
                                embed: show
                            });
                        }
                        noResults = false;
                    }

                    const albumResponse = plex.query("/search/?type=9&query=" + query);
                    const albumResults = await albumResponse;

                    if (albumResults.MediaContainer.size >= 1) {
                        const botMessage = bot.sendMessage({
                            to: channelID,
                            message: "Albums:"
                        });
                        //const botResultsMessage = await botMessage;
                        for (var i = 0; i < albumResults.MediaContainer.size; i++) {
                            var album = {
                                "title": albumResults.MediaContainer.Metadata[i].title,
                                "url": "https://app.plex.tv/desktop#!/server/" + config.plexId + "/details?key=%2Flibrary%2Fmetadata%2F"
                                    + albumResults.MediaContainer.Metadata[i].ratingKey + "&context=library%3Acontent.library",
                                "color": 15048717,
                                "footer": {
                                    "icon_url": "https://dl2.macupdate.com/images/icons256/42311.png",
                                    "text": "Plex"
                                }
                            };
                            const botResultsMessage = await botMessage;
                            bot.sendMessage({
                                to: channelID,
                                embed: album
                            });
                        }
                        noResults = false;
                    }

                    if (noResults) {
                        sendChannelMessage(channelID, "No results found, please refine your search dimwit", "embedsearch");
                    } else {
                        console.log("Command executed: embedsearch");
                    }

                })();
                break;
            // Pull a Youtube link from a seed file (random video or index)
            case "playlist":
                var youtubeLink = "";
                if (args == "") {
                    fs.readFile("playlist.txt", {"encoding": "utf8"},  function(err, data) {
                        if (err) {
                            sendChannelMessage(channelID, "An error has occurred, go yell at Derek", "playlist");
                        } else {
                            var lines = data.toString().split("\n");
                            youtubeLink = lines[Math.floor(Math.random() * lines.length)];
                            sendChannelMessage(channelID, youtubeLink, "playlist");
                        }
                    });
                } else {
                    if (args.length > 1) {
                        sendChannelMessage(channelID, "Please specify a single index idiot", "playlist (index)");
                        return;
                    }

                    var argInt = parseInt(args[0], 10);
                    if (typeof argInt != "number" || isNaN(argInt)) {
                        sendChannelMessage(channelID, "Please specify a number idiot", "playlist (index)");
                        return;
                    }

                    fs.readFile("playlist.txt", {"encoding": "utf8"},  function(err, data) {
                        if (err) {
                            sendChannelMessage(channelID, "An error has occurred, go yell at Derek", "playlist (index)");
                        } else {
                            var lines = data.toString().split("\n");
                            if (args >= lines.length) {
                                sendChannelMessage(channelID, "The index specified is larger than the number of items in the playlist idiot", "playlist (index)");
                            } else {
                                youtubeLink = lines[args];
                                sendChannelMessage(channelID, youtubeLink, "playlist (index)");
                            }
                        }
                    });
                }
                break;
            // Return Get Schwifty (Andromulus Remix)
            case "schwifty":
                sendChannelMessage(channelID, "https://www.youtube.com/watch?v=m3RUYMGD9-o", "schwifty");
                break;
            // Pull an Imgur link from an album (random image or index)
            case "imgur":
                https.get(imgurOptions, (resp) => {
                    let data = "";
                    console.log("statusCode:", resp.statusCode);
                    console.log("headers:", resp.headers);

                    resp.on("data", (chunk) => {
                        data += chunk;
                    });

                    resp.on("end", () => {
                        imgurData = JSON.parse(data);
                        console.log(imgurData.data.link);
                        console.log(imgurData.data.images);

                        if (args == "") {
                            var randomIndex = Math.floor(Math.random() * imgurData.data.images.length);
                            console.log(randomIndex);
                            sendChannelMessage(channelID, imgurData.data.images[randomIndex].link, "imgur");
                        } else {
                            if (args.length > 1) {
                                sendChannelMessage(channelID, "Please specify a single index idiot", "imgur (index)");
                                return;
                            }

                            var argInt = parseInt(args[0], 10);
                            if (typeof argInt != "number" || isNaN(argInt)) {
                                sendChannelMessage(channelID, "Please specify a number idiot", "imgur (index)");
                                return;
                            }

                            if (args >= imgurData.data.images.length) {
                                sendChannelMessage(channelID, "The index specified is larger than the number of items in the album idiot", "playlist (index)");
                            } else {
                                sendChannelMessage(channelID, imgurData.data.images[argInt].link, "imgur (index)");
                            }
                        }
                    });
                }).on("error", (err) => {
                    console.error(e);
                    sendChannelMessage(channelID, "An error has occurred, go yell at Derek", "imgur");
                });
                break;
            // Revamp: memes <meme name> or <id>
            // Return So it begins GIF
            case "soitbegins":
                sendChannelMessage(channelID, "https://imgur.com/owtlQgV", "soitbegins");
                break;
            // Check OMDb for film and show release date information
            case "releasedate": 
                var query = "";
                var year = "";
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

                if (query == "") {
                    sendChannelMessage(channelID, "Supply a movie or show name idiot", "releasedate");
                    break;
                }

                if (!useYear) {
                    http.get("http://www.omdbapi.com/?apikey=" + config.omdbKey + "&t=" + query, (resp) => {
                        let data = "";
                        var movieData = "";
                        var searchOutput = "";

                        resp.on("data", (chunk) => {
                            data += chunk;
                        });

                        resp.on("end", () => {
                            movieData = JSON.parse(data);
                            console.log(movieData);

                            if (movieData.Response == "False") {
                                sendChannelMessage(channelID, "No movie or show found, please refine your search and consider including a year dimwit", "releasedate");
                            } else{
                                sendChannelMessage(channelID, movieData.Title + " (" + movieData.Year + "): " + movieData.Released, "releasedate");
                            }
                        });

                    }).on("error", (err) => {
                        sendChannelMessage(channelID, "An error has occurred, go yell at Derek", "releasedate");
                    });
                } else {
                    http.get("http://www.omdbapi.com/?apikey=" + config.omdbKey + "&t=" + query + "&y=" + year, (resp) => {
                        let data = "";
                        var movieData = "";
                        var searchOutput = "";

                        resp.on("data", (chunk) => {
                            data += chunk;
                        });

                        resp.on("end", () => {
                            movieData = JSON.parse(data);
                            console.log(movieData);

                            if (movieData.Response == "False") {
                                sendChannelMessage(channelID, "No movie or show found, please refine your search and consider " +
                                    "including a year dimwit", "releasedate (year)");
                            } else{
                                sendChannelMessage(channelID, movieData.Title + " (" + movieData.Year + "): " + movieData.Released, "releasedate (year)");
                            }
                        });

                    }).on("error", (err) => {
                        sendChannelMessage(channelID, "An error has occurred, go yell at Derek", "releasedate (year)");
                    });
                }
                break;
            // Check OMDb for film and show information
            case "omdbsearch":
                var query = "";
                var page = "";
                var usePagination = false;
                for (var i = 0; i < args.length; i++) {
                    if (i == 0 && args[0].includes("p")) {
                        usePagination = true;
                        var fields = args[0].split("p");
                        page = fields[1];
                        console.log(page);
                    } else {
                        query += args[i] + "+";
                    }
                }
                // Remove the last + from the query
                query = query.substring(0, query.length - 1);
                console.log("Query: " + query);

                if (usePagination) {
                    var omdbQuery = "http://www.omdbapi.com/?apikey=" + config.omdbKey + "&s=" + query + "&page=" + page;
                } else {
                    var omdbQuery = "http://www.omdbapi.com/?apikey=" + config.omdbKey + "&s=" + query;
                }

                http.get(omdbQuery, (resp) => {
                    let data = "";
                    var movieData = "";
                    var searchOutput = "";

                    resp.on("data", (chunk) => {
                        data += chunk;
                    });

                    resp.on("end", () => {
                        movieData = JSON.parse(data);
                        console.log(movieData);

                        if (movieData.Response == "False") {
                            sendChannelMessage(channelID, "No movie or show found, please refine your search and consider including a year dimwit", "omdbsearch");
                        } else {
                            searchOutput += "Films and Shows:" + "\n"

                            for (var i = 0; i < movieData.Search.length; i++) {
                                //console.log(movieData.Search[i]);
                                searchOutput += movieData.Search[i].Title + " (" + movieData.Search[i].Year + ")\n";
                            }
                            searchOutput += "Total Results: " + movieData.totalResults + " (" + totalPages(movieData.totalResults) + " pages)";
                            sendChannelMessage(channelID, searchOutput, "omdbsearch");
                        }
                    });
                }).on("error", (err) => {
                    sendChannelMessage(channelID, "An error has occurred, go yell at Derek", "omdbsearch");
                });
                break;
            // Check HowLongToBeat for game completion times
            case "hltb":
            case "howlongtobeat":
                var query = "";
                var hltbOutput = '';
                var noResults = true;

                if (args.length == 0) {
                    sendChannelMessage(channelID, "No game specified, please use: !howlongtobeat <query> to search for the average completion time for games", "howlongtobeat");
                    break;
                } else {
                    query = args.join(' ');
                    console.log("Query: " + query);
                }

                (async() => {
                    const hltbResponse = hltbService.search(query);
                    const hltbResults = await hltbResponse;
                    //console.log(hltbResults);

                    if (hltbResults.length >= 1) {
                        hltbOutput += "Games and Completion Times (Main Story, Main + Extra, Completionist):";
                        for (var i = 0; i < hltbResults.length; i++) {
                            hltbOutput += "\n" + hltbResults[i].name + " (" + hltbResults[i].gameplayMain + "h, " + 
                                hltbResults[i].gameplayMainExtra + "h, " + hltbResults[i].gameplayCompletionist + "h)";
                        }
                        noResults = false;
                    }

                    if (noResults) {
                        sendChannelMessage(channelID, "No results found, please refine your search dimwit", "howlongtobeat");
                    } else {
                        sendChannelMessage(channelID, hltbOutput, "howlongtobeat");
                    }
                })();
                break;
            // The Magic 8-Ball
            case "8ball":
                if (args.length == 0) {
                    sendChannelMessage(channelID, "Ask a question moron", "8ball");
                    break;
                }
                var magicResults = ["It is certain.", "It is decidedly so.", "Without a doubt.", "Yes - definitely.", "You may rely on it.",
                    "As I see it, yes.", "Most likely.", "Outlook good.", "Yes.", "Signs point to yes.", 
                    "Reply hazy, try again.", "Ask again later.", "Better not tell you now.", "Cannot predict now.","Concentrate and ask again.",
                    "Don\"t count on it.", "My reply is no.", "My sources say no.", "Outlook not so good.", "Very doubtful."];
                var magicResult = magicResults[Math.floor(Math.random() * magicResults.length)];
                sendChannelMessage(channelID, magicResult, "8ball");
                break;
            // Bot uptime
            case "uptime":
                if (bot.presence.status == "online") {
                    var date = new Date();
                    var timeInMilliseconds = date.getTime();
                    var totalSeconds = (timeInMilliseconds - bot.presence.since) / 1000;

                    var days = Math.floor(totalSeconds / 86400);
                    totalSeconds -= days * 86400;
                    var hours = Math.floor(totalSeconds / 3600);
                    totalSeconds -= hours * 3600;
                    var minutes = Math.floor(totalSeconds / 60);
                    totalSeconds -= minutes * 60;
                    var seconds = Math.floor(totalSeconds)
                    
                    sendChannelMessage(channelID, bot.username + " has been online for " + days + " day(s), " + hours + " hour(s), " + minutes + " minute(s), " + seconds + " second(s)", "uptime");
                } else {
                    sendChannelMessage(channelID, bot.username + " is currently offline", "uptime");
                }
                break;
            // Default response
            default:
                sendChannelMessage(channelID, "Type !help for commands", "default");
                break;
        }
    }
});