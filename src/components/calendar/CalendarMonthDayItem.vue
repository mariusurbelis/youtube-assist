<template>
    <li
        class="calendar-day"
        :class="{
            'calendar-day--not-current': !day.isCurrentMonth,
            'calendar-day--today': isToday,
            'calendar-day--today--video': videos && isToday
        }"
    >
        <span>{{ label }}</span>

        <div v-if="videos">
            <div
                v-for="video in videos"
                v-bind:key="video.title"
                class="shadow-sm rounded-lg"
            >
                <div class="row mt-3">
                    <div class="col-12">
                        <img
                            width="100%"
                            :src="video.snippet.thumbnails.medium.url"
                        />
                    </div>
                </div>
                <div
                    class="row align-items-center pr-2 pl-2 pt-1 pb-1"
                    style="font-size: 0.7em"
                >
                    <div
                        style="
                            display: -webkit-box;
                            -webkit-box-orient: vertical;
                            -webkit-line-clamp: 2;
                            overflow: hidden;
                        "
                        class="col-8 text-left"
                    >
                        {{ video.snippet.title }}
                    </div>
                    <div class="col-4 text-right">
                        {{ video.statistics.viewCount }}
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div v-if="isToday">No video yet</div>
        </div>
    </li>
</template>

<script>
import dayjs from "dayjs";
import { EventBus, DB } from "../../main";

export default {
    name: "CalendarMonthDayItem",

    data() {
        return {
            videos: null,
            title: ""
        };
    },

    props: {
        day: {
            type: Object,
            required: true
        },

        isCurrentMonth: {
            type: Boolean,
            default: false
        },

        isToday: {
            type: Boolean,
            default: false
        }
    },

    computed: {
        label() {
            return dayjs(this.day.date).format("D");
        }
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
            DB.getVideoByDate(this.day.date).then((returnedVideos) => {
                if (returnedVideos.length > 0) this.videos = returnedVideos;
                // console.log("Loading calendar vid");
            });
        }
    }
};
</script>

<style scoped>
.calendar-day {
    position: relative;
    min-height: 100px;
    background-color: #fff;
    padding: 5px;
}

.calendar-day > span {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    /* right: 2px; */
}

.calendar-day--not-current {
    color: #aaaaaa;
    background-color: #dddddd;
}

.calendar-day--today {
    padding-top: 4px;
}

.calendar-day--today > span {
    color: #fff;
    /* border-radius: 9999px; */
    background: red;
    padding-left: 5px;
    padding-right: 5px;
    margin-top: 1px;
}

.calendar-day--today--video > span {
    color: #fff;
    /* border-radius: 9999px; */
    background: green;
    padding-left: 5px;
    padding-right: 5px;
    margin-top: 1px;
}
</style>
