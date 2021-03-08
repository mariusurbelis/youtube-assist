<template>
    <div v-if="videos" class="container p-0">
        <div class="row">
            <div class="col-12 shadow-sm p-1 mb-2">Scheduled</div>
        </div>

        <div class="bg-white shadow-sm p-4">
            <div class="row">
                <div class="col-12 p-2">
                    <div>
                        {{ truncateString(videos[0].snippet.title, 32) }}
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-12">
                    <img
                        width="100%"
                        :src="videos[0].snippet.thumbnails.medium.url"
                    />
                </div>
            </div>
        </div>
    </div>
    <div v-else class="container p-0">No scheduled videos</div>
</template>

<script>
import { EventBus, DB } from "../main";

export default {
    data() {
        return {
            videos: null,
            defined: false
        };
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
            DB.loadDataFromFile(`${DB.apiDataFolder}/scheduled.json`).then(
                (loadedData) => {
                    this.videos = loadedData;

                    console.log(`Loading VID ${this.videos}`);

                    if (this.videos !== undefined) {
                        this.defined = true;
                    }
                }
            );
        }
    }
};
</script>