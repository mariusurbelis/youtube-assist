<template>
    <div class="container">
        <div class="row">
            <div class="shadow p-4 col-12 mb-5 rounded-lg">
                <h1>Dashboard</h1>
            </div>
        </div>

        <div class="row mb-5">
            <div class="col-6">
                <StatsOverview class="p-3 shadow rounded-lg" />
            </div>
            <div class="col-6">
                <ClosestScheduledVideo class="p-4 shadow rounded-lg" />
            </div>
        </div>

        <div class="row">
            <div class="col-12">
                <LastVideos class="p-4 shadow rounded-lg" />
            </div>
        </div>
    </div>
</template>

<script>
import StatsOverview from "./StatsOverview";
import ClosestScheduledVideo from "./ClosestScheduledVideo";
import LastVideos from "./LastVideos";

export default {
    name: "App",
    components: {
        StatsOverview,
        ClosestScheduledVideo,
        LastVideos
    }
};
</script>