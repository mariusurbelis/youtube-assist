<template>
    <div class="container shadow-sm p-5">
        <div class="row mb-5">
            <div class="col-12"><h1>Single Video Page</h1></div>
        </div>

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
            <div class="text-left col-12">
                <p>ID: {{ video.id }}</p>
                <p v-if="timeConverter">
                    Created: {{ timeConverter(video.created) }}
                </p>

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
            <div v-if="video.filePath" class="col-6">{{ video.filePath }}</div>
            <div v-if="video.thumbnailPath" class="col-6">
                {{ video.thumbnailPath }}
            </div>
        </div>
        <img :src="video.thumbnailPath" style="width: 100%" />

        <div class="row">
            <div class="col-6">
                <button
                    class="btn btn-secondary"
                    onclick="document.getElementById('chooseVideoFile').click()"
                >
                    Select video file
                </button>
            </div>
            <div class="col-6">
                <button
                    class="btn btn-secondary"
                    onclick="document.getElementById('chooseThumbnailFile').click()"
                >
                    Select thumbnail
                </button>
            </div>
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

        <div class="row mt-3">
            <div class="col-12">
                <button class="btn btn-primary col-4" v-on:click="saveData">
                    <font-awesome-icon icon="save" />
                    Save
                </button>
            </div>
        </div>

        <div class="row mt-3">
            <div class="col-12">
                <button class="btn btn-danger col-4" v-on:click="uploadVideo">
                    <font-awesome-icon icon="cloud-upload-alt" />
                    Upload Video
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus, DB } from "../main";

export default {
    data() {
        return {
            video: "",
            filePath: ""
        };
    },
    beforeCreate() {
        EventBus.$on("loadVideoScreen", (videoID) => {
            this.loadData(videoID);
        });

        EventBus.$on("clearVideo", this.clearVideoScreen);

        console.log("VideoScreen initialized");
    },
    created() {
        this.clearVideoScreen();
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
            EventBus.$emit("uploadVideo", this.video);
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
                let instance = this.$toast.open(
                    `Copy of ${copySelection[id]} succesfull`
                );
                setTimeout(() => {
                    instance.dismiss();
                }, 1000);
            } catch (err) {
                //alert("Oops, unable to copy");
            }

            /* unselect the range */
            testingCodeToCopy.setAttribute("type", "hidden");
            window.getSelection().removeAllRanges();
        }
    }
};
</script>