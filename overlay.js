MainState.Overlay = function(game) {
};

var resetKey;
var pauseKey;
var bombKey;
var skipKey;
var cursors;

var text_score;
var text_coins;
var text_health;
var text_bombs;
var textArray;


MainState.Overlay.prototype = {

	preload: function() {

	},

	create: function() {

		lifeMeter = gamevar.add.sprite(-100, -100, 'blackmask');
		lifeMeter.scale.setTo(60, 50);
		lifeMeter.x = -100;
		lifeMeter.y = gamevar.height + 10;
		lifeMeter.alpha = .3;
		gamevar.physics.enable(lifeMeter, Phaser.Physics.ARCADE, true);
		lifeMeter.body.velocity.y = -20;

	},

	update: function() {


	}

};


