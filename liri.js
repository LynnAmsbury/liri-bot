// Dependencies
require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");
var action = process.argv[2];
var title = process.argv.slice(3).join("+");


// Concert-this
var concertThis = function (artist) {
    var queryURL = "https://rest.bandsintown.com/artists/" + artist + "/events?app_id=codingbootcamp";

    axios.get(queryURL).then(
        function (response) {
            var searchData = response.data;

            if (!searchData.length) {
                console.log("No results found for " + artist);
                return;
            }

            console.log("Upcoming concerts for " + artist + ":");

            for (var i = 0; i < searchData.length; i++) {
                var show = searchData[i];

                console.log(
                    show.venue.city +
                    "," +
                    (show.venue.region || show.venue.country) +
                    " at " +
                    show.venue.name +
                    " " +
                    moment(show.datetime).format("MM/DD/YYYY")
                );
            }
        }
    );
};

// Spotify-this-song
var spotifyThis = function (songName) {
    // console.log("songName param:" , songName)
    // console.log("if conditional", songName === undefined)
    if (songName === "") {
        songName = "The Sign";
      }
	  console.log("songName default:" , songName)
    // if (songName === undefined) {
    //     songName = "The Sign";
    //   }
      if (songName === undefined) {
        songName = "The Sign";
      }

    spotify.search({
        type: 'track',
        query: songName
    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var searchResult = data.tracks.items[0];
        console.log("Title: " + searchResult.name);
        console.log("Artist: " + searchResult.artists[0].name);
        console.log("Preview Link: " + searchResult.preview_url);
        console.log("Album: " + searchResult.album.name);
    });
}

// Movie-this
var movieThis = function (movieName) {
    if (movieName === "") {
        movieName = "Mr Nobody";
    }

    var movieUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";

    axios.get(movieUrl).then(
        function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Rated: " + response.data.Rated);
            console.log("Release Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Country: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
        }
    ).catch(function (error) {
        console.log(error);
    })
};

// Do-what-it-says
var doWhatItSays = function () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        action = dataArr[0];
        title = dataArr[1];
        router(action, title);
    })
};

// Switch statement to route requests
var router = function (actionType, name) {
    switch (actionType) {
        case "concert-this":
            concertThis(name);
            break;
        case "spotify-this-song":
            spotifyThis(name);
            break;
        case "movie-this":
            movieThis(name);
            break;
        case "do-what-it-says":
            doWhatItSays();
            break;
        default:
            console.log("I can't help you with that.");
    }
};
router(action, title);