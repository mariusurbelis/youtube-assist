<template>
    <div class="container text-left">
        <div class="row">
            <div class="col-12">
                <h3>Title: {{ video.title }}</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-6">
                Description:<br />{{ truncateString(video.description, 50) }}
            </div>
            <div class="col-6">
                Tags:<br />{{ truncateString(video.tags, 50) }}
            </div>
        </div>
        <div class="row mt-3">
            <div class="col-6">
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
            <div class="col-6">
                Created:<br />{{ timeConverter(video.created) }}
            </div>
            <div class="col-6">
                Status:<br />{{ videoStatus(video.status) }}
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