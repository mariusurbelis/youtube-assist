<template>
    <div class="container">
        <div class="row mb-4 align-items-center">
            <div class="col-6 text-right">Latest published videos</div>
            <div class="col-6 text-left">
                <b-dropdown
                    id="dropdown-dropright"
                    dropright
                    :text="`Videos to show (${videoCount})`"
                    variant="primary"
                    class="m-2"
                >
                    <b-dropdown-item @click="setVideoCount(3)"
                        >3</b-dropdown-item
                    >
                    <b-dropdown-item @click="setVideoCount(6)"
                        >6</b-dropdown-item
                    >
                    <b-dropdown-item @click="setVideoCount(12)"
                        >12</b-dropdown-item
                    >
                </b-dropdown>
            </div>
        </div>

        <div v-if="videos" class="row text-center">
            <div
                class="col-4 mb-3"
                v-for="video in videos.slice(0, this.videoCount)"
                v-bind:key="video.id"
            >
                <VideoInfoCard :video="video" />
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus, DB } from "../main";
import VideoInfoCard from "./VideoInfoCard";

export default {
    components: {
        VideoInfoCard
    },
    data() {
        return {
            videos: null,
            videoCount: 3
        };
    },
    beforeCreate() {
        this.stats = { id: "" };
    },
    created() {
        this.loadData();

        EventBus.$on("reloadData", this.loadData);
    },

    beforeDestroy() {
        EventBus.$off("reloadData", this.loadData);
    },

    methods: {
        setVideoCount(count) {
            this.videoCount = count;
        },
        loadData() {
            DB.loadDataFromFile(`${DB.apiDataFolder}/latest.json`).then(
                (loadedData) => {
                    this.videos = loadedData;
                    // console.log("Loading last videos list");
                }
            );
        }
    }
};
</script>