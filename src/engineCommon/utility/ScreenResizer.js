const ScreenResizer = new Phaser.Class({
    Extends: Phaser.Plugins.BasePlugin,

    initialize:
        function ScreenResizer(PluginManager) {
            Phaser.Plugins.BasePlugin.call(this, PluginManager);
        },

    init:
        function() {
            this.resizeCallback = null;
            this.resizeType = ScreenResizer.ResizeType.NONE;
            this.resizeScale = 1;

            this._lastWindowWidth = 0;
            this._lastWindowHeight = 0;
        },

    start:
        function() {
            this.onWindowResize();

            this.game.events.on("prestep", this.onWindowResize, this);
            this.game.events.once("destroy", this.destroy, this);
        },

    destroy:
        function() {
            this.game.events.off("prestep", this.onWindowResize, this);
            Phaser.Plugins.BasePlugin.prototype.destroy.call(this);
        },

    onWindowResize:
        function() {
            if (this.resizeType == ScreenResizer.ResizeType.CUSTOM) {
                this.resizeCallback != null ? this.resizeCallback(this) : Phaser.Utils.NOOP();
            }
            else {
                ScreenResizer.defaultCallback(this);
            }
        }
});

ScreenResizer.ResizeType = {
    NONE: 0,
    CUSTOM: 1
};

ScreenResizer.defaultCallback = function(resizer) {
    if (this._lastWindowWidth != window.innerWidth || this._lastWindowHeight != window.innerHeight) {
        this._lastWindowWidth = window.innerWidth;
        this._lastWindowHeight = window.innerHeight;

        var width = resizer.game.canvas.width;
        var height = resizer.game.canvas.height;
    
        var scale = window.innerWidth / width;
        if (height * scale > window.innerHeight) {
            scale = window.innerHeight / height;
        }
        
        this.resizeScale = scale;
    
        width *= scale;
        height *= scale;
    
        resizer.game.canvas.style.position = "absolute";
    
        resizer.game.canvas.style.width = width + "px";
        resizer.game.canvas.style.height = height + "px";
    
        var x = (window.innerWidth - width) * 0.5;
        var y = (window.innerHeight - height) * 0.5;
    
        resizer.game.canvas.style.left = x + "px";
        resizer.game.canvas.style.top = y + "px";
    
        resizer.game.events.emit("resize", this.resizeScale);
    }
};

ScreenResizer.PluginConfig = {
    key: "ScreenResizer",
    plugin: ScreenResizer,
    mapping: "resizer",
    start: true
}

module.exports = ScreenResizer;