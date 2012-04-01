var SKB = SKB || {};

SKB.EntityLoader = function(conf) {
    this.conf = conf;
    this.WHITE = conf.WHITE;
    this.BLUE = conf.BLUE;
    this.RED = conf.RED;
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
        if (color === this.WHITE) {
            b.addComponent('whiteblock');
        } else if (color === this.BLUE) {
            b.addComponent('blueblock');
        } else {
            b.addComponent('redblock');
        }

        return b;
    },

    keystone: function(c, r, color, map) {
        var b = Crafty.e("2D, DOM, block, Block, fourwaysnap, Collision")
            .attr(this._attributes(c, r))
            .fourwaysnap(4, this.conf.TILE);
        b.block(map);
        b.keystone = true;

        b.color = color;
        if (color === this.WHITE) {
            b.addComponent('whitekeystone');
        } else if (color === this.BLUE) {
            b.addComponent('bluekeystone');
        } else {
            b.addComponent('redkeystone');
        }

        return b;
    },

    player: function(c, r) {
        var p = Crafty.e("2D, DOM, player, PlayerControls, Collision, fourwaysnap")
            .attr(this._attributes(c, r))
            .fourwaysnap(4, this.conf.TILE);

        p.z = 20;
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
        var g = Crafty.e("2D, DOM, SpriteAnimation, goal")
            .attr(this._attributes(c, r));
        var row;

        g.color = color;
        g.z = 10;
        g.c = c;
        g.r = r;

        if (color === this.WHITE) {
            g.addComponent('whitegoal');
            row = 1;
        } else if (color === this.BLUE) {
            g.addComponent('bluegoal');
            row = 2;
        } else {
            g.addComponent('redgoal');
            row = 3;
        }

        g.animate('GoalActivate', 2, row, 5);
        g.animate('GoalDeactivate', 5, row, 2);

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

