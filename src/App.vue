<template>
    <div id="app">
        <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
        <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
        <!-- <Dashboard /> -->
        <keep-alive>
            <component v-if="!authcomponent" v-bind:is="component" />
        </keep-alive>

        <component v-bind:is="authcomponent" />

        <loading
            :active.sync="isLoading"
            :can-cancel="false"
            :is-full-page="fullPage"
            :background-color="`#efefef`"
            :opacity="1"
        ></loading>

        <div
            class="fixed-bottom row text-center justify-content-center p-3 bg-dark"
        >
            <button
                class="col-2 p-3 m-1 btn-light btn"
                v-on:click="openDashboardScreen"
            >
                Dashboard <font-awesome-icon icon="home" />
            </button>
            <button
                class="col-2 m-1 btn-light btn"
                v-on:click="openNewVideoScreen"
            >
                New Video <font-awesome-icon icon="plus" />
            </button>
            <button
                class="col-2 m-1 btn-light btn"
                v-on:click="openKanbanScreen"
            >
                Kanban <font-awesome-icon icon="columns" />
            </button>
            <button
                class="col-2 m-1 btn-light btn"
                v-on:click="openVideoListScreen"
            >
                Video List <font-awesome-icon icon="list" />
            </button>
            <button
                class="col-2 m-1 btn-light btn"
                v-on:click="openVideoManipulationScreen"
            >
                Video Converter <font-awesome-icon icon="photo-video" />
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
import VideoManipulation from "./components/VideoManipulation";

// Import loading component
import Loading from "vue-loading-overlay";
// Import loading stylesheet
import "vue-loading-overlay/dist/vue-loading.css";

export default {
    name: "App",
    components: {
        Dashboard,
        VideoList,
        VideoScreen,
        VideoManipulation,
        AuthScreen,
        DatabaseManager,
        Kanban,
        Loading
    },
    data() {
        return {
            component: "Dashboard",
            authcomponent: "AuthScreen",
            isLoading: true,
            fullPage: true
        };
    },
    beforeCreate: function () {
        EventBus.$on("loadVideoScreen", () => {
            this.openVideoScreen();
        });

        EventBus.$on("stopLoadingScreen", () => {
            this.isLoading = false;
        });

        EventBus.$on("authSuccess", () => {
            if (this.authcomponent) this.isLoading = true;
            this.authcomponent = null;
        });
    },
    created() {
        EventBus.$on("initializeScreens", this.initializeScreens);
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
        openVideoManipulationScreen() {
            this.component = VideoManipulation;
        },
        initializeScreens() {
            this.$nextTick(() => {
                this.openVideoScreen();
                this.$nextTick(() => {
                    this.openVideoListScreen();
                    this.$nextTick(() => {
                        this.openKanbanScreen();
                        this.$nextTick(() => {
                            this.component = Dashboard;
                            this.$nextTick(() => {
                                setTimeout(() => (this.isLoading = false), 500);
                                console.log(
                                    "Screens initialized and unsubscribed"
                                );
                                EventBus.$off(
                                    "initializeScreens",
                                    this.initializeScreens
                                );
                            });
                        });
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

::-webkit-scrollbar {
    background-color: #343a40;
    width: 0.8em;
}

::-webkit-scrollbar-thumb:window-inactive,
::-webkit-scrollbar-thumb {
    background: black;
}
</style>
