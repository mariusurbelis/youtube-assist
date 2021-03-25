<template>
    <div class="container justify-center shadow pt-5 pb-5">
        <div class="row">
            <div v-for="column in columns" :key="column.status" class="col-4">
                <h2>
                    <p>{{ videoStatus(column.status) }}</p>
                </h2>

                <draggable
                    v-if="column.status !== 0"
                    :list="column.videos"
                    :animation="200"
                    ghost-class="ghost-card"
                    group="videos"
                    @end="saveVideos"
                >
                    <!-- v-if="typeof video.status" -->
                    <div v-for="video in column.videos" :key="video.id">
                        <KanbanVideoCard
                            :video="video"
                            class="mt-3 cursor-move"
                        />
                    </div>
                </draggable>

                <draggable
                    v-else
                    :list="column.videos"
                    :animation="200"
                    ghost-class="ghost-card"
                    group="videos"
                    @end="convertToVideo"
                >
                    <div
                        v-for="video in column.videos"
                        :key="video.idea"
                        class="mt-3 cursor-move pt-3 pb-3 shadow rounded-lg"
                    >
                        {{ video.idea }}
                    </div>
                </draggable>
            </div>
        </div>
    </div>
</template>

<script>
import draggable from "vuedraggable";
import KanbanVideoCard from "./KanbanVideoCard";
// import VideoListItem from "./VideoListItem";
import { EventBus, DB } from "../main";

export default {
    name: "Kanban",
    components: {
        KanbanVideoCard,
        // VideoListItem,
        draggable
    },
    data() {
        return {
            columns: [
                {
                    status: 0,
                    videos: null
                },
                {
                    status: 1,
                    videos: null
                },
                {
                    status: 2,
                    videos: null
                }
            ]
        };
    },
    created() {
        // TODO: doesn't reload when opened
        this.loadVideoList();

        EventBus.$on("reloadData", this.loadVideoList);
    },
    methods: {
        loadVideoList() {
            // this.columns[0].videos = DB.getAllVideosOfStatus(0);

            DB.loadIdeas().then((loadedIdeas) => {
                this.columns[0].videos = loadedIdeas;
            });

            this.columns[1].videos = DB.getAllVideosOfStatus(1);
            this.columns[2].videos = DB.getAllVideosOfStatus(2);
            //this.videos1 = DB.getAllVideosOfStatus(1);
        },
        saveVideos() {
            for (var i = 1; i < 3; i++) {
                this.columns[i].videos.forEach((videoElement) => {
                    videoElement.status = i;
                    DB.saveVideo(videoElement);
                });
            }
        },
        convertToVideo() {
            for (var i = 1; i < 3; i++) {
                this.columns[i].videos.forEach((videoElement) => {
                    if (typeof videoElement.status === "undefined")
                        DB.convertIdeaToVideo(videoElement, i);

                    // videoElement.status = i;
                    // DB.saveVideo(videoElement);
                });
            }
        }
    }
};
</script>

<style scoped>
/* Unfortunately @apply cannot be setup in codesandbox, 
but you'd use "@apply border opacity-50 border-blue-500 bg-gray-200" here */
.ghost-card {
    opacity: 0.5;
    background: #f7fafc;
    border: 1px solid #4299e1;
}
</style>
