<template>
    <div class="container shadow mb-5 p-5">
        <div hidden class="row mb-5">
            <div class="col-12"><h1>Single Video Page</h1></div>
        </div>

        <div v-if="uploadStatus === ''">{{ uploadStatus }}</div>

        <div class="row">
            <div class="col-12">
                <div class="input-group">
                    <div
                        @click="copyToClipboard(0)"
                        class="input-group-prepend"
                        style="cursor: default"
                    >
                        <span class="input-group-text">Title</span>
                    </div>
                    <textarea
                        style="height: 100%"
                        class="form-control"
                        rows="1"
                        aria-label="With textarea"
                        v-model="video.title"
                    ></textarea>
                </div>
            </div>
        </div>

        <div class="row mt-3">
            <div class="col-12">
                <div class="input-group">
                    <div
                        @click="copyToClipboard(1)"
                        class="input-group-prepend"
                        style="cursor: default"
                    >
                        <span class="input-group-text">Description</span>
                    </div>
                    <textarea
                        style="height: 100%"
                        class="form-control"
                        rows="10"
                        aria-label="With textarea"
                        v-model="video.description"
                    ></textarea>
                </div>
            </div>
        </div>

        <div class="row mt-3">
            <div class="col-12">
                <div class="input-group">
                    <div
                        @click="copyToClipboard(2)"
                        class="input-group-prepend"
                        style="cursor: default"
                    >
                        <span class="input-group-text">Tags</span>
                    </div>
                    <textarea
                        style="height: 100%"
                        class="form-control"
                        rows="2"
                        aria-label="With textarea"
                        v-model="video.tags"
                    ></textarea>
                </div>
            </div>
        </div>

        <input type="hidden" id="video-title-copy" :value="video.title" />
        <input
            type="hidden"
            id="video-description-copy"
            :value="video.description"
        />
        <input type="hidden" id="video-tags-copy" :value="video.tags" />

        <div class="row mt-3">
            <div class="col-6">
                Negative words in the title: {{ negativeWordsTitle }}
            </div>
            <div class="col-6">
                Negative words in the description:
                {{ negativeWordsDescription }}
            </div>
        </div>

        <div class="row justify-content-center mt-3">
            <button @click="checkForBadWords" class="btn btn-dark col-4">
                Check for negative words
            </button>
        </div>

        <div class="row mt-3">
            <div class="text-left col-6">
                <p v-if="timeConverter">
                    Created: {{ timeConverter(video.created) }}
                </p>
            </div>
            <div class="col-6 text-right">
                <p>ID: {{ video.id }}</p>

                <div hidden class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">ID</span>
                    </div>
                    <textarea
                        style="height: 100%"
                        class="form-control"
                        rows="1"
                        aria-label="With textarea"
                        v-model="video.id"
                    ></textarea>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-6">
                <button
                    class="btn btn-secondary"
                    onclick="document.getElementById('chooseThumbnailFile').click()"
                >
                    Select thumbnail
                </button>
            </div>
            <div v-if="video.thumbnailPath" class="col-6">
                {{ video.thumbnailPath }}
            </div>
        </div>
        <img :src="video.thumbnailPath" style="width: 20%" />

        <div class="row">
            <div class="col-6">
                <button
                    class="btn btn-secondary"
                    onclick="document.getElementById('chooseVideoFile').click()"
                >
                    Select video file
                </button>
            </div>
            <div v-if="video.filePath" class="col-6">{{ video.filePath }}</div>
        </div>

        <input
            type="file"
            id="chooseVideoFile"
            @change="handleFileChange"
            style="display: none"
        />

        <input
            type="file"
            id="chooseThumbnailFile"
            @change="handleThumbnailChange"
            style="display: none"
        />

        <div class="row mt-3 justify-content-center">
            <button class="btn btn-primary col-4" v-on:click="saveData">
                <font-awesome-icon icon="save" />
                Save
            </button>
            <button
                v-if="video.filePath"
                class="btn btn-danger col-4 offset-1"
                v-on:click="uploadVideo"
            >
                <font-awesome-icon icon="cloud-upload-alt" />
                Upload Video
            </button>
        </div>
    </div>
</template>

<script>
import { EventBus, DB } from "../main";
const { ipcRenderer } = window.require("electron");

export default {
    data() {
        return {
            video: "",
            filePath: "",
            uploadStatus: "",
            negativeWords: null,
            negativeWordsTitle: 0,
            negativeWordsDescription: 0
        };
    },
    beforeCreate() {
        EventBus.$on("loadVideoScreen", (videoID) => {
            this.loadData(videoID);
        });
    },
    created() {
        this.clearVideoScreen();

        EventBus.$on("clearVideo", this.clearVideoScreen);

        ipcRenderer.on("videoStatus", (status) => {
            this.uploadStatus = status;
        });

        ipcRenderer.on("videoUploaded", () => {
            this.toast("Video upload succesfull", 5);
        });

        ipcRenderer.on("videoUploadError", () => {
            this.toast("Video upload error", 5, "error");
        });

        DB.getNegativeWordsList().then((data) => {
            this.negativeWords = data;
        });
    },
    methods: {
        clearVideoScreen() {
            this.video = DB.getEmptyVideo();
            this.filePath = "";
        },
        loadData(videoID) {
            DB.getVideoByID(videoID)
                .then((video) => {
                    this.video = video;
                    if (typeof this.video.created === "undefined")
                        this.video.created = Date.now();
                    if (typeof this.video.status === "undefined")
                        this.video.status = 0;
                    if (typeof this.video.filePath === "undefined")
                        this.video.filePath = "";
                    if (typeof this.video.thumbnailPath === "undefined")
                        this.video.thumbnailPath = "";
                })
                .catch((err) => {
                    console.log(`Error loading the video data ${err}`);
                });
        },
        saveData() {
            DB.saveVideo(this.video);
        },
        uploadVideo() {
            // EventBus.$emit("uploadVideo", this.video);
            //window.ipcRenderer.send("upload", this.video);
            // ipcRenderer.send("upload", this.video);
            ipcRenderer.send("upload", this.video);
        },
        handleFileChange(e) {
            var file = e.target.files[0];

            if (file.type === "video/mp4") {
                this.filePath = file.path;
                this.video.filePath = file.path;
                console.log(this.filePath);
            } else {
                //e.target.value = "";
            }
            // const { dialog } = require("electron");
            // console.log(dialog.showOpenDialog({ properties: ["openFile"] }));
        },
        handleThumbnailChange(e) {
            var file = e.target.files[0];

            console.log(file);

            if (file.type === "image/jpeg" || file.type === "image/png") {
                this.filePath = file.path;
                this.video.thumbnailPath = file.path;
                console.log(this.video);
            } else {
                //e.target.value = "";
            }
            // const { dialog } = require("electron");
            // console.log(dialog.showOpenDialog({ properties: ["openFile"] }));
        },
        copyToClipboard(id) {
            const copySelection = ["title", "description", "tags"];

            let testingCodeToCopy = document.querySelector(
                `#video-${copySelection[id]}-copy`
            );
            testingCodeToCopy.setAttribute("type", "text"); // hidden
            testingCodeToCopy.select();

            try {
                document.execCommand("copy");
                //var successful = document.execCommand("copy");
                //var msg = successful ? "successful" : "unsuccessful";
                //alert("Testing code was copied " + msg);

                this.toast(`Copy of ${copySelection[id]} succesfull`, 1);
            } catch (err) {
                //alert("Oops, unable to copy");
            }

            /* unselect the range */
            testingCodeToCopy.setAttribute("type", "hidden");
            window.getSelection().removeAllRanges();
        },
        checkForBadWords() {
            // console.log(this.negativeWords);

            if (this.negativeWords === null) {
                console.log("Error. Word list empty");
            } else {
                var title = this.video.title
                    .toLowerCase()
                    .replace(/\n/g, " ")
                    .split(" ");
                var description = this.video.description
                    .toLowerCase()
                    .replace(/\n/g, " ")
                    .split(" ");

                console.log(
                    `Title: ${title.length}, Desc: ${description.length}`
                );

                this.negativeWordsTitle = 0;
                this.negativeWordsDescription = 0;

                if (this.video.title.length > 0) {
                    title.forEach((element) => {
                        if (this.negativeWords.includes(element)) {
                            this.negativeWordsTitle++;
                        }
                    });
                }

                if (this.video.description.length > 0) {
                    description.forEach((element) => {
                        if (this.negativeWords.includes(element)) {
                            this.negativeWordsDescription++;
                        }
                    });
                }
            }
        }
    }
};
</script>