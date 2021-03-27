<template>
    <div class="container text-left">
        <div class="row">
            <div class="col-12">
                <h3>{{ video.title }}</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-7">
                Description:<br />{{ truncateString(video.description, 50) }}
            </div>
            <div class="col-4">
                Tags:<br />{{ truncateString(video.tags, 50) }}
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-12">
                Created: {{ timeConverter(video.created) }}
            </div>
            <div class="col-12">Status: {{ videoStatus(video.status) }}</div>
            <div class="col-12 text-right mt-2">
                <button
                    v-on:click="loadVideo(video.id)"
                    class="btn btn-primary"
                >
                    <font-awesome-icon icon="external-link-alt" />
                </button>
                <button
                    v-on:click="deleteVideo(video.id)"
                    class="btn btn-danger ml-2"
                >
                    <font-awesome-icon icon="trash" />
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus } from "../main";
import { DB } from "../main";

export default {
    props: ["video"],
    methods: {
        loadSingleVideo() {
            EventBus.$emit("loadVideoScreen");
        },
        loadVideo: function (videoID) {
            EventBus.$emit("loadVideoScreen", videoID);
        },
        deleteVideo: function (videoID) {
            DB.deleteVideoByID(videoID).then(() => {
                EventBus.$emit("loadVideoList");
            });
        }
    }
};
</script>