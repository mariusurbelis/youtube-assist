<template>
    <div class="container">
        <div class="row">
            <div class="col-10">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Idea</span>
                    </div>
                    <textarea
                        style="height: 100%"
                        class="form-control"
                        rows="1"
                        aria-label="With textarea"
                        v-model="idea"
                    ></textarea>
                </div>
            </div>

            <div class="col-2">
                <button class="btn btn-primary" v-on:click="saveIdea">
                    Save
                </button>
            </div>
        </div>

        <div v-for="i in ideas" v-bind:key="i.idea" class="row mt-2">
            <div class="col-12 shadow-sm rounded p-2 text-left">
                {{ i.idea }}
            </div>
        </div>
    </div>
</template>
<script>
import { DB } from "../main";

export default {
    data() {
        return {
            idea: "",
            ideas: null
        };
    },
    created() {
        this.loadIdeas();
    },
    methods: {
        saveIdea() {
            DB.saveIdea(this.idea);
            this.idea = "";
        },
        loadIdeas() {
            //this.idea = DB.loadIdeas();
            DB.loadIdeas().then((data) => {
                // console.log(data);
                this.ideas = data;
            });
        }
    }
};
</script>
