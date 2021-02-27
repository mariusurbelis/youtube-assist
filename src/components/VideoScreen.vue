<template>
    <div class="container">
        <div class="row mb-5">
            <div class="col-12"><h1>Single Video Page</h1></div>
        </div>

        <div class="row">
            <div class="col-12">
                <div class="input-group">
                    <div class="input-group-prepend">
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
                    <div class="input-group-prepend">
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
                    <div class="input-group-prepend">
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

        <div class="row mt-3">
            <div class="text-left col-12">
                <p>ID: {{ video.id }}</p>
                <p>Created: {{ timeConverter(video.created) }}</p>

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

        <div class="row mt-3">
            <div class="col-12">
                <button class="btn btn-primary col-4" v-on:click="saveData">Save</button>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus } from "../main";
import { DB } from "../main";

export default {
    data() {
        return {
            video: ""
        };
    },
    beforeCreate() {
        EventBus.$on("loadVideoScreen", (videoID) => {
            this.loadData(videoID);
        });

        EventBus.$on("clearVideo", () => {
            this.video = {
                id: 0,
                title: "",
                description: "",
                tags: "",
                status: 0,
                created: Date.now()
            };
        });
    },
    methods: {
        loadData(videoID) {
            DB.getVideoByID(videoID)
                .then((video) => {
                    this.video = video;
                    if (typeof this.video.created === 'undefined') this.video.created = Date.now();
                    if (typeof this.video.status === 'undefined') this.video.status = 0;
                })
                .catch((err) => {
                    console.log(`Error loading the video data ${err}`);
                });
        },
        saveData() {
            DB.saveVideo(this.video);
        }
    }
};
</script>