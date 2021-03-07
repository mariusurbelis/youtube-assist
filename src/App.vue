<template>
    <div id="app">
        <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
        <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
        <!-- <Dashboard /> -->
        <keep-alive>
            <component v-if="!authcomponent" v-bind:is="component" />
        </keep-alive>

        <component v-bind:is="authcomponent" />

        <div
            class="fixed-bottom row text-center justify-content-center"
            style="height: 4em"
        >
            <button class="col-3" v-on:click="openDashboardScreen">
                Dashboard
            </button>
            <button class="col-3" v-on:click="openNewVideoScreen">
                New Video
            </button>
            <button class="col-3" v-on:click="openKanbanScreen">Kanban</button>
            <button class="col-3" v-on:click="openVideoListScreen">
                Video List
            </button>
        </div>
    </div>
</template>

<script>
import Dashboard from "./components/Dashboard";
import VideoList from "./components/VideoList";
import VideoScreen from "./components/VideoScreen";
import DatabaseManager from "./classes/DatabaseManager";
import AuthScreen from "./components/AuthScreen";
import { EventBus } from "./main";
import Kanban from "./components/Kanban.vue";

require("./classes/YouTubeAPI");

export default {
    name: "App",
    components: {
        Dashboard,
        VideoList,
        VideoScreen,
        AuthScreen,
        DatabaseManager,
        Kanban
    },
    data() {
        return {
            component: "Dashboard",
            authcomponent: "AuthScreen"
        };
    },
    beforeCreate: function () {
        EventBus.$on("loadVideoScreen", () => {
            this.openVideoScreen();
        });

        EventBus.$on("authSuccess", () => {
            this.authcomponent = null;
        });
    },
    created() {
        this.initializeComponents();
    },
    methods: {
        openVideoListScreen() {
            this.component = VideoList;
            EventBus.$emit("loadVideoList");
        },
        openVideoScreen() {
            this.component = VideoScreen;
        },
        openKanbanScreen() {
            this.component = Kanban;
        },
        openNewVideoScreen() {
            this.component = VideoScreen;
            EventBus.$emit("clearVideo");
        },
        openDashboardScreen() {
            this.component = Dashboard;
            EventBus.$emit("reloadData");
        },
        initializeComponents() { // components do not get initialized
            this.$nextTick(() => {
                this.component = VideoList;
                this.$nextTick(() => {
                    this.component = VideoScreen;
                    this.$nextTick(() => {
                        this.component = Dashboard;
                    });
                });
            });
        }
    }
};
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

body {
    padding-bottom: 70px;
}
</style>
