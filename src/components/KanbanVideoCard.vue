<template>
    <div class="bg-white shadow rounded-lg pt-3 pb-3">
        <div class="col-12">
            <b>{{ video.title }}</b
            ><br />
            {{ truncateString(video.description, 15) }}
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
