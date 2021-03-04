<template>
    <ol class="day-of-week p-0">
        <li v-for="weekday in weekdays" :key="weekday">{{ weekday }}</li>
    </ol>
</template>

<script>
const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default {
    name: "CalendarWeekdays",

    computed: {
        weekdays() {
            return WEEKDAYS;
        }
    }
};
</script>

<style scoped>
.day-of-week {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.day-of-week > * {
    text-align: center;
    padding-right: 5px;
}

ol li {
    list-style-type: none;
}
</style>
