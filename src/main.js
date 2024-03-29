import Vue from "vue";
import BootstrapVue from "bootstrap-vue/dist/bootstrap-vue.esm";
import App from "./App.vue";
import DatabaseManager from "./classes/DatabaseManager";

Vue.config.productionTip = false;

export const EventBus = new Vue(); // added line
const DB = new DatabaseManager();
const VideoStatus = ["Idea", "In Progress", "Scheduled", "Published"];
export {
    DB,
    VideoStatus
};
DB.initializeFolders();

// Import the styles directly. (Or you could add them via script tags.)
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);

import {
    library
} from '@fortawesome/fontawesome-svg-core'
import {
    faTrash,
    faSave,
    faCloudUploadAlt,
    faPhotoVideo,
    faAngleLeft,
    faAngleRight,
    faExternalLinkAlt,
    faPlus,
    faList,
    faHome,
    faColumns,
    faCalendarDay,
    faLightbulb,
    faCalendarPlus,
    faCalendarMinus,
    faLongArrowAltRight
} from '@fortawesome/free-solid-svg-icons'
import {
    FontAwesomeIcon
} from '@fortawesome/vue-fontawesome'

library.add(
    faTrash, faSave, faCloudUploadAlt,
    faPhotoVideo, faAngleLeft, faAngleRight,
    faExternalLinkAlt, faPlus, faList,
    faHome, faColumns, faCalendarDay,
    faLightbulb, faCalendarPlus, faCalendarMinus,
    faLongArrowAltRight, faPhotoVideo
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

import VueToast from 'vue-toast-notification';
// Import one of the available themes
//import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-sugar.css';

Vue.use(VueToast);

new Vue({
    render: h => h(App)
}).$mount("#app");

// Required for authentication
require("./classes/YouTubeAPI");

// GLOBAL METHODS
Vue.mixin({
    methods: {
        videoStatus(id) {
            return VideoStatus[id];
        },
        timeConverter(timestamp) {
            var a = new Date(timestamp);
            var months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
            ];
            var year = a.getFullYear();
            var month = months[a.getMonth()];
            var date = a.getDate();
            var hour = a.getHours();
            var min = a.getMinutes();
            var sec = a.getSeconds();
            var time =
                date +
                " " +
                month +
                " " +
                year +
                " " +
                ("0" + hour).slice(-2) +
                ":" +
                ("0" + min).slice(-2) +
                ":" +
                ("0" + sec).slice(-2);
            return time;
        },
        truncateString(str, num) {
            if (str.length <= num) {
                return str;
            }
            return str.slice(0, num) + "...";
        },
        toast(toastMessage, toastTimeout, type) {
            let instance = this.$toast.open({
                message: toastMessage,
                type: (type) ? type : "success"
            });

            setTimeout(() => {
                instance.dismiss();
            }, (toastTimeout) ? toastTimeout * 1000 : 3000);
        }
    }
});