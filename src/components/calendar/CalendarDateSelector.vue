<template>
    <div class="calendar-date-selector">
        <span class="rounded" @click="selectPrevious">
            <font-awesome-icon icon="angle-left" />
            <font-awesome-icon class="ml-2" icon="calendar-minus" />
        </span>
        <span class="rounded" @click="selectCurrent"
            >Today <font-awesome-icon icon="calendar-day"
        /></span>
        <span class="rounded" @click="selectNext">
            <font-awesome-icon icon="calendar-plus" />
            <font-awesome-icon class="ml-2" icon="angle-right" />
        </span>
    </div>
</template>

<script>
import dayjs from "dayjs";

export default {
    name: "CalendarModeSelector",

    props: {
        currentDate: {
            type: String,
            required: true
        },

        selectedDate: {
            type: Object,
            required: true
        }
    },

    methods: {
        selectPrevious() {
            let newSelectedDate = dayjs(this.selectedDate).subtract(1, "month");
            this.$emit("dateSelected", newSelectedDate);
        },

        selectCurrent() {
            let newSelectedDate = dayjs(this.currentDate);
            this.$emit("dateSelected", newSelectedDate);
        },

        selectNext() {
            let newSelectedDate = dayjs(this.selectedDate).add(1, "month");
            this.$emit("dateSelected", newSelectedDate);
        }
    }
};
</script>

<style scoped>
.calendar-date-selector {
    display: flex;
    justify-content: space-between;
}

.calendar-date-selector > * {
    cursor: pointer;
    user-select: none;
}

span {
    border: 1px gray solid;
    padding: 0.5em;
}
</style>
