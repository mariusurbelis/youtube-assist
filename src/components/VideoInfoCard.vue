<template>
    <div class="bg-white shadow rounded-lg p-4">
        <div class="row">
            <div class="col-12">
                <p>{{ video.snippet.title }}</p>
            </div>
        </div>
        <div class="row justify-content-center">
            <div class="col-4">V:{{ video.statistics.viewCount }}</div>
            <div class="col-4">
                {{ video.statistics.likeCount }}/{{
                    video.statistics.dislikeCount
                }}
            </div>
        </div>
        <div class="row">
            <div class="col-12">
                <img width="100%" :src="video.snippet.thumbnails.high.url" />
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        video: null
    }
};
</script>
