<template>
    <div class="container mt-5">
        <div class="row">
            <div class="col-12">YouTube API Auth</div>
        </div>

        <div v-if="!browseropened" class="row mt-2">
            <div class="col-12 text-center mt-2">
                <button v-on:click="startAuth()" class="btn btn-primary">
                    Open Browser (Auth)
                </button>
            </div>
        </div>

        <div v-if="browseropened" class="row mt-2">
            <div class="col-12">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">Code</span>
                    </div>
                    <textarea
                        style="height: 100%"
                        class="form-control"
                        rows="2"
                        aria-label="With textarea"
                        v-model="token"
                    ></textarea>
                </div>
            </div>

            <div class="col-12 text-center mt-2">
                <button v-on:click="authenticate()" class="btn btn-primary">
                    Auth
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import { EventBus } from "../main";

export default {
    data() {
        return {
            token: "",
            authurl: "",
            browseropened: false
        };
    },
    beforeCreate() {
        //this.loadVideoList();
        EventBus.$on("saveAuthURL", (url) => {
            this.authurl = url;
        });
    },
    methods: {
        authenticate() {
            if (this.token !== "") EventBus.$emit("authYouTubeAPI", this.token);
        },
        startAuth() {
            if (this.authurl !== "") {
                var shell = require("electron").shell;
                console.log(`Loading ${this.authurl}`);
                shell.openExternal(this.authurl);

                this.browseropened = true;
            }
        }
    }
};
</script>