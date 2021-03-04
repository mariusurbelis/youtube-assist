<template>
    <div v-if="defined" class="container p-0">
        <div class="row">
            <div class="col-12 shadow-sm p-1 mb-2">Scheduled</div>
        </div>

        <div class="bg-white shadow-sm p-4">
            <div class="row">
                <div class="col-12 p-2">
                    <div>
                        {{ truncateString(videos.snippet.title, 32) }}
                    </div>
                </div>
            </div>
            <div class="row mt-3">
                <div class="col-12">
                    <img
                        width="100%"
                        :src="videos.snippet.thumbnails.medium.url"
                    />
                </div>
            </div>
        </div>
    </div>
    <div v-else class="container p-0">No scheduled videos</div>
</template>

<script>
import { DB } from "../main";

export default {
    data() {
        return {
            videos: null,
            defined: false
        };
    },
    created() {
        DB.loadDataFromFile(`${DB.apiDataFolder}/scheduled.json`).then(
            (loadedData) => {
                this.videos = loadedData;

                if (loadedData[0] !== undefined) {
                    this.defined = true;
                }
            }
        );
    }
};
</script>