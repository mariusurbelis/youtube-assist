<template>
    <div class="container">
        <div class="row text-center">
            <div class="col-4">
                <div class="row">
                    <div class="col-12 statsName">Subscribers</div>
                </div>
                <div class="row">
                    <div class="col-12 statsNumber">{{ subscriberCount }}</div>
                </div>
            </div>

            <div class="col-4">
                <div class="row">
                    <div class="col-12 statsName">Views</div>
                </div>
                <div class="row">
                    <div class="col-12 statsNumber">{{ viewCount }}</div>
                </div>
            </div>

            <div class="col-4">
                <div class="row">
                    <div class="col-12 statsName">Videos</div>
                </div>
                <div class="row">
                    <div class="col-12 statsNumber">{{ videoCount }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus, DB } from "../main";

export default {
    data() {
        return {
            stats: "",
            subscriberCount: "",
            videoCount: "",
            viewCount: ""
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
        loadData() {
            DB.loadDataFromFile(`${DB.apiDataFolder}/channel_data.json`).then(
                (loadedData) => {
                    this.stats = loadedData;
                    this.subscriberCount = this.stats.statistics.subscriberCount;
                    this.videoCount = this.stats.statistics.videoCount;
                    this.viewCount = this.stats.statistics.viewCount;
                    // console.log(`Loading stats`);
                }
            );
        }
    }
};
</script>

<style>
.statsName {
    text-transform: uppercase;
    font-size: 0.8em;
}

.statsNumber {
    font-weight: bold;
    font-size: 2em;
}
</style>