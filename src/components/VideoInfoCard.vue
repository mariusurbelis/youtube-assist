<template>
    <div class="bg-white shadow-sm rounded-lg p-4">
        <div class="row">
            <div
                style="
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    -webkit-line-clamp: 1;
                    overflow: hidden;
                "
                class="col-12 shadow-sm p-2"
            >
                <div>{{ video.snippet.title }}</div>
            </div>
        </div>

        <div class="row justify-content-center mt-3">
            <div class="col-3 shadow-sm rounded">
                <div class="row p-1">
                    <div class="col-12">
                        {{ video.statistics.viewCount }}
                    </div>
                </div>
            </div>

            <div class="col-3 offset-1 shadow-sm rounded">
                <div class="row p-1">
                    <div class="col-6">
                        <svg
                            viewBox="0 0 24 24"
                            focusable="false"
                            style="
                                pointer-events: none;
                                display: block;
                                width: 1em;
                                height: 100%;
                            "
                        >
                            <g>
                                <path
                                    d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"
                                ></path>
                            </g>
                        </svg>
                    </div>
                    <div class="col-6">{{ video.statistics.likeCount }}</div>
                </div>
            </div>
            <div class="col-3 offset-1 shadow-sm rounded">
                <div class="row p-1">
                    <div class="col-6">
                        <svg
                            viewBox="0 0 24 24"
                            focusable="false"
                            style="
                                pointer-events: none;
                                display: block;
                                width: 1em;
                                height: 100%;
                            "
                        >
                            <g>
                                <path
                                    d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"
                                ></path>
                            </g>
                        </svg>
                    </div>
                    <div class="col-6">{{ video.statistics.dislikeCount }}</div>
                </div>
            </div>
        </div>

        <div class="row mt-3">
            <div class="col-12">
                <img
                    class="shadow-sm"
                    width="100%"
                    :src="video.snippet.thumbnails.medium.url"
                />
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
