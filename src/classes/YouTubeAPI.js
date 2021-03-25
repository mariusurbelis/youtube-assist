import {
    readFile,
    mkdirSync,
    writeFile
} from "fs";
// import { createInterface } from "readline";
import {
    google
} from "googleapis";
// import { trimEnd } from "user-home";
import {
    EventBus,
    DB
} from "../main";
const userHome = require("user-home");
const fs = require("fs");
var OAuth2 = google.auth.OAuth2;

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/youtube-nodejs-quickstart.json
var SCOPES = [
    "https://www.googleapis.com/auth/youtube.readonly",
    "https://www.googleapis.com/auth/youtube.upload"
];
var TOKEN_DIR = `${userHome}/Documents/YouTube Assist/`;
var TOKEN_PATH = TOKEN_DIR + "auth.json";

// console.log("YouTube API Script Initiated");

pullDataFromAPI();

var minutes = 1,
    the_interval = minutes * 60 * 1000;
setInterval(function () {
    if (!uploadingVideo) {
        console.log(`Refreshing API data every ${minutes} minutes`);
        pullDataFromAPI();
    }
}, the_interval);

var fileWritesLeft = 4;
var uploadsInitialized = false;
var uploadingVideo = false;

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

    // Check if we have previously stored a token.
    readFile(TOKEN_PATH, function (err, token) {
        if (err) {
            getNewToken(oauth2Client, callback);
        } else {
            oauth2Client.credentials = JSON.parse(token);
            EventBus.$emit("authSuccess");
            callback(oauth2Client);
        }
    });
}

function handleSingleFileWriteFinished() {
    fileWritesLeft--;

    if (fileWritesLeft === 0) {
        dataLoadFinished();
        fileWritesLeft = 4;
    }
}

function dataLoadFinished() {
    EventBus.$emit("initializeScreens");
    EventBus.$emit("reloadData");
}

var clientSecret = null;

function pullDataFromAPI() {
    readFile("client_secret.json", function processClientSecrets(err, content) {
        if (err) {
            console.log("Error loading client secret file: " + err);
            return;
        }
        clientSecret = JSON.parse(content);
        // Authorize a client with the loaded credentials, then call the YouTube API.
        authorize(JSON.parse(content), getChannel);
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

    EventBus.$emit("saveAuthURL", authUrl);

    EventBus.$on("authYouTubeAPI", code => {
        oauth2Client.getToken(code, function (err, token) {
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

function getFilesize(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats.size;
    return fileSizeInBytes / 1000000;
}

/**
 * Upload the video file.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function uploadVideo(auth, video) {
    const service = google.youtube("v3");

    console.log(`Uploading ${video.filePath}`);

    // var videoFileStream = ipcRenderer.sendSync("createReadStream", video.filePath);
    // var thumbnailFileStream = ipcRenderer.sendSync("createReadStream", video.thumbnailPath);

    uploadingVideo = true;

    console.log(`Video file size ${getFilesize(video.filePath)} MB`);
    console.log(`Thumbnail file size ${getFilesize(video.thumbnailPath)} MB`);
}

/**
 * Lists the names and IDs of up to 10 files.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function getChannel(auth) {
    var service = google.youtube("v3");
    service.channels.list({
            auth: auth,
            part: "contentDetails,statistics",
            mine: true
        },
        function (err, response) {
            if (err) {
                console.log("The API returned an error: " + err);
                refreshAuth();
                return;
            }
            var channels = response.data.items;
            if (channels.length == 0) {
                console.log("No channel found.");
            } else {
                // console.log(`Channel ID: ${channels[0].id}`);
                DB.saveYouTubeChannelData(channels[0]).then(
                    handleSingleFileWriteFinished
                );

                getPlaylist(
                    auth,
                    channels[0].contentDetails.relatedPlaylists.uploads
                );
            }
        }
    );
}

function refreshAuth() {
    fs.unlink(TOKEN_PATH, err => {
        if (err) throw err;
        else window.location.reload();
    });
}

function getPlaylist(auth, playListIDQuery) {
    var service = google.youtube("v3");
    service.playlistItems.list({
            auth: auth,
            part: "contentDetails,status",
            playlistId: playListIDQuery,
            maxResults: 60
            // mine: true
        },
        function (err, response) {
            // console.log(`Looking for ${playListIDQuery}`);

            if (err) {
                console.log("The API returned an error: " + err);
                return;
            }
            var playlist = response.data.items;
            if (playlist === null) {
                console.log("No playlist found.");
            } else {
                // console.log(`Playlist: ${playlist}`);
                DB.saveYouTubeData(playlist, "uploads").then(
                    handleSingleFileWriteFinished
                );
                getScheduledVideos(auth, playlist);
                getLatestVideos(auth, playlist);
            }
        }
    );
}

function getLatestVideos(auth, playlist) {
    var videoIDs = "";

    playlist.forEach(videoElement => {
        // console.log(videoElement.contentDetails.videoId);
        if (videoElement.status.privacyStatus === "public")
            videoIDs += `${videoElement.contentDetails.videoId},`;
    });

    var service = google.youtube("v3");
    service.videos.list({
            auth: auth,
            part: "snippet,statistics",
            id: videoIDs
            // mine: true
        },
        function (err, response) {
            // console.log(`Looking for ${playlist[0].contentDetails.videoId}`);

            if (err) {
                console.log("The API returned an error: " + err);
                return;
            }
            var latest = response.data.items;
            if (latest === null) {
                console.log("No video found.");
            } else {
                // console.log(`Playlist: ${playlist}`);

                var index;
                while (
                    (index = latest.findIndex(
                        a => a.snippet.liveBroadcastContent !== "none"
                    )) >= 0
                ) {
                    if (index > -1) latest.splice(index, 1);
                }

                //console.log(sampleArray);

                DB.saveYouTubeData(latest, "latest").then(
                    handleSingleFileWriteFinished
                );
            }
        }
    );
}

function getScheduledVideos(auth, playlist) {
    var videoIDs = "";

    playlist.forEach(videoElement => {
        // console.log(videoElement.contentDetails.videoId);
        if (videoElement.status.privacyStatus === "private")
            videoIDs += `${videoElement.contentDetails.videoId},`;
    });

    var service = google.youtube("v3");
    service.videos.list({
            auth: auth,
            part: "snippet,statistics",
            id: videoIDs
            // mine: true
        },
        function (err, response) {
            // console.log(`Looking for ${playlist[0].contentDetails.videoId}`);

            if (err) {
                console.log("The API returned an error: " + err);
                return;
            }
            var scheduled = response.data.items;
            if (scheduled === null) {
                console.log("No video found.");
            } else {
                // console.log(`Playlist: ${playlist}`);

                var index;
                while (
                    (index = scheduled.findIndex(
                        a => a.snippet.liveBroadcastContent !== "none"
                    )) >= 0
                ) {
                    if (index > -1) scheduled.splice(index, 1);
                }

                DB.saveYouTubeData(scheduled, "scheduled").then(
                    handleSingleFileWriteFinished
                );
            }
        }
    );
}