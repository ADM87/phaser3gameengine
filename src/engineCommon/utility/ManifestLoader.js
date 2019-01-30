const StringUtils = require("./StringUtils");

const ManifestLoader = new Phaser.Class({
    Extends: Phaser.Plugins.BasePlugin,

    initialize:
        function ManifestLoader(pluginManager) {
            Phaser.Plugins.BasePlugin.call(this, pluginManager);
        },

    load:
        function(loader, packs, json) {
            packs.forEach(pack => {
                if (json.hasOwnProperty(pack)) {
                    const files = json[pack].files || [];
                    files.forEach(file => {
                        switch (file.type) {
                            case "image":
                            case "json":
                                loader[file.type].call(loader, file.key, file.url);
                                break;

                            case "bitmapFont":
                                loader[file.type].call(loader, file.key, file.textureUrl, file.fontDataUrl);
                                break;
    
                            default:
                                throw new Error(StringUtils.format("[ManifestLoader->load] Load condition for %0 not implmeneted.", file.type));
                        }
                    });
                }
                else {
                    throw new Error(StringUtils.format("[ManifestLoader->load] Cannot find pack %0 in manifest JSON.", pack));
                }
            });
        },

    unload:
        function(loader, pack, json) {
            if (json.hasOwnProperty(pack)) {
                throw new Error(StringUtils.format("[ManifestLoader->unload] Not implemented"));
            }
            else {
                throw new Error(StringUtils.format("[ManifestLoader->load] Cannot find pack %0 in manifest JSON.", pack));
            }
        }
});

ManifestLoader.PluginConfig = {
    key: "ManifestLoader",
    plugin: ManifestLoader,
    mapping: "manifest",
    start: true
}

module.exports = ManifestLoader;