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
                }]
            }
        }
    },
    configureWebpack: {
        target: "electron-renderer"
    }
};