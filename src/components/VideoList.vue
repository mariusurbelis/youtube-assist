
<template>
    <div class="container mb-5">
        <div class="row">
            <div class="col-12 shadow p-4 rounded-lg">
                <h1>Video List</h1>
            </div>
        </div>

        <div v-for="video in videos" v-bind:key="video.title">
            <VideoListItem
                class="shadow p-4 mt-4 rounded-lg"
                v-bind:title="video.title"
                v-bind:description="video.description"
                v-bind:tags="video.tags"
                v-bind:id="video.id"
                v-bind:video="video"
            />
        </div>
    </div>
</template>

<script>
import VideoListItem from "../components/VideoListItem";
import { EventBus } from "../main";
import { DB } from "../main";

export default {
    data() {
        return {
            videos: null
        };
    },
    beforeCreate() {
        EventBus.$on("loadVideoList", () => {
            this.loadVideoList();
        });
    },
    components: {
        VideoListItem
    },
    created() {
        this.loadVideoList();
    },
    methods: {
        loadVideoList() {
            this.videos = DB.getAllVideos();
        },
        loadSingleVideo() {
            EventBus.$emit("loadVideoScreen");
        }
    }
};
</script>