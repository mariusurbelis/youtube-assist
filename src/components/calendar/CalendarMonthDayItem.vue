<template>
    <li
        class="calendar-day"
        :class="{
            'calendar-day--not-current': !day.isCurrentMonth,
            'calendar-day--today': isToday
        }"
    >
        <span>{{ label }}</span>

        <div v-if="video" class="shadow-sm rounded-lg">
            <div class="row mt-3">
                <div class="col-12">
                    <img
                        width="100%"
                        :src="video.snippet.thumbnails.medium.url"
                    />
                </div>
            </div>
            <div class="row align-items-center pr-2 pl-2 pt-1 pb-1" style="font-size: 0.7em">
                <div class="col-8 text-left">
                    {{ truncateString(video.snippet.title, 20) }}
                </div>
                <div class="col-4 text-right">
                    {{ video.statistics.viewCount }}
                </div>
            </div>
        </div>
        <div v-else>
            <div v-if="isToday">
                No video yet
            </div>
        </div>
    </li>
</template>

<script>
import dayjs from "dayjs";
import { DB } from "../../main";

export default {
    name: "CalendarMonthDayItem",

    data() {
        return {
            video: null,
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
        this.getVideoOfDay();
    },

    methods: {
        getVideoOfDay() {
            DB.getVideoByDate(this.day.date).then((returnedVideo) => {
                this.video = returnedVideo;
            });
        }
    }
};
</script>

<style scoped>
.calendar-day {
    position: relative;
    min-height: 100px;
    font-size: 16px;
    background-color: #fff;
    color: var(--grey-800);
    padding: 5px;
}

.calendar-day > span {
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    /* right: 2px; */
    width: var(--day-label-size);
    height: var(--day-label-size);
}

.calendar-day--not-current {
    background-color: var(--grey-100);
    color: var(--grey-300);
}

.calendar-day--today {
    padding-top: 4px;
}

.calendar-day--today > span {
    color: #fff;
    /* border-radius: 9999px; */
    background: gray;
    padding-left: 5px;
    padding-right: 5px;
    margin-top: 1px;
}
</style>
