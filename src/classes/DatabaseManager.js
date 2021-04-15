const fs = require("fs");
const userHome = require("user-home");
const path = require("path");

import { summary } from "date-streaks";

import { EventBus } from "../main";

export default class DatabaseManager {
    app = null;

    dataFolder = `${userHome}/Documents/YouTube Assist`;
    videoDataFolder = `${this.dataFolder}/Videos`;
    apiDataFolder = `${this.dataFolder}/YouTube API`;
    ideasFile = `${this.dataFolder}/ideas.json`;

    constructor(_app) {
        this.app = _app;
    }

    saveVideo(data) {
        return new Promise((resolve, reject) => {
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
                    if (err) reject(err);
                    else resolve();
                    //console.log("File is created successfully.");
                }
            );
        });
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
        return new Promise((resolve, reject) => {
            fs.writeFile(
                `${this.apiDataFolder}/channel_data.json`,
                JSON.stringify(data),
                function(err) {
                    if (err) reject(err);
                    resolve();
                }
            );
        });
    }

    saveYouTubeData(data, fileName) {
        return new Promise((resolve, reject) => {
            fs.writeFile(
                `${this.apiDataFolder}/${fileName}.json`,
                JSON.stringify(data),
                function(err) {
                    if (err) reject(err);
                    resolve();
                }
            );
        });
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

    deleteVideoByID(id) {
        return new Promise((resolve, reject) => {
            try {
                fs.unlinkSync(this.fileNameFromID(id));
                EventBus.$emit("reloadData");
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
                        var videos = new Array();

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
                                videos.push(video);
                            }
                        });

                        resolve(videos);
                    }
                );
            } catch {
                reject();
            }
        });
    }

    saveIdea(ideaText) {
        if (!fs.existsSync(this.ideasFile)) {
            fs.writeFileSync(this.ideasFile, "[]");
            console.log("File does not exist. Creating idea file");
        }

        var idea = {
            idea: ideaText,
            created: Date.now()
        };

        var data = JSON.parse(fs.readFileSync(this.ideasFile));
        data.push(idea);
        fs.writeFileSync(this.ideasFile, JSON.stringify(data));

        EventBus.$emit("reloadData");
    }

    deleteIdea(ideaToDelete) {
        var data = JSON.parse(fs.readFileSync(this.ideasFile));

        data.forEach(function(result, index) {
            if (
                result["idea"] === ideaToDelete.idea &&
                result["created"] === ideaToDelete.created
            ) {
                //Remove from array
                data.splice(index, 1);
            }
        });

        fs.writeFileSync(this.ideasFile, JSON.stringify(data));

        EventBus.$emit("reloadData");
    }

    loadIdeas() {
        return new Promise(resolve => {
            if (!fs.existsSync(this.ideasFile)) {
                fs.writeFileSync(this.ideasFile, "[]");
                console.log("File does not exist. Creating idea file");
            }

            this.loadDataFromFile(this.ideasFile).then(data => {
                resolve(data);
            });
        });
    }

    convertIdeaToVideo(idea, status) {
        var newVideo = this.getEmptyVideo();

        newVideo.description = idea.idea;

        newVideo.title =
            newVideo.description < 15
                ? newVideo.description
                : newVideo.description.slice(0, 15);

        if (status) {
            console.log("Status " + status);
            newVideo.status = status;
        }

        this.saveVideo(newVideo).then(() => {
            this.deleteIdea(idea);

            EventBus.$emit("reloadData");
        });
    }

    getEmptyVideo() {
        return {
            id: 0,
            title: "",
            description: "",
            tags: "",
            status: 0,
            filePath: "",
            thumbnailPath: "",
            created: Date.now()
        };
    }

    getStatistics() {
        return new Promise(resolve => {
            var stats = {
                uploadsLastMonth: 0,
                uploadsThisMonth: 0,
                uploadStreak: 0
            };

            var date = {
                year: null,
                month: null,
                previousMonth: null,
                day: null
            };

            date.year = new Date().getFullYear();
            date.month = ("0" + (new Date().getUTCMonth() + 1)).slice(-2);
            date.previousMonth = (
                "0" +
                (new Date().getUTCMonth() === 0 ? 12 : new Date().getUTCMonth())
            ).slice(-2);
            date.day = ("0" + new Date().getUTCDate()).slice(-2);

            var dates = [];

            this.loadDataFromFile(`${this.apiDataFolder}/latest.json`).then(
                data => {
                    var videosFromLastMonth = new Array();
                    var videosFromThisMonth = new Array();

                    data.forEach(video => {
                        var dateObj = new Date(video.snippet.publishedAt);
                        //dateObj;

                        var month = ("0" + (dateObj.getUTCMonth() + 1)).slice(
                            -2
                        ); //months from 1-12
                        // var day = ("0" + dateObj.getUTCDate()).slice(-2);
                        var year = dateObj.getUTCFullYear();

                        var videoDate = year + "-" + month;

                        dates.push(dateObj.setHours(0, 0, 0, 0));

                        // console.log(
                        //     `${date.year +
                        //         "-" +
                        //         date.previousMonth} === ${videoDate}`
                        // );

                        if (date.year + "-" + date.previousMonth === videoDate)
                            videosFromLastMonth.push(video);
                        else if (date.year + "-" + date.month === videoDate)
                            videosFromThisMonth.push(video);
                    });

                    stats.uploadsLastMonth = videosFromLastMonth.length;
                    stats.uploadsThisMonth = videosFromThisMonth.length;

                    var streak = summary({ dates });
                    stats.uploadStreak = streak.currentStreak;

                    // console.log(streak);

                    resolve(stats);
                }
            );
        });
    }

    getNegativeWordsList() {
        return new Promise(resolve => {
            var request = require("request");
            request.get(
                "https://gist.githubusercontent.com/mkulakowski2/4289441/raw/dad8b64b307cd6df8068a379079becbb3f91101a/negative-words.txt",
                function(error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var wordsString = body;
                        var words = wordsString.split(/\r?\n/);
                        var negativeWords = words.splice(35, words.length);
                        resolve(negativeWords);
                    } else {
                        console.log("Error occured");
                    }
                }
            );
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
