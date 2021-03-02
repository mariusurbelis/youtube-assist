<template>
    <div class="container">
        <div class="row mb-4">
            <div class="col-12">Latest published videos</div>
        </div>

        <div class="row text-center">
            <div
                class="col-4 mb-3"
                v-for="video in videos"
                v-bind:key="video.id"
            >
                <VideoInfoCard :video="video" />
            </div>
        </div>
    </div>
</template>

<script>
import { DB } from "../main";
import VideoInfoCard from "./VideoInfoCard";

export default {
    components: {
        VideoInfoCard
    },
    data() {
        return {
            videos: null
        };
    },
    beforeCreate() {
        this.stats = { id: "" };
    },
    created() {
        DB.loadDataFromFile(`${DB.apiDataFolder}/latest.json`).then(
            (loadedData) => {
                this.videos = loadedData;
            }
        );
    }
};
</script>