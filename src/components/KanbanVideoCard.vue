<template>
    <div
        v-if="typeof video.status !== `undefined`"
        class="bg-white shadow rounded-lg pt-3 pb-3"
    >
        <div class="col-12">
            <b>{{ video.title }}</b
            ><br />
            {{ truncateString(video.description, 36) }}
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
