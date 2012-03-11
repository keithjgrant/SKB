if (typeof SKB === 'undefined') {
    SKB = {}
}

SKB.entityLoader = function() {}
SKB.entityLoader.prototype = {
    wall: function(c, r) {
        return Crafty.e("2D, DOM, wall")
            .attr(this._attributes(c, r));
    },

    block: function(c, r) {
        var b = Crafty.e("2D, DOM, block, fourwaysnap, Collision")
            .attr(this._attributes(c, r))
            .fourwaysnap(4, SKB.conf.TILE);

        b.onHit('wall', function() {
            this.stop();
            SKB.player.stop();
        });
        b.onHit('block', function() {
            this.stop();
            SKB.player.stop();
        });
    },

    player: function(c, r) {
        var p = Crafty.e("2D, DOM, player, PlayerControls, Collision, fourwaysnap")
            .attr(this._attributes(c, r))
            .fourwaysnap(4, SKB.conf.TILE);

        p.onHit('wall', function() {
            this.stop();
        }).onHit('block', function(objects) {
            var block = objects[0].obj;

            if (this._motion === 1) {
                block.moveUp();
            } else if (this._motion === 2) {
                block.moveRight();
            } else if (this._motion === 3) {
                block.moveDown();
            } else if (this._motion === 4) {
                block.moveLeft();
            }
        });

        SKB.player = p;
        return p;
    },

    _attributes: function(c, r) {
        return {
            x: c * SKB.conf.TILE,
            y: r * SKB.conf.TILE,
            w: SKB.conf.TILE,
            h: SKB.conf.TILE
        }
    }
};

