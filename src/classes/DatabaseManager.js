const fs = require("fs");
const userHome = require("user-home");
const path = require("path");

export default class DatabaseManager {
    app = null;

    dataFolder = `${userHome}/Documents/YouTube Assist`;
    videoDataFolder = `${this.dataFolder}/Videos`;
    apiDataFolder = `${this.dataFolder}/YouTube API`;

    constructor(_app) {
        this.app = _app;
    }

    saveVideo(data) {
        if (data.id < 1) {
            //console.log("Looking for a new ID");

            data.id = 1;

            while (fs.existsSync(this.fileNameFromID(data.id))) {
                data.id++;
            }
        }

        fs.writeFile(
            `${this.videoDataFolder}/${data.id}.json`,
            JSON.stringify(data),
            function(err) {
                if (err) throw err;
                //console.log("File is created successfully.");
            }
        );
    }

    getAllVideos() {
        var videoList = new Array();

        fs.readdir(this.videoDataFolder, (err, files) => {
            files.forEach(file => {
                fs.readFile(`${this.videoDataFolder}/${file}`, (err, data) => {
                    if (err) throw err;
                    let videoData = JSON.parse(data);

                    videoList.push(videoData);
                });
            });

            if (err) {
                console.log("Error loading dir");
            }
        });

        return videoList;
    }

    getAllVideosOfStatus(status) {
        var videoList = new Array();

        fs.readdir(this.videoDataFolder, (err, files) => {
            files.forEach(file => {
                fs.readFile(`${this.videoDataFolder}/${file}`, (err, data) => {
                    if (err) throw err;
                    let videoData = JSON.parse(data);

                    if (videoData.status === status) {
                        // console.log(`Found a video ${videoData.title}`);
                        videoList.push(videoData);
                    }
                });
            });

            if (err) {
                console.log("Error loading dir");
            }
        });

        return videoList;
    }

    // Refactor
    getVideoByID(id) {
        return new Promise((resolve, reject) => {
            fs.readdir(this.videoDataFolder, (err, files) => {
                files.forEach(file => {
                    fs.readFile(
                        `${this.videoDataFolder}/${file}`,
                        (err, data) => {
                            if (err) throw err;
                            let videoData = JSON.parse(data);
                            if (videoData.id == id) {
                                resolve(videoData);
                            }
                        }
                    );
                });

                if (err) {
                    console.log("Error loading dir");
                    reject();
                }
            });
        });
    }

    saveYouTubeChannelData(data) {
        fs.writeFile(
            `${this.apiDataFolder}/channel_data.json`,
            JSON.stringify(data),
            function(err) {
                if (err) throw err;
            }
        );
    }

    saveYouTubeData(data, fileName) {
        fs.writeFile(
            `${this.apiDataFolder}/${fileName}.json`,
            JSON.stringify(data),
            function(err) {
                if (err) throw err;
            }
        );
    }

    loadDataFromFile(filePath) {
        return new Promise((resolve, reject) => {
            var timer = setTimeout(function() {
                watcher.close();
                reject(
                    new Error(
                        "File does not exists and was not created during the timeout."
                    )
                );
            }, 100000);

            fs.access(filePath, fs.constants.R_OK, function(err) {
                if (!err) {
                    clearTimeout(timer);
                    watcher.close();

                    fs.readFile(filePath, (err, data) => {
                        if (err) throw err;
                        resolve(JSON.parse(data));
                    });
                }
            });

            var dir = path.dirname(filePath);
            var basename = path.basename(filePath);
            var watcher = fs.watch(dir, function(eventType, filename) {
                if (eventType === "rename" && filename === basename) {
                    clearTimeout(timer);
                    watcher.close();

                    fs.readFile(filePath, (err, data) => {
                        if (err) throw err;
                        resolve(JSON.parse(data));
                    });
                }
            });
        });
    }

    dataFromFile(filePath) {
        fs.readFileSync(filePath, (err, data) => {
            if (err) throw err;
            return JSON.parse(data);
        });
    }

    deleteVideoByID(id) {
        return new Promise((resolve, reject) => {
            try {
                fs.unlinkSync(this.fileNameFromID(id));
                resolve();
            } catch (error) {
                reject();
            }
        });
    }

    fileNameFromID(id) {
        return `${this.videoDataFolder}/${id}.json`;
    }

    getVideoByDate(date) {
        return new Promise((resolve, reject) => {
            // console.log(`Getting by date ${date}`);

            try {
                this.loadDataFromFile(`${this.apiDataFolder}/latest.json`).then(
                    data => {
                        data.forEach(video => {
                            var dateObj = new Date(video.snippet.publishedAt);
                            var month = (
                                "0" +
                                (dateObj.getUTCMonth() + 1)
                            ).slice(-2); //months from 1-12
                            var day = ("0" + dateObj.getUTCDate()).slice(-2);
                            var year = dateObj.getUTCFullYear();

                            var videoDate = year + "-" + month + "-" + day;

                            if (date === videoDate) {
                                resolve(video);
                            }
                        });
                    }
                );
            } catch {
                reject();
            }
        });
    }

    initializeFolders() {
        if (!fs.existsSync(this.dataFolder)) fs.mkdirSync(this.dataFolder);
        if (!fs.existsSync(this.videoDataFolder))
            fs.mkdirSync(this.videoDataFolder);
        if (!fs.existsSync(this.apiDataFolder))
            fs.mkdirSync(this.apiDataFolder);
    }
}
