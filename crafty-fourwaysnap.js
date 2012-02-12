/**
 * Four-way moving entity, which snaps to a grid position when at rest
 *
 * Entity will move based on a key press.  When the key is released, entity
 * will continue moving until reaching a position that is an even multiple
 * of the given gridSize.
 */
Crafty.c("fourwaysnap", {
	__move: {left: false, right: false, up: false, down: false},
	_speed: 4,
    _gridSize: 32,
    _motion: 0, // 0 = stopped; 1-4 = up, right, down, left
    _ticksPerSnap: 8,
    _ticksRemaining: 0,
    _nextSnapPos: null,
    _lastSnapPos: null,

	init: function() {
		if(!this.has("controls")) {
            this.addComponent("controls");
        }
	},

	fourwaysnap: function(speed, gridSize) {
		if(speed) {
            this._speed = speed;
        }
        if (gridSize) {
            this._gridSize = gridSize;
            this._ticksPerSnap = gridSize / this._speed;
        }
		var move = this.__move;


		this.bind("EnterFrame", function() {
            var old = this.pos(),
                changed = false;

            if (this._motion && this._ticksRemaining === 1) {
                this.x = this._nextSnapPos.x,
                this.y = this._nextSnapPos.y
                this._ticksRemaining = 0;
                this._motion = 0;
            } else if(this._motion) {
                // up
                if (this._motion == 1) {
                    this.y -= this._speed
                    changed = true;
                }
                // right
                if (this._motion == 2) {
                    this.x += this._speed;
                    changed = true;
                }
                // down
                if (this._motion == 3) {
                    this.y += this._speed;
                    changed = true;
                }
                // left
                if (this._motion == 4) {
                    this.x -= this._speed;
                    changed = true;
                }
                
                this._ticksRemaining--;
            }

            if (!this._motion) {
                if(move.up) {
                    this.moveUp();
                }
                if(move.right) {
                    this._motion = 2;
                    this._nextSnapPos = {
                        x: this.x + this._gridSize,
                        y: this.y
                    };
                }
                if(move.down) {
                    this._motion = 3;
                    this._nextSnapPos = {
                        x: this.x,
                        y: this.y + this._gridSize
                    };
                }
                if(move.left) {
                    this._motion = 4;
                    this._nextSnapPos = {
                        x: this.x - this._gridSize,
                        y: this.y
                    };
                }

                this._lastSnapPos = {
                    x: this.x,
                    y: this.y
                };
                this._ticksRemaining = this._ticksPerSnap;
            }
		}).bind("KeyDown", function(e) {
			if (e.keyCode === Crafty.keys.RIGHT_ARROW ||
              e.keyCode === Crafty.keys.D) {
				move.right = true;
			}
			if (e.keyCode === Crafty.keys.LEFT_ARROW ||
              e.keyCode === Crafty.keys.A) {
				move.left = true;
			}
			if (e.keyCode === Crafty.keys.UP_ARROW ||
              e.keyCode === Crafty.keys.W) {
				move.up = true;
			}
			if (e.keyCode === Crafty.keys.DOWN_ARROW ||
              e.keyCode === Crafty.keys.S) {
				move.down = true;
			}
		}).bind("KeyUp", function(e) {
			if (e.keyCode === Crafty.keys.RIGHT_ARROW ||
              e.keyCode === Crafty.keys.D) {
				move.right = false;
			}
			if (e.keyCode === Crafty.keys.LEFT_ARROW ||
              e.keyCode === Crafty.keys.A) {
				move.left = false;
			}
			if (e.keyCode === Crafty.keys.UP_ARROW ||
              e.keyCode === Crafty.keys.W) {
				move.up = false;
			}
			if (e.keyCode === Crafty.keys.DOWN_ARROW ||
              e.keyCode === Crafty.keys.S) {
				move.down = false;
			}
		});

		return this;
	},

    moveUp: function() {
        this._motion = 1;
        this._nextSnapPos = {
            x: this.x,
            y: this.y - this._gridSize
        };
    },

    /**
     * Prevent current movement and return object to it's previous snap position
     */
    stop: function() {
        this._motion = 0;
        this._ticksRemaining = 0;
        this.x = this._lastSnapPos.x;
        this.y = this._lastSnapPos.y;
    }
});
