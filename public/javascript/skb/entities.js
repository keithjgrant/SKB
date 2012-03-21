var SKB = SKB || {};

SKB.EntityLoader = function(conf) {
    this.conf = conf;
    this.LIGHT = conf.LIGHT;
    this.DARK = conf.DARK;
};
SKB.EntityLoader.prototype = {
    wall: function(c, r) {
        return Crafty.e("2D, DOM, wall")
            .attr(this._attributes(c, r));
    },

    block: function(c, r, color, map) {
        var b = Crafty.e("2D, DOM, block, Block, fourwaysnap, Collision")
            .attr(this._attributes(c, r))
            .fourwaysnap(4, this.conf.TILE);
        b.block(map);

        b.color = color;
        if (color === this.LIGHT) {
            // TODO better place to store these coords?
            b.sprite(1, 1);
        }
    },

    player: function(c, r) {
        var p = Crafty.e("2D, DOM, player, PlayerControls, Collision, fourwaysnap")
            .attr(this._attributes(c, r))
            .fourwaysnap(4, this.conf.TILE);

        p.onHit('wall', function() {
            this.stop();
        });

        return p;
    },

    gate: function(c, r) {
        var gate = Crafty.e("2D, DOM, gate")
            .attr(this._attributes(c, r));

        return gate;
    },

    goal: function(c, r, color) {
        var g = Crafty.e("2D, DOM, goal")
            .attr(this._attributes(c, r));

        g.color = color;
        g.z = 10;
        g.c = c;
        g.r = r;

        if (color === this.LIGHT) {
            // TODO
            g.sprite(2, 1);
        }

        return g;
    },

    _attributes: function(c, r) {
        return {
            x: c * this.conf.TILE,
            y: r * this.conf.TILE,
            w: this.conf.TILE,
            h: this.conf.TILE
        }
    }
};

