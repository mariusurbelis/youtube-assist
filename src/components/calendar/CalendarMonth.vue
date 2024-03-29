<template>
    <div class="calendar-month container">
        <div class="calendar-month-header row justify-content-center">
            <CalendarDateIndicator
                :selected-date="selectedDate"
                class="calendar-month-header-selected-month col-12"
            />

            <CalendarDateSelector
                class="col-6 mt-2"
                :current-date="today"
                :selected-date="selectedDate"
                @dateSelected="selectDate"
            />
        </div>

        <div class="row mt-4">
            <div class="col-12">
                <CalendarWeekdays />
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <ol style="border: 1px solid gray" class="days-grid p-0">
                    <CalendarMonthDayItem
                        style="border: 1px solid gray"
                        v-for="day in days"
                        :key="day.date"
                        :day="day"
                        :is-today="day.date === today"
                    />
                </ol>
            </div>
        </div>
    </div>
</template>

<script>
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import CalendarMonthDayItem from "./CalendarMonthDayItem";
import CalendarDateIndicator from "./CalendarDateIndicator";
import CalendarDateSelector from "./CalendarDateSelector";
import CalendarWeekdays from "./CalendarWeekdays";

dayjs.extend(weekday);
dayjs.extend(weekOfYear);

export default {
    name: "CalendarMonth",

    components: {
        CalendarMonthDayItem,
        CalendarDateIndicator,
        CalendarDateSelector,
        CalendarWeekdays
    },

    data() {
        return {
            selectedDate: dayjs()
        };
    },

    computed: {
        days() {
            return [
                ...this.previousMonthDays,
                ...this.currentMonthDays,
                ...this.nextMonthDays
            ];
        },

        today() {
            return dayjs().format("YYYY-MM-DD");
        },

        month() {
            return Number(this.selectedDate.format("M"));
        },

        year() {
            return Number(this.selectedDate.format("YYYY"));
        },

        numberOfDaysInMonth() {
            return dayjs(this.selectedDate).daysInMonth();
        },

        currentMonthDays() {
            return [...Array(this.numberOfDaysInMonth)].map((day, index) => {
                return {
                    date: dayjs(
                        `${this.year}-${this.month}-${index + 1}`
                    ).format("YYYY-MM-DD"),
                    isCurrentMonth: true
                };
            });
        },

        previousMonthDays() {
            const firstDayOfTheMonthWeekday = this.getWeekday(
                this.currentMonthDays[0].date
            );
            const previousMonth = dayjs(
                `${this.year}-${this.month}-01`
            ).subtract(1, "month");

            // Cover first day of the month being sunday (firstDayOfTheMonthWeekday === 0)
            const visibleNumberOfDaysFromPreviousMonth = firstDayOfTheMonthWeekday
                ? firstDayOfTheMonthWeekday - 1
                : 6;

            const previousMonthLastMondayDayOfMonth = dayjs(
                this.currentMonthDays[0].date
            )
                .subtract(visibleNumberOfDaysFromPreviousMonth, "day")
                .date();

            return [...Array(visibleNumberOfDaysFromPreviousMonth)].map(
                (day, index) => {
                    return {
                        date: dayjs(
                            `${previousMonth.year()}-${
                                previousMonth.month() + 1
                            }-${previousMonthLastMondayDayOfMonth + index}`
                        ).format("YYYY-MM-DD"),
                        isCurrentMonth: false
                    };
                }
            );
        },

        nextMonthDays() {
            const lastDayOfTheMonthWeekday = this.getWeekday(
                `${this.year}-${this.month}-${this.currentMonthDays.length}`
            );

            const nextMonth = dayjs(`${this.year}-${this.month}-01`).add(
                1,
                "month"
            );

            const visibleNumberOfDaysFromNextMonth = lastDayOfTheMonthWeekday
                ? 7 - lastDayOfTheMonthWeekday
                : lastDayOfTheMonthWeekday;

            return [...Array(visibleNumberOfDaysFromNextMonth)].map(
                (day, index) => {
                    return {
                        date: dayjs(
                            `${nextMonth.year()}-${nextMonth.month() + 1}-${
                                index + 1
                            }`
                        ).format("YYYY-MM-DD"),
                        isCurrentMonth: false
                    };
                }
            );
        }
    },

    methods: {
        getWeekday(date) {
            return dayjs(date).weekday();
        },

        selectDate(newSelectedDate) {
            this.selectedDate = newSelectedDate;
        }
    }
};
</script>

<style scoped>
.calendar-month {
    position: relative;
}

.day-of-week {
    font-size: 18px;
    background-color: #fff;
    padding-bottom: 5px;
    padding-top: 10px;
}

.day-of-week,
.days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
}

.day-of-week > * {
    text-align: right;
    padding-right: 5px;
}

.days-grid {
    height: 100%;
    position: relative;
}

ol li {
    list-style-type: none;
}
</style>
