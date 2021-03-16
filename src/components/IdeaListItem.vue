<template>
    <div
        @mouseover="hovered = true"
        @mouseleave="hovered = false"
        class="col-12 shadow-sm rounded p-2 text-left"
    >
        <div class="row align-items-center">
            <div class="col-10">
                {{ idea.idea }}
            </div>
            <div class="col-2">
                <button v-if="hovered" class="btn btn-danger mr-2">
                    <font-awesome-icon icon="trash" />
                </button>

                <button v-if="hovered" class="btn btn-primary">Vid</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ["idea"],
    data() {
        return {
            hovered: false
        };
    }
};
</script>