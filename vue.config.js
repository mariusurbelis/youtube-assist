module.exports = {
    pluginOptions: {
        electronBuilder: {
            builderOptions: {
                productName: "YouTube Assist Desktop",
                // nodeIntegration: true
                extraFiles: [{
                        from: "client_secret.json",
                        to: "client_secret.json",
                        filter: ["**/*"]
                    },
                    {
                        from: "ffmpeg.exe",
                        to: "ffmpeg.exe",
                        filter: ["**/*"]
                    },
                ]
            }
        }
    },
    configureWebpack: {
        target: "electron-renderer"
    }
};