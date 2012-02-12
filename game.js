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

SKB.init = function() {
    var conf = SKB.conf;
    Crafty.init([conf.GAME_WIDTH * conf.TILE, conf.GAME_HEIGHT * conf.TILE]);
    Crafty.sprite(conf.TILE, 'sprites.png', {
        player: [0, 0],
        wall: [0, 1],
        darkBlock: [0, 2],
        lightBlock: [0, 3]
    });
};

SKB.loadLevel = function(level) {
    var name = 'level' + level;

    if (Crafty._scenes[name]) {
        // already loaded
        Crafty.scene(name);
        return;
    }

    Crafty.scene(name, function() {
        $.get(name + '.json', function(data) {
            for (r = 0; r < SKB.conf.GAME_HEIGHT; r++) {
                for (c = 0; c < SKB.conf.GAME_WIDTH; c++) {
                    if (data[r] && data[r][c]) {
                        SKB.loadTile(r, c, data[r][c]);
                    } else {
                        SKB.loadTile(r, c, 'x');
                    }
                }
            }
                    
        }, 'json')
        .error(function() {
            if (!console || !console.log) { return; }
            console.log('Error loading level: ' + name + '.json');
        });
    });
    Crafty.scene(name);
};

SKB.loadTile = function(r, c, data) {
    for (i = 0; i < data.length; i++) {
        var char = data.charAt(i);
        if (char === 'x') {
            SKB.wallEntity(r, c);
        } else if (char === 'p') {
            SKB.playerEntity(r, c);
        }
    }
};

SKB.wallEntity = function(r, c) {
    var wall = Crafty.e();
    wall.addComponent("2D, DOM, wall");
    wall.attr(SKB.attributes(r, c));
};

SKB.playerEntity = function(r, c) {
    return Crafty.e("2D, DOM, player, controls, collision, fourwaysnap")
                 .attr(SKB.attributes(r, c))
                 .fourwaysnap(4, SKB.conf.TILE);
};

SKB.attributes = function(r, c) {
    return {
        x: c * SKB.conf.TILE,
        y: r * SKB.conf.TILE,
        w: SKB.conf.TILE,
        h: SKB.conf.TILE
    }
};

window.onload = function() {
    SKB.init();

    SKB.loadLevel(1);
}
