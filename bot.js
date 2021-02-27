const fs = require("fs");
const http = require("http");
const https = require("https");
const logger = require("winston");
const Discord = require("discord.io");
const DiscordJs = require("discord.js");
const PlexAPI = require("plex-api");
const hltb = require("howlongtobeat");
const itad = require("itad-api-client-ts");
const { YouTube } = require('popyt')
//const igdb = require("igdb-api-node");
const config = require("./config.js");
const package = require('./package.json');

// Helper Functions
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

function sendEmbedMessage(channelID, embed, method) {
    bot.sendMessage({
        to: channelID,
        embed: embed
    });
    console.log("Command executed: " + method);
}

// Initialize Plex
var plex = new PlexAPI({
    hostname: config.plexHostname,
    port: config.plexPort,
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
    console.error("The Plex server appears to be down", err);
});
//console.log(plex);

// Initialize HLTB Service
var hltbService = new hltb.HowLongToBeatService();

// Initialize ITAD Service
var itadApi = new itad.IsThereAnyDealApi(config.itadKey);

// Initialize Popyt Youtube API
var youtube = new YouTube(config.youtubeKey)

// Initialize IGDB Service
//var igdbApi = new igdb.igdb(config.igdbKey);

// Initialize Discord Bot
var bot = new Discord.Client({
   token: config.botToken,
   autorun: true
});

bot.on("ready", function (evt) {
    console.log("Bot has connected");
    console.log("Name: " + bot.username + "\n" + "ID: " + bot.id);
});

// Message handling
bot.on("message", function (user, userID, channelID, message, evt) {
    // The bot needs to know if it will execute a command
    // It will listen for messages that start with `!`
    if (message.substring(0, 1) == "!") {
        var args = message.substring(1).split(" ");
        var cmd = args[0];
        args = args.splice(1);
        
        switch(cmd.toLowerCase()) {
            // Report valid commands
            case "help":
                sendChannelMessage(channelID, "Valid commands: !help, !usage, !serverstatus, !discordstatus, !search, !playlist, !youtubesearch," +
                    "!schwifty, !imgur, !soitbegins, !godwillsit, !absenceofgod, !dealwithit, !releasedate, !omdbsearch, !hltb, !howlongtobeat, " +
                    "!itad, !isthereanydeal, !8ball, !destroy, !uptime, !repo, !version", "help");
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
                } else if (args[0] == "discordstatus") {
                    usageString  = "Description: Returns the status of the Discord service";
                    usageString += "\nUsage: !discordstatus";
                } else if (args[0] == "search") {
                    usageString  = "Description: Searches the Plex server for the given query and reports matching films, shows, or albums";
                    usageString += "\nUsage: !search <query>";
                } else if (args[0] == "playlist") {
                    usageString  = "Description: Returns a random youtube video from the SoL YouTube playlist. Or you may specify an index for a specific video.";
                    usageString += "\nUsage: !playlist [index]";
                } else if (args[0] == "youtubesearch") {
                    usageString  = "Description: Searches Youtube for the given query and returns the first result";
                    usageString += "\nUsage: !youtubesearch <query>";
                } else if (args[0] == "schwifty") {
                    usageString  = "Description: Get Schwifty";
                    usageString += "\nUsage: !schwifty";
                } else if (args[0] == "imgur") {
                    usageString  = "Description: Returns a random image from the SoL Imgur album. May specify an index for a specific image."
                    usageString += "\nUsage: !imgur [index]";
                } else if (args[0] == "soitbegins") {
                    usageString  = "Description: So it begins";
                    usageString += "\nUsage: !soitbegins";
                } else if (args[0] == "godwillsit") {
                    usageString  = "Description: God wills it!";
                    usageString += "\nUsage: !godwillsit";
                } else if (args[0] == "absenceofgod") {
                    usageString  = "Description: Absence of God";
                    usageString += "\nUsage: !absenceofgod";
                } else if (args[0] == "dealwithit") {
                    usageString  = "Description: Deal With It";
                    usageString += "\nUsage: !dealwithit";
                } else if (args[0] == "releasedate") {
                    usageString  = "Description: Checks the release date for a film or show. OMDb only returns one result for a given query, so refine it and optionally "
                        + "specify a year to increase the likelihood of finding the media you want.";
                    usageString += "\nUsage: !releasedate <query> [year]";
                } else if (args[0] == "omdbsearch") {
                    usageString  = "Description: Searches OMDb for the given query and reports matching films, shows, or albums. Returns ten results at a time so you "
                        + "may optionally pass in a page index to filter through the results";
                    usageString += "\nUsage: !omdbsearch [p1-100] <query>";
                } else if (args[0] == "hltb") {
                    usageString  = "Description: Searches HowLongToBeat for the average completion time for games";
                    usageString += "\nUsage: !hltb <query>";
                } else if (args[0] == "howlongtobeat") {
                    usageString  = "Description: Searches HowLongToBeat for the average completion time for games";
                    usageString += "\nUsage: !howlongtobeat <query>";
                } else if (args[0] == "itad") {
                    usageString  = "Description: Searches IsThereAnyDeal for deals on games";
                    usageString += "\nUsage: !itad <query>";
                } else if (args[0] == "isthereanydeal") {
                    usageString  = "Description: Searches IsThereAnyDeal for deals on games";
                    usageString += "\nUsage: !isthereanydeal <query>";
                } else if (args[0] == "8ball") {
                    usageString  = "Description: What does the Magic 8 Ball say?";
                    usageString += "\nUsage: !8ball <question>";
                } else if (args[0] == "destroy") {
                    usageString  = "Description: Destroys other users";
                    usageString += "\nUsage: !destroy @<user>";
                } else if (args[0] == "uptime") {
                    usageString  = "Description: Reports how long " + bot.username + " has been online";
                    usageString += "\nUsage: !uptime";
                } else if (args[0] == "repo") {
                    usageString  = "Description: Links the repository for " +  bot.username + "'s code";
                    usageString += "\nUsage: !repo";
                } else if (args[0] == "version") {
                    usageString  = "Description: Reports " +  bot.username + "'s version";
                    usageString += "\nUsage: !version";
                } else {
                    noResults = true;
                }

                if (noResults) {
                    sendChannelMessage(channelID, "Please supply a command you wish to learn more about, for example !usage search", "usage");
                } else {
                    sendChannelMessage(channelID, usageString, "usage");
                }
                break;
            // Check the Plex server status and report back if it's running
            case "serverstatus":
                plex.query("/").then(function (result) {
                    sendChannelMessage(channelID, "The Plex server appears to be up", "serverstatus");
                }, function (err) {
                    sendChannelMessage(channelID, "The Plex server appears to be down, go yell at Josh", "serverstatus");
                });
                break;
            // Check the Discord status and report back if there are any issues
            case "discordstatus":
                // Initialize Discord API Options
                var discordOptions = {
                    hostname: "srhpyqt94yxb.statuspage.io",
                    path: "/api/v2/incidents/unresolved.json",
                    method: "GET"
                };

                https.get(discordOptions, (resp) => {
                    let data = "";
                    console.log("statusCode:", resp.statusCode);
                    console.log("headers:", resp.headers);

                    resp.on("data", (chunk) => {
                        data += chunk;
                    });

                    resp.on("end", () => {
                        discordData = JSON.parse(data);
                        console.log("data:", discordData);

                        if (discordData.incidents.length == 0 || discordData.incidents === undefined) {
                            sendChannelMessage(channelID, "There are no ongoing incidents", "discordstatus");
                            sendChannelMessage(channelID, "https://status.discord.com", "discordstatus");
                        } else {
                            for (var i = 0; i < discordData.incidents.length; i++) {
                                sendChannelMessage(channelID, discordData.incidents[i].name, "discordstatus");
                                sendChannelMessage(channelID, discordData.incidents[i].shortlink, "discordstatus");
                            }
                        }
                    });
                }).on("error", (err) => {
                    console.error(err);
                    sendChannelMessage(channelID, "An error has occurred, go yell at Derek", "discordstatus");
                });
                break;
            // Check if a given piece of media (film, show, anime, or album) exists on the Plex server
            case "search":
                var query = "";
                var searchOutput = "";
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
                var searchOutput = "";
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
                                    "icon_url": "https://i.imgur.com/QhElb95.png",
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
            // Play a video from the Sons of Lanarchy playlist
            case "playlist":
                var query = "";
                var searchOutput = "";
                var noResults = true;
                var argInt = parseInt(args[0], 10);

                if (args.length > 1) {
                    sendChannelMessage(channelID, "Please specify a single index idiot", "playlist (index)");
                    return;
                }

                (async() => {   
                    try {
                        //var playlist = await youtube.getPlaylist("PLLwcjCbudUfArDWGtC0_iQBw0gtlMzvzF");
                        //console.log(playlist);
                        var playlistItems = await youtube.getPlaylistItems("PLLwcjCbudUfArDWGtC0_iQBw0gtlMzvzF", 0);
                        //console.log(playlistItems);

                        if (args.length == 1 && args <= 0) {
                            sendChannelMessage(channelID, "Specify an index falling between 1 and " + playlistItems.length + ", idiot", "playlist (index)");
                        } else if (args > playlistItems.length) {
                            sendChannelMessage(channelID, "The index specified is larger than the number of items in the playlist (" + playlistItems.length + "), idiot", "playlist (index)");
                        } else if (args.length == 1) {
                            if (typeof argInt != "number" || isNaN(argInt)) {
                                sendChannelMessage(channelID, "Please specify a number idiot", "playlist (index)");
                            } else {
                                youtubeLink = playlistItems[args - 1];
                                sendChannelMessage(channelID, youtubeLink.url, "playlist (index)");
                            }
                        } else {
                            youtubeLink = playlistItems[Math.floor(Math.random() * playlistItems.length)];
                            sendChannelMessage(channelID, youtubeLink.url, "playlist");
                        }

                        //for (var i = 0; i < playlistItems.length; i++) {
                        //    console.log(playlistItems[i].url);
                        //}
                    } catch(exception) {
                        sendChannelMessage(channelID, "An exception occurred (" + exception + "), go yell at Derek", "youtubesearch");
                    }
                })();
                break;
            // Return the top result of a Youtube search
            case "youtubesearch":
                var query = "";

                if (args.length == 0) {
                    sendChannelMessage(channelID, "No search term specified, please use: !youtubesearch <query> to search for Youtube videos", "youtubesearch");
                    break;
                } else {
                    query = args.join(' ');
                    console.log("Query: " + query);
                }

                (async() => {   
                    try {
                        var video = await youtube.getVideo(query);
                        //console.log(video)
                        sendChannelMessage(channelID, "https://www.youtube.com/watch?v=" + video.id, "youtubesearch");
                    } catch(UnhandledPromiseRejectionWarning) {
                        sendChannelMessage(channelID, "Nothing found for that search term, please refine your search dimwit", "youtubesearch");
                    }
                })();
                break;
            // Return Get Schwifty (Andromulus Remix)
            case "schwifty":
                sendChannelMessage(channelID, "https://www.youtube.com/watch?v=m3RUYMGD9-o", "schwifty");
                break;
            // Pull an Imgur link from an album (random image or index)
            // TODO: need an imgur count command and a link to post the imgur library
            case "imgur":
                // Initialize Imgur Options
                var imgurOptions = {
                    hostname: "api.imgur.com",
                    path: "/3/album/" + config.imgurAlbum,
                    headers: {"Authorization": "Client-ID " + config.imgurClientId},
                    method: "GET"
                };

                https.get(imgurOptions, (resp) => {
                    let data = "";
                    console.log("statusCode:", resp.statusCode);
                    console.log("headers:", resp.headers);

                    resp.on("data", (chunk) => {
                        data += chunk;
                    });

                    sendChannelMessage(channelID, "Please wait a few moments while the media can be found", "imgur");
                    resp.on("end", () => {
                        imgurData = JSON.parse(data);
                        console.log("data:", imgurData.data);

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
                    console.error(err);
                    sendChannelMessage(channelID, "An error has occurred, go yell at Derek", "imgur");
                });
                break;
            // Revamp: memes <meme name> or <id>
            // Return So it begins GIF
            case "soitbegins":
                sendChannelMessage(channelID, "https://i.imgur.com/owtlQgV.gifv", "soitbegins");
                break;
            // Return God wills it! GIF
            case "godwillsit":
                sendChannelMessage(channelID, "https://i.imgur.com/cTmgfgJ.gifv", "godwillsit");
                break;
            // Return Absence of God GIF
            case "absenceofgod":
                sendChannelMessage(channelID, "https://i.imgur.com/sLvxe4X.gifv", "absenceofgod");
                break;
            // Return Deal With It GIF
            case "dealwithit":
                sendChannelMessage(channelID, "https://i.imgur.com/1W9I06u.gifv", "dealwithit");
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
                            console.log("data:", movieData);

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
                            console.log("data:", movieData);

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
                        console.log("page:", page);
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
                        console.log("data:", movieData);

                        if (movieData.Response == "False") {
                            sendChannelMessage(channelID, "No movie or show found, please refine your search and consider including a year dimwit", "omdbsearch");
                        } else {
                            searchOutput += "Films and Shows:" + "\n"

                            for (var i = 0; i < movieData.Search.length; i++) {
                                //console.log(movieData.Search[i]);
                                searchOutput += movieData.Search[i].Title + " (" + movieData.Search[i].Year + ")\n";
                            }

                            searchOutput += "Total Results: " + movieData.totalResults + " (" + Math.ceil(movieData.totalResults / 10) + " pages)";
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
                var hltbOutput = "";
                var noResults = true;

                if (args.length == 0) {
                    sendChannelMessage(channelID, "No game specified, please use: !hltb <query> or !howlongtobeat <query> to search for the average completion time for games", "howlongtobeat");
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
            // Check IsThereAnyDeal for game deals
            case "itad":
            case "isthereanydeal":
                var query = "";
                var itadOutput = "";
                var noResults = true;
                var title = "";
                var fieldCount = 0;
                var gameEmbed = new DiscordJs.MessageEmbed();

                if (args.length == 0) {
                    sendChannelMessage(channelID, "No game specified, please use: !itad <query> or !isthereanydeal <query> to search for prices for a games", "isthereanydeal");
                    break;
                } else {
                    query = args.join(' ');
                    console.log("Query: " + query);
                }

                /*
                const response = await igdb()
                    .fields(['name', 'movies', 'age']) // fetches only the name, movies, and age fields
                    .fields('name,movies,age') // same as above
                    .limit(50) // limit to 50 results
                    .offset(10) // offset results by 10
                    .sort('name') // default sort direction is 'asc' (ascending)
                    .sort('name', 'desc') // sorts by name, descending
                    .search('mario') // search for a specific name (search implementations can vary)
                    .where(`first_release_date > ${new Date().getTime() / 1000}`) // filter the results
                    .request('/games'); // execute the query and return a response object
                console.log(response.data);

                async() => {
                    const shops = await itadApi.getShops();
                };
                */

                sendChannelMessage(channelID, "Please wait a few moments while the closest result can be found", "isthereanydeal");
                (async() => {
                    const itadOutput = await itadApi.getDealsFull({
                      shops: ["steam", "gog", "origin", "epic", "battlenet", "uplay", "squenix", "humblestore"],
                      limit: 50,
                      sort: "time",
                    }, query);

                    itadOutput.list.sort((a, b) => a.title.localeCompare(b.title, 'en', {ignorePunctuation: true}));
                    //console.log(itadOutput);

                    if (itadOutput.count >= 1) {
                        for (var i = 0; i < itadOutput.count; i++) {
                            var itadElement = itadOutput.list[i];
                            //console.log(itadElement);
                            //console.log(itadElement.title);

                            if (title === "" && !itadElement.title.includes("Offer") && !itadElement.title.includes("Currency") && !itadElement.title.includes("Pass") 
                                && !itadElement.title.includes("Pack") && itadElement.is_dlc === false && itadElement.image !== null && itadElement.achievements === true) {

                                /*if (!query.toLowerCase().includes("complete") && (itadElement.title.includes("Complete") || itadElement.title.includes("Collection"))) {
                                    console.log(query);
                                    console.log(itadElement.title)
                                    break;
                                }
                                else if (!query.toLowerCase().includes("goty") && (itadElement.title.includes("Game of the Year") || itadElement.title.includes("GOTY"))) {
                                    console.log(query);
                                    console.log(itadElement.title)
                                    break;
                                }*/

                                title = itadElement.title;
                                gameEmbed.setColor("046EB2")
                                    .setTitle(title)
                                    .setURL(itadElement.urls.game)
                                    .setImage(itadElement.image)
                                    .setFooter("IsThereAnyDeal", "https://i.imgur.com/Y53EOrA.jpg");
                            }
                            if (itadElement.shop.name === "Epic Game Store") {
                                itadElement.shop.name = "Epic";
                            }
                            if (title === itadElement.title && !itadElement.title.includes("Offer") && !itadElement.title.includes("Currency") 
                                && !itadElement.title.includes("Pass") && !itadElement.title.includes("Pack") 
                                && itadElement.is_dlc === false && itadElement.image !== null && fieldCount < 8) {
                                gameEmbed.addField("Sale Price (" + itadElement.shop.name + ")", "$" + itadElement.price_new.toString(), true);
                                gameEmbed.addField("List Price (" + itadElement.shop.name + ")", "$" + itadElement.price_old.toString(), true);
                                gameEmbed.addField("Discount", itadElement.price_cut.toString() + "%", true);
                                fieldCount++;
                                noResults = false;
                            }
                        }
                    }

                    if (noResults) {
                        sendChannelMessage(channelID, "No results found, please refine your search dimwit", "isthereanydeal");
                    } else {
                        sendEmbedMessage(channelID, gameEmbed, "isthereanydeal");
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
            // Destroy
            case "destroy":
                var sentMessage = false;
                var botId = "<@!" + bot.id + ">";
                var userId = "<@!" + userID + ">";

                if (args.length == 0) {
                    sendChannelMessage(channelID, "No target specified, please use: !destroy @<user>", "destroy");
                    break;
                }

                for (var i = 0; i < args.length; i++) {
                    var sendMessage = true;
                    //console.log(args[i]);

                    if (args[i].indexOf("><") !== -1) {
                        sendMessage = false;
                    } else if (!args[i].startsWith("<@") && args[i] !== "@everyone" && args[i] !== "@here") {
                        sendMessage = false;
                    } else if (args[i] === botId) {
                        var message = userId + " attempts to destroy " + args[i] + ", but fails";
                        var image = "https://i.imgur.com/Av8WEet.gifv";
                    }  else if (args[i] === userId) {
                        var sepukkuArray = [
                            ["https://i.imgur.com/SPme9Mk.gifv", "commits seppuku"],
                            ["https://i.imgur.com/QdoEa2D.gifv", "commits seppuku"],
                            ["https://i.imgur.com/zWD0bNI.gifv", "commits seppuku"],
                            ["https://i.imgur.com/epC83w1.gifv", "commits sudoku"]
                        ];

                        var sepukkuIndex = Math.floor(Math.random() * sepukkuArray.length);
                        var message = userId + " " + sepukkuArray[sepukkuIndex][1];
                        var image = sepukkuArray[sepukkuIndex][0];
                    } else if (args[i] === config.ownerId) {
                        var message = userId + "'s gun misfires and kills himself after attempting to shoot " + config.ownerId;
                        var image = "https://i.imgur.com/exd2yso.gifv";
                    } else if (args[i] === "@here") {
                        var hereArray = [
                            ["https://i.imgur.com/llTxowt.gifv", "wipes out everyone here with a comet"],
                            ["https://i.imgur.com/rQ97Qrf.gifv", "wipes out everyone here with a colony drop"]
                        ];

                        var hereIndex = Math.floor(Math.random() * hereArray.length);
                        var message = userId + " " + hereArray[hereIndex][1];
                        var image = hereArray[hereIndex][0];
                    } else if (args[i] === "@everyone") {
                        var everyoneArray = [
                            ["https://i.imgur.com/88TvEfa.gifv", "destroys everyone with an ignition from the Death Star"],
                            ["https://i.imgur.com/0oGyclt.gifv", "destroys everyone with an ignition from the Death Star"],
                            ["https://i.imgur.com/U8mw1is.gifv", "destroys everyone with a single reactor ignition from the Death Star"],
                            ["https://i.imgur.com/IQF4V6x.gifv", "calls down an exterminatus on everyone with an Atmospheric Incinerator Torpedo"]
                        ];

                        var everyoneIndex = Math.floor(Math.random() * everyoneArray.length);
                        var message = userId + " " + everyoneArray[everyoneIndex][1];
                        var image = everyoneArray[everyoneIndex][0];
                    } else {
                        var wmdArray = [
                            ["stabs", "https://i.imgur.com/dyEYSxz.gifv", "with a sword"],
                            ["slaps", "https://i.imgur.com/7LxAw4v.gifv", "with a salmon cannon"],
                            ["bombards", "https://i.imgur.com/pdGzHtM.gifv", "with a battleship"],
                            ["destroys", "https://i.imgur.com/Hq2slHC.gifv", "with a tiger tank"],
                            ["assassinates", "https://i.imgur.com/zL845S5.gifv", "with a sniper rifle"],
                            ["strikes", "https://i.imgur.com/56SS9Ac.gifv", "with an AC-130 Gunship"],
                            ["sinks", "https://i.imgur.com/ciJVtg4.gifv", "with a destroyer"],
                            ["targets", "https://i.imgur.com/nVixnXj.gifv", "with an attack helicopter"],
                            ["mows down", "https://i.imgur.com/UKcVfgS.gifv", "with a Huey"],
                            ["kamikazes", "https://i.imgur.com/cJw5jc1.gifv", "with a Zero"],
                            ["mows down", "https://i.imgur.com/9R6XCgM.gifv", "with a howitzer"],
                            ["burns", "https://i.imgur.com/P6wbpeA.gifv", "to death with a flamethrower"],
                            ["napalms", "https://i.imgur.com/4VFMRfd.gifv", "with an A-1 Skyraider"],
                            ["swats", "https://i.imgur.com/CuwooEX.gifv", "with a prank call"],
                            ["terminates", "https://i.imgur.com/Z9Ob0UF.gifv", "with a nuke"],
                            ["obliterates", "https://i.imgur.com/yYOL3Zp.gifv", "with a Jericho missile"],
                            ["blows up", "https://i.imgur.com/uWTJ6gD.gifv", "with a pistol"],
                            ["shoots", "https://i.imgur.com/nGW5Gf9.gifv", "with a gun"],
                            ["shoots", "https://i.imgur.com/RnLwIiM.gifv", "with a gun"],
                            ["sinks", "https://i.imgur.com/dqE3yfn.gifv", "with a torpedo"],
                            ["blinds","https://i.imgur.com/oQp2L8b.gifv", "with light"],
                            ["headshots","https://i.imgur.com/nRnPiyC.gifv", "with a sniper rifle"],
                            ["blows up", "https://i.imgur.com/WFUVRR4.gifv", "with wildfire"],
                            ["incinerates", "https://i.imgur.com/32R8Fyh.gifv", "with a dragon"],
                            ["stabs", "https://i.imgur.com/P6wpiHj.gifv", "with a knife"],
                            ["stabs", "https://i.imgur.com/2Pj1HYJ.gifv", "'s throat with a bayonet"],
                            ["slits", "https://i.imgur.com/OrIE00a.gifv", "'s throat with a dagger"],
                            ["breaks", "https://i.imgur.com/H0hlsPU.gifv", "'s skull with his/her bare hands"],
                            ["rips out", "https://i.imgur.com/rwTBaxE.gifv", "'s throat with his/her bare hands"],
                            ["melts", "https://i.imgur.com/EForv49.gifv", "with a golden crown"],
                            ["beheads", "https://i.imgur.com/OH1T4OC.gifv", "with a sword"],
                            ["slays", "https://i.imgur.com/TWigRBq.gifv", "with Valyrian Steel"],
                            ["cuts", "https://i.imgur.com/9pDMPJV.gifv", "with a sword"],
                            ["stabs", "https://i.imgur.com/ude5KAq.gifv", "with a fucking pencil"],
                            ["stabs", "https://i.imgur.com/eNQkEyt.gifv", "with several knives"],
                            ["blows up", "https://i.imgur.com/kgYlUzn.gifv", "with a wrench"],
                            ["vaporizes", "https://i.imgur.com/3mzHY1J.gifv", "with a Beam Cannon"],
                            ["embarasses", "https://i.imgur.com/NRCAl5z.gifv", "with a Bright Slap"],
                            ["9/11s", "https://i.imgur.com/i04NTMX.gifv", "with a 767"],
                            ["Pearl Harbors", "https://i.imgur.com/HQFYvhJ.gifv", "with a space cruiser"],
                            ["DESTROYS", "https://i.imgur.com/HdjIdTJ.gifv", "with FACTS and LOGIC"]
                        ];

                        var backfireArray = [
                            ["https://i.imgur.com/7VP0G70.gifv", userId + " tries to shoot " + args[i] + " but gets counter-sniped"],
                            ["https://i.imgur.com/HHV6znr.gifv", userId + " tries to shoot " + args[i] + " but misses"],
                            ["https://i.imgur.com/i1o3UYc.gifv", userId + " fires a torpedo at " + args[i] + " but fails to sink him"],
                            ["https://i.imgur.com/6m8KcTX.gifv", userId + " flips his tank trying to kill " + args[i]],
                            ["https://i.imgur.com/TiCEoGk.gifv", userId + " tries to kill " + args[i] + " with a throwing knife, but is reversed"]
                        ];

                        var backfirePercent = Math.random();

                        // 80% chance of hitting, 20% chance of a backfire/miss
                        if (backfirePercent <= 0.8) {
                            var wmdIndex = Math.floor(Math.random() * wmdArray.length);
                            var message = userId + " " + wmdArray[wmdIndex][0] + " " + args[i] + " " + wmdArray[wmdIndex][2];
                            var image = wmdArray[wmdIndex][1];
                        } else {
                            var backfireIndex = Math.floor(Math.random() * backfireArray.length);
                            var message = backfireArray[backfireIndex][1];
                            var image = backfireArray[backfireIndex][0];
                        }
                    }

                    if (sendMessage) {
                        sendChannelMessage(channelID, message, "destroy");
                        sendChannelMessage(channelID, image, "destroy");
                        sentMessage = true;
                    }
                }

                if (!sentMessage) {
                    var message = "No valid target identified, calling off the attack";
                    var image = "https://i.imgur.com/aFh4dvl.gifv";
                    sendChannelMessage(channelID, message, "destroy");
                    sendChannelMessage(channelID, image, "destroy");
                }

                break;
            // Custom destroy
            case "deldbot":
                var userId = "<@!" + userID + ">";

                if (args.length == 0) {
                    sendChannelMessage(channelID, "Awaiting orders", "destroy");
                    break;
                } else if (args.length == 1) {
                    sendChannelMessage(channelID, "No target specified for Deldbot", "destroy");
                    break;
                } else if (!args[1].startsWith("<@") && args[1] !== "@everyone" && args[1] !== "@here") {
                    sendChannelMessage(channelID, "No target specified for Deldbot", "destroy");
                    break;
                }

                if (args[0] === "destroy" && userId === config.ownerId) {
                    var message = "Deldbot heeds the call of the last Deld and destroys " + args[1];
                    var image = "https://i.imgur.com/yha5vhb.gifv";
                    sendChannelMessage(channelID, message, "destroy");
                    sendChannelMessage(channelID, image, "destroy");
                    sentMessage = true;
                } else {
                    var message = "Deldbot does not recognize your authority";
                    sendChannelMessage(channelID, message, "destroy");
                }
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
            // Link to code repository
            case "repo":
                sendChannelMessage(channelID, "Code for this bot resides at: https://github.com/Gelean/deldbot", "repo");
                break;
            // Report bot version
            case "version":
                sendChannelMessage(channelID, "Current Version: " + package.version, "version");
                break;
            /*case "ping":
                sendChannelMessage(channelID, "Ping is: " + bot.ping + "ms)", "ping");
                break;*/
            // Default response
            default:
                sendChannelMessage(channelID, "Type !help for commands", "default");
                break;
        }
    } else if(message.includes("<@!" + bot.id + ">") && !message.includes("destroy")) {
        sendChannelMessage(channelID, "https://i.gifer.com/73Xq.gif", "deldbotmessage");
    }
});
