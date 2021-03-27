<template>
    <div class="container">
        <div class="row shadow p-5">
            <div class="col-12">
                <div class="row mb-5">
                    <div class="col-12">
                        <h1>Video/Audio Converter</h1>
                    </div>
                </div>

                <div class="row justify-content-center align-items-center">
                    <div class="col-5 p-4 shadow-sm">
                        <div class="row">
                            <div class="col-12 p-3 border">
                                <div v-if="filePath !== ''">
                                    {{ filePath.replace(/^.*[\\\/]/, "") }}
                                </div>
                                <div v-else>No file selected</div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-12">
                                <button
                                    class="btn btn-dark"
                                    onclick="document.getElementById('chooseFile').click()"
                                >
                                    Select a file
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="col-2">
                        <button @click="convert" class="btn btn-dark">
                            <font-awesome-icon icon="long-arrow-alt-right" />
                        </button>
                    </div>
                    <div class="col-5 p-4 shadow-sm">
                        <div class="row">
                            <div class="col-12 p-3 border">
                                <div v-if="fileDestination !== ''">
                                    {{
                                        fileDestination.replace(/^.*[\\\/]/, "")
                                    }}
                                    /
                                    <input
                                        type="text"
                                        v-model="newFileName"
                                        placeholder="Enter file name"
                                    />
                                    . {{ format }}
                                </div>
                                <div v-else>No destination selected</div>
                            </div>
                        </div>
                        <div class="row mt-3">
                            <div class="col-12">
                                <button
                                    @click="selectFileDestination"
                                    class="btn btn-dark"
                                >
                                    Select destination
                                </button>
                                <b-dropdown
                                    id="dropdown-dropright"
                                    dropright
                                    :text="`${format}`"
                                    variant="dark"
                                    class="ml-2"
                                >
                                    <b-dropdown-item @click="format = 'mp4'"
                                        >mp4</b-dropdown-item
                                    >
                                    <b-dropdown-item @click="format = 'mp3'"
                                        >mp3</b-dropdown-item
                                    >
                                </b-dropdown>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="progress" class="row shadow p-5 mt-5">
            <div v-if="progress.progress < 1" class="col-12">
                File conversion in progress
            </div>
            <div v-else class="col-12">File conversion done</div>
            <div v-if="progress.progress < 1" class="col-12">
                Progress: {{ Math.round(progress.progress * 100) }}%
            </div>
        </div>

        <input
            type="file"
            id="chooseFile"
            @change="handleFileChange"
            style="display: none"
        />
    </div>
</template>
<script>
const { ipcRenderer } = window.require("electron");

export default {
    data() {
        return {
            filePath: "",
            newFileName: "",
            fileDestination: "",
            format: "mp4",
            progress: null
        };
    },
    created() {
        ipcRenderer.on("fileConversionStarted", () => {
            this.toast("File conversion started");
        });

        ipcRenderer.on("fileConversionDone", () => {
            this.toast("File conversion done");
        });

        ipcRenderer.on("fileConversionStatus", (event, progress) => {
            this.progress = progress;
        });

        ipcRenderer.on("convertDestinationSelected", (event, destination) => {
            if (!destination.canceled)
                this.fileDestination = destination.filePaths[0];
        });
    },
    methods: {
        handleFileChange(e) {
            var file = e.target.files[0];

            if (file.type === "video/mp4") {
                this.filePath = file.path;
                console.log(this.filePath);
            } else {
                //e.target.value = "";
            }
            // const { dialog } = require("electron");
            // console.log(dialog.showOpenDialog({ properties: ["openFile"] }));
        },
        convert() {
            if (this.filePath === "") {
                this.toast("Select a file", 5, "error");
            } else if (this.fileDestination === "") {
                this.toast("Select a destination folder", 5, "error");
            } else if (this.newFileName === "") {
                this.toast("Input a file name", 5, "error");
            } else {
                var conversionData = {
                    filePath: this.filePath,
                    newFileName: this.newFileName,
                    fileDestination: this.fileDestination,
                    format: this.format
                };

                ipcRenderer.send("convert", conversionData);
            }
        },
        selectFileDestination() {
            ipcRenderer.send("selectConvertDestination");
        }
    },
    watch: {
        newFileName(val) {
            this.newFileName = val
                .replace(/[^a-z0-9-_ ]/gi, "")
                .replace("  ", " ");
        }
    }
};
</script>