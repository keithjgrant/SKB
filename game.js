/**
 * SKB - A sokoban-inspired game
 * Author: Keith J Grant
 * keithjgrant@gmail.com
 */

if (typeof SKB === 'undefined') {
    var SKB = {}
}

SKB.conf = {
    GAME_TICK:      30, // game cycles per second?
    TILE:           32,
    GAME_WIDTH:     16,
    GAME_HEIGHT:    12
}

SKB.game = function() {
    var conf = SKB.conf;
    Crafty.init([
        conf.GAME_WIDTH * conf.TILE,
        conf.GAME_HEIGHT * conf.TILE
    ]);
    Crafty.sprite(conf.TILE, 'sprites.png', {
        player: [0, 0],
        wall: [0, 1],
        darkBlock: [0, 2],
        lightBlock: [0, 3]
    });
};
SKB.game.prototype = {
    loadLevel: function(levelNum) {
        var name = 'level' + levelNum,
            map = new SKB.map();

        if (Crafty._scenes[name]) {
            // already loaded
            Crafty.scene(name);
            return;
        }

        $.get(name + '.json', function(data) {
            Crafty.scene(name, function() {
                map.deserializeLevel(data);
            });
            Crafty.scene(name);
        }, 'json')
        .error(function() {
            if (!console || !console.log) { return; }
            console.log('Error loading level: ' + name + '.json');
        });
    }
};

SKB.map = function() {
    this.loader = new SKB.entityLoader();
    this.test = 'TEST';
};
SKB.map.prototype = {
    deserializeLevel: function(data) {
        Crafty.scene(name, $.proxy(function() {
            for (r = 0; r < SKB.conf.GAME_HEIGHT; r++) {
                for (c = 0; c < SKB.conf.GAME_WIDTH; c++) {
                    if (data[r] && data[r][c]) {
                        this.deserializeTile(r, c, data[r][c]);
                    } else {
                        this.deserializeTile(r, c, 'x');
                    }
                }
            }
                    
        }, this));
        Crafty.scene(name);
    },

    deserializeTile: function(r, c, data) {
        for (i = 0; i < data.length; i++) {
            var char = data.charAt(i);
            if (char === 'x') {
                this.loader.wall(r, c);
            } else if (char === 'p') {
                this.loader.player(r, c);
            }
        }
    },

    serializeTile: function() {
        console.log("map.serializeTile() not yet implemented");
    }
};

SKB.entityLoader = function() {
};
SKB.entityLoader.prototype = {
    wall: function(r, c) {
        var wall = Crafty.e();
        wall.addComponent("2D, DOM, wall");
        wall.attr(this._attributes(r, c));
    },

    player: function(r, c) {
        return Crafty.e("2D, DOM, player, controls, collision, fourwaysnap")
                     .attr(this._attributes(r, c))
                     .fourwaysnap(4, SKB.conf.TILE);
    },

    _attributes: function(r, c) {
        return {
            x: c * SKB.conf.TILE,
            y: r * SKB.conf.TILE,
            w: SKB.conf.TILE,
            h: SKB.conf.TILE
        }
    }
};

window.onload = function() {
    var game = new SKB.game();
    game.loadLevel(1);
}
