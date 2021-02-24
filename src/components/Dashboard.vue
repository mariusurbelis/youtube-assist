<template>
    <div class="container">
        <div class="row">
            <div class="shadow p-4 col-12 mb-5" style="border: 2px black solid">
                <h1>Dashboard</h1>
            </div>
        </div>

        <div class="row">
            <div class="col-6">
                <StatsOverview
                    class="p-3 shadow"
                    style="border: 2px black solid"
                />
            </div>
            <div class="col-6">
                <ClosestScheduledVideo
                    class="p-4 shadow"
                    style="border: 2px black solid"
                />
            </div>
        </div>
    </div>
</template>

<script>
import StatsOverview from "./StatsOverview";
import ClosestScheduledVideo from "./ClosestScheduledVideo";

export default {
    name: "App",
    components: {
        StatsOverview,
        ClosestScheduledVideo
    }
};
</script>