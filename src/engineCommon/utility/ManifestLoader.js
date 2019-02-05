const StringUtils = require("./StringUtils");

const ManifestLoader = new Phaser.Class({
    Extends: Phaser.Plugins.BasePlugin,

    initialize:
        function ManifestLoader(pluginManager) {
            Phaser.Plugins.BasePlugin.call(this, pluginManager);
        },

    loadManifestFile:
        function(loader, path, start = false) {
            loader.once("complete", () => this.manifest = this.game.cache.json.get("manifest"));
            loader.json("manifest", path);

            if (start) {
                loader.start();
            }
        },

    load:
        function(loader, packs, start = false) {
            if (!Array.isArray(packs)) {
                packs = [packs];
            }
            packs.forEach(pack => {
                if (this.manifest.hasOwnProperty(pack)) {
                    const files = this.manifest[pack].files || [];
                    files.forEach(file => {
                        switch (file.type) {
                            case "image":
                            case "json":
                            case "tilemapTiledJSON":
                                loader[file.type].call(loader, file.key, file.url);
                                break;

                            case "atlas":
                                loader[file.type].call(loader, file.key, file.textureUrl, file.atlasUrl);
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

            if (start) {
                loader.start();
            }
        },

    unload:
        function(loader, packs) {
            if (this.manifest.hasOwnProperty(pack)) {
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