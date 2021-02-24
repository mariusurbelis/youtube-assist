import { readFile, mkdirSync, writeFile } from "fs";
// import { createInterface } from "readline";
import { google } from "googleapis";
// import { trimEnd } from "user-home";
import { EventBus, DB } from "../main";
const userHome = require("user-home");
var OAuth2 = google.auth.OAuth2;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = ["https://www.googleapis.com/auth/youtube.readonly"];
var TOKEN_DIR = `${userHome}/Documents/YouTube Assist/`;
var TOKEN_PATH = TOKEN_DIR + "auth.json";

console.log("YouTube API Script Initiated");
// storeToken(`4/1AY0e-g5AuwbltTcI52Yom5wFGlBCo_GV86n9Zohsd7WNuBeH3xQfWTG5oHI`);

// Load client secrets from a local file.
readFile("client_secret.json", function processClientSecrets(err, content) {
    if (err) {
        console.log("Error loading client secret file: " + err);
        return;
    }
    // Authorize a client with the loaded credentials, then call the YouTube API.
    authorize(JSON.parse(content), getChannel);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

    console.log(TOKEN_PATH);

    // Check if we have previously stored a token.
    readFile(TOKEN_PATH, function(err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            EventBus.$emit("authSuccess");
            callback(oauth2Client);
        }
    });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: "offline",
        scope: SCOPES
    });
    console.log("Authorize this app by visiting this url: ", authUrl);
    // var rl = createInterface({
    //     input: process.stdin,
    //     output: process.stdout
    // });

    EventBus.$emit("saveAuthURL", authUrl);

    EventBus.$on("authYouTubeAPI", code => {
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log("Error while trying to retrieve access token", err);
                return;
            }
            oauth2Client.credentials = token;

            EventBus.$emit("authSuccess");

            storeToken(token);
            callback(oauth2Client);
        });
    });

    // rl.question("Enter the code from that page here: ", function(code) {
    //     rl.close();
    //     oauth2Client.getToken(code, function(err, token) {
    //         if (err) {
    //             console.log("Error while trying to retrieve access token", err);
    //             return;
    //         }
    //         oauth2Client.credentials = token;
    //         storeToken(token);
    //         callback(oauth2Client);
    //     });
    // });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
        mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != "EEXIST") {
            throw err;
        }
    }
    writeFile(TOKEN_PATH, JSON.stringify(token), err => {
        if (err) throw err;
        console.log("Token stored to " + TOKEN_PATH);
    });
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel(auth) {
    var service = google.youtube("v3");
    service.channels.list(
        {
            auth: auth,
            part: "contentDetails,statistics",
            mine: true
        },
        function(err, response) {
            if (err) {
                console.log("The API returned an error: " + err);
                return;
            }
            var channels = response.data.items;
            if (channels.length == 0) {
                console.log("No channel found.");
            } else {
                // console.log(`Channel ID: ${channels[0].id}`);
                DB.saveYouTubeChannelData(channels[0]);
                getPlaylist(
                    auth,
                    channels[0].contentDetails.relatedPlaylists.uploads
                );
            }
        }
    );
}

function getPlaylist(auth, playListIDQuery) {
    var service = google.youtube("v3");
    service.playlistItems.list(
        {
            auth: auth,
            part: "snippet",
            playlistId: playListIDQuery,
            maxResults: 10
            // mine: true
        },
        function(err, response) {
            console.log(`Looking for ${playListIDQuery}`);

            if (err) {
                console.log("The API returned an error: " + err);
                return;
            }
            var playlist = response.data.items;
            if (playlist === null) {
                console.log("No playlist found.");
            } else {
                // console.log(`Playlist: ${playlist}`);
                DB.saveYouTubeData(playlist, "uploads");
            }
        }
    );
}
