"use strict";

import {
    app,
    protocol,
    BrowserWindow,
    ipcMain
} from "electron";
import {
    createProtocol
} from "vue-cli-plugin-electron-builder/lib";
import installExtension, {
    VUEJS_DEVTOOLS
} from "electron-devtools-installer";
const isDevelopment = process.env.NODE_ENV !== "production";

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([{
    scheme: "app",
    privileges: {
        secure: true,
        standard: true
    }
}]);

async function createWindow() {
    // Create the browser window.
    const win = new BrowserWindow({
        width: 1280,
        height: 900,
        // frame: false,
        title: "YouTube Assist Desktop",
        icon: "icon.png",
        webPreferences: {
            // Use pluginOptions.nodeIntegration, leave this alone
            // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
            //nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION
            nodeIntegration: true,
            webSecurity: false
        },
        resizable: false
    });

    // win.removeMenu();

    win.on("page-title-updated", event => event.preventDefault());

    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
        if (!process.env.IS_TEST) win.webContents.openDevTools();
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        win.loadURL("app://./index.html");
    }
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
    protocol.registerFileProtocol('file', (request, callback) => {
        const pathname = request.url.replace('file:///', '');
        // console.log("REG REG REG");
        callback(pathname);
    });

    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS_DEVTOOLS);
        } catch (e) {
            console.error("Vue Devtools failed to install:", e.toString());
        }
    }
    createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", data => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}

// YOUTUBE API VIDEO UPLOAD

const userHome = require("user-home");

var TOKEN_DIR = `${userHome}/Documents/YouTube Assist/`;
var TOKEN_PATH = TOKEN_DIR + "auth.json";

ipcMain.on('upload', (event, video) => {
    fs.readFile("client_secret.json", function processClientSecrets(err, content) {
        if (err) {
            console.log("Error loading client secret file: " + err);
            return;
        }

        var credentials = JSON.parse(content);

        var clientSecret = credentials.installed.client_secret;
        var clientId = credentials.installed.client_id;
        var redirectUrl = credentials.installed.redirect_uris[0];

        var oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);

        // Check if we have previously stored a token.
        fs.readFile(TOKEN_PATH, function (err, token) {
            if (err) {
                console.log("Video upload auth error occured");
                //getNewToken(oauth2Client, callback);
            } else {
                oauth2Client.credentials = JSON.parse(token);
                uploadVideo(oauth2Client, video, event);
            }
        });
    });
});

const fs = require("fs");

import {
    google
} from "googleapis";

var OAuth2 = google.auth.OAuth2;
var clientSecret = null;

/**
 * Upload the video file.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function uploadVideo(auth, video, event) {
    const service = google.youtube("v3");

    event.reply("videoStatus", "Uploading the video...");

    service.videos.insert({
            auth: auth,
            part: "snippet,status",
            requestBody: {
                snippet: {
                    title: video.title,
                    description: video.description,
                    tags: video.tags,
                    categoryId: 22, // People & Blogs
                    defaultLanguage: "en",
                    defaultAudioLanguage: "en"
                },
                status: {
                    privacyStatus: "private"
                }
            },
            media: {
                body: fs.createReadStream(video.filePath),
            }
        },
        function (err, response) {
            if (err) {
                console.log("The API returned an error: " + err);
                event.reply("videoUploadError");
                return;
            }
            //console.log(response.data);

            //event.reply("videoUploaded");
            event.reply("videoStatus", "Uploading the thumbnail...");

            console.log("Video uploaded. Uploading the thumbnail now.");
            service.thumbnails.set({
                    auth: auth,
                    videoId: response.data.id,
                    media: {
                        body: fs.createReadStream(video.thumbnailPath)
                        // body: fs.readFileSync(video.thumbnailPath)
                    }
                },
                function (err, response) {
                    if (err) {
                        console.log("The API returned an error: " + err);
                        return;
                    }
                    event.reply("videoStatus", "Uploading done");
                    event.reply("videoUploaded");

                    //console.log(response.data);
                }
            );
        }
    );
}

// -----------------------

// VIDEO CONVERTER

import {
    FFMpegProgress
} from 'ffmpeg-progress-wrapper';

const {
    dialog
} = require("electron");

ipcMain.on('selectConvertDestination', (event) => {
    dialog.showOpenDialog({
        properties: ["openFile", "openDirectory"]
    }).then((destination) => {
        event.reply('convertDestinationSelected', destination);
    });
});

ipcMain.on('convert', (event, data) => {

    var args = [
        '-y',
        '-i', `${data.filePath}`,
        '-f', `${data.format}`, `${data.fileDestination}/${data.newFileName}.${data.format}`
    ];


    (async () => {

        const process = new FFMpegProgress(args, {
            cmd: "ffmpeg.exe"
        });

        // process.on('raw', console.log);

        process.once('details', (details) => {
            console.log(JSON.stringify(details))
        });

        process.once('progress', () => {
            event.reply("fileConversionStarted");
        });

        process.on('progress', (progress) => {
            progress.progress *= 1000;
            progress.progress = Math.round(progress.progress * 100) / 100;
            // console.log(JSON.stringify(progress));
            // console.log(progress.progress);
            event.reply("fileConversionStatus", progress);
        });

        // TODO: handle file exists

        process.once('end', (exitCode) => {
            if (exitCode === 0) event.reply("fileConversionDone");
        });

        await process.onDone();

    })();

    return;

    // const process = require('child_process');

    var spawn = require('child_process').spawn;

    // process.exec(`ffmpeg.exe -i "${filePath}" "converted_file.${format}"`, function (error, stdout, stderr) {
    //     console.log('stdout: ' + stdout);
    //     if (error) console.log('exec error: ' + error);
    // });


    var cmd = 'ffmpeg.exe';

    var args = [
        '-y',
        '-hide_banner',
        '-i', `${filePath}`,
        '-f', `${format}`, `output.${format}`
    ];

    var proc = spawn(cmd, args);

    proc.stdout.on('data', function (data) {
        console.log(data);
    });

    proc.stderr.setEncoding("utf8")
    proc.stderr.on('data', function (data) {
        console.log(data);
    });

    proc.on('close', function () {
        console.log('finished');
    });



});

// ---------------