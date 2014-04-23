MainState.Overlay = function(game) {
};

var lifeMeterFillRate = 20;
var pausedMenuObjects;


MainState.Overlay.prototype = {

	preload: function() {
	},

	create: function() {

		lifeMeter = gamevar.add.sprite(-100, -100, 'square', 1);
		lifeMeter.scale.setTo(60, 50);
		lifeMeter.x = -100;
		lifeMeter.y = gamevar.height + 10;
		lifeMeter.alpha = .2;
		gamevar.physics.enable(lifeMeter, Phaser.Physics.ARCADE, true);
		lifeMeter.body.velocity.y = -lifeMeterFillRate;

		text_paused = gamevar.add.bitmapText(100, textHeightOffset / 2 - 40, 'carrier', 'paused', 50);
		text_paused.alpha = 0;
		text_paused.x = (gamevar.width / 2) - getTextWidth(text_paused) / 2;

	},

	update: function() {

		if(!lifeEmpty && lifeMeter.y < 0){
			if(lifeMeter.y < -100){
				lifeMeter.y = -100;
			}
			lifeEmpty = true;
			setPaused(true, true);
		}

	}

};


