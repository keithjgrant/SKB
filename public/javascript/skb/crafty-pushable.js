/**
 * Pushable block
 */

Crafty.c("pushable", {

   init: function() {
		if(!this.has("fourwaysnap")) this.addComponent("fourwaysnap");
        if(!this.has("collision")) this.addComponent("collision");
	},

    pushable: function() {

    },

    pushUp: function() {
        this.moveUp();
    }

});

