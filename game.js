MainState = { };

MainState.Boot = function(game){};
MainState.Preloader = function(game){};
MainState.Gameplay = function(game){};

var bEnteredGameplayBefore = false;

MainState.Boot.prototype = {

	//preloadBar: Phaser.Sprite,

	preload: function() {
		this.load.image('preloadBar', 'assets/sprites/preloadBar.png');
		gamevar.load.bitmapFont('carrier', 'assets/fonts/carrier_command.png', 
			'assets/fonts/carrier_command.xml');
	},

	create: function() {
		gamevar.state.start('preload');
	},

	update: function() {

	}

};

MainState.Preloader.prototype = {

	preload: function() {

		centerText(this.add.bitmapText(this.world.centerX, this.world.centerY - 25, 'carrier', gamevar.load.progressFloat + '%', 50));

		centerText(this.add.bitmapText(this.world.centerX - 200, this.world.centerY + 200, 'carrier', 'Loading', 40));
		// this.preloadBar = this.add.sprite(this.world.centerX, this.world.centerY, 'preloadBar');
		// //this.preloadBar.scale.setTo(1,1);
		// this.preloadBar.anchor.setTo(.5,.5);
		// this.preloadBar.x = this.world.centerX;
		// this.preloadBar.y = this.world.centerY;
		// this.load.setPreloadSprite(this.preloadBar, false);

		gamevar.load.image('rect', 'assets/sprites/shapes/rect.png');
		inputHandler.preload();

		level.preload();
	    player.preload();
	    overlay.preload();
	},

	create: function() {
		this.stage.smoothed = false;
		gamevar.state.start('menu_main');
		
	},

	update: function() {
	}

};


MainState.Gameplay.prototype = {

	gameObjects: Phaser.Group,

	create: function() {

		gameObjects = new Phaser.Group(this, undefined, 'gameObjects');

		console.log('gameplay started');
		inputHandler.create();
		level.create();
	    player.create();
	    overlay.create();

	},

	update: function() {
		inputHandler.update();
		level.update();
	    player.update();
	    overlay.update();
	},

	render: function() {

		// gamevar.debug.quadTree(gamevar.physics.arcade.quadTree);

		// gamevar.debug.text("Difficulty: " + difficulty, 500, 100);
		// gamevar.debug.text("dead?: " + lifeEmpty, 200, 100);
		// gamevar.debug.soundInfo(currentSong, 20, 32);
		// bullets.forEachAlive(function(bullet){gamevar.debug.geom(bullet.line);});
	 //    gamevar.debug.text("Current Combo: " + currentCombo, 300, 300);
	 //    gamevar.debug.text("Max Combo: " + maxCombo, 300, 332);
	 //    gamevar.debug.text("Current Mode: " + modeString, 32, 32);
	 //    gamevar.debug.text("Current Time: " + (currentTimeCountdown), 32, 64);
	 //    gamevar.debug.text("Score: " + score, 600, 64);
	 //    gamevar.debug.text("High Score: " + highestScore, 600, 96);
	    //game.debug.text("health:" + playerHealth, playerSprite.x, playerSprite.y - 10);

	    gamevar.time.advancedTiming = true;
	    // gamevar.debug.text("fps: " + gamevar.time.fps, 600, 32);
	},

	shutdown: function() {
		gameObjects.destroy(true, true);
		console.log('destroyed game stuff');
	}

};