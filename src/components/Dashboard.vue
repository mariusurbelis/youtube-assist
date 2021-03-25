<template>
    <div class="container mb-5">
        <div hidden class="row">
            <div class="shadow-sm p-4 col-12 mb-5 rounded-lg">
                <h1>Dashboard</h1>
            </div>
        </div>

        <div class="row mb-5">
            <div class="col-8">
                <StatsOverview class="p-3 shadow-sm rounded-lg" />
            </div>
            <div class="col-4">
                <ClosestScheduledVideo class="p-4 shadow-sm rounded-lg" />
            </div>
        </div>

        <div class="row mb-5">
            <div class="col-12">
                <IdeaRecord class="p-4 shadow-sm rounded-lg" />
            </div>
        </div>

        <div class="row mb-5">
            <div class="col-12">
                <CalendarMonth class="shadow-sm rounded-lg p-4" />
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <LastVideos class="p-4 shadow-sm rounded-lg" />
            </div>
        </div>
    </div>
</template>

<script>
import StatsOverview from "./StatsOverview";
import ClosestScheduledVideo from "./ClosestScheduledVideo";
import LastVideos from "./LastVideos";
import CalendarMonth from "./calendar/CalendarMonth";
import IdeaRecord from "./IdeaRecord";

export default {
    name: "App",
    components: {
        StatsOverview,
        ClosestScheduledVideo,
        LastVideos,
        CalendarMonth,
        IdeaRecord
    }
};
</script>