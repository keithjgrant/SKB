/**
 * SKB - A sokoban-inspired game
 * Author: Keith J Grant
 * keithjgrant@gmail.com
 */

if (typeof SKB === 'undefined') {
    var SKB = {}
}

SKB.conf = {
    TILE:           32,
    GAME_WIDTH:     16,
    GAME_HEIGHT:    12
}

SKB.LIGHT = 'light';
SKB.DARK = 'dark';

SKB.game = function() {
    var conf = SKB.conf;
    Crafty.init([
        conf.GAME_WIDTH * conf.TILE,
        conf.GAME_HEIGHT * conf.TILE
    ]);
    Crafty.sprite(conf.TILE, '/images/skb/sprites.png', {
        player: [0, 0],
        wall: [0, 1],
        block: [1, 0],
        darkBlock: [0, 2],
        lightBlock: [0, 3],
        gate: [0, 2]
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
};
SKB.map.prototype = {
    /*
     *  SERIALIZED MAP FORMAT:
     *  tiles: 16x12 array of:
     *  0 - wall
     *  1 - dark block
     *  2 - dark loop block
     *  3 - light block
     *  4 - light loop block
     *  5 - gate
     *
     *  goals: {type:<0/1>,c,r}
     *  player: {c, r}
     */
    deserializeLevel: function(data) {
        Crafty.scene(name, $.proxy(function() {
            for (r = 0; r < SKB.conf.GAME_HEIGHT; r++) {
                for (c = 0; c < SKB.conf.GAME_WIDTH; c++) {
                    if (data.tiles[r] && data.tiles[r][c]) {
                        this.deserializeTile(c, r, data.tiles[r][c]);
                    } else {
                        this.deserializeTile(c, r, 0);
                    }
                }
            }

            for (i in data.goals) {
                this.addGoal(data.goals[i]);
            }
            for (j in data.gates) {
                this.addGate(data.gates[j]);
            }
            this.loader.player(data.player.c, data.player.r);
                    
        }, this));
        Crafty.scene(name);
    },

    deserializeTile: function(c, r, tile) {
        if (tile == 0) {
            this.loader.wall(c, r);
        } else if (tile == 1) {
            this.loader.block(c, r, SKB.DARK);
        } else if (tile == 2) {
            this.loader.goalBlock(c, r, SKB.DARK);
        } else if (tile == 3) {
            this.loader.block(c, r, SKB.LIGHT);
        } else if (tile == 5) {
            this.loader.gate(c, r);
        }
    },

    serializeTile: function() {
        console.log("map.serializeTile() not yet implemented");
    },

    addGoal: function(def) {
    },
};

SKB.util = {

    tileAt: function(c, r) {
        var coords = {
            _x: c * SKB.conf.TILE,
            _y: r * SKB.conf.TILE,
            _w: SKB.conf.TILE,
            _h: SKB.conf.TILE
        },
            match = Crafty.map.search(coords),
            filter = ['block', 'wall', 'gate'];
        
        for (entity in match) {
            for (f in filter) {
                if (match[entity] && match[entity].has(filter[f])) {
                    return match[entity];
                }
            }
        }

        return false;
    },

    /**
     * Returns true if blocks at both coordinates are the same type
     */
    blocksMatch: function(coordsA, coordsB) {
        var blockA = this.tileAt(coordsA.c, coordsA.r),
            blockB = this.tileAt(coordsB.c, coordsB.r);

        if (!blockA || !blockB ||
          !blockA.has('block') || !blockB.has('block')) {
            return false;
        }

        return blockA.color === blockB.color;
    }
};

window.onload = function() {
    var game = new SKB.game();
    game.loadLevel(1);
}
