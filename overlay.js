MainState.Overlay = function(game) {
};

var lifeMeterFillRate = 30;

MainState.Overlay.prototype = {

	preload: function() {

	},

	create: function() {

		lifeMeter = gamevar.add.sprite(-100, -100, 'bullet', 1);
		lifeMeter.scale.setTo(60, 50);
		lifeMeter.x = -100;
		lifeMeter.y = gamevar.height + 10;
		lifeMeter.alpha = .2;
		gamevar.physics.enable(lifeMeter, Phaser.Physics.ARCADE, true);
		lifeMeter.body.velocity.y = -lifeMeterFillRate;

	},

	update: function() {
		if(lifeMeter.y < 0){
			if(lifeMeter.y < -100){
				lifeMeter.y = -100;
			}
			lifeEmpty = true;
		} else if(lifeMeter.y > 0){
			if(lifeMeter.y < -100){
				lifeMeter.y = -100;
			}
			lifeEmpty = true;
		}

	}

};


