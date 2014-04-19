MainState.Input = function(game) {
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


MainState.Input.prototype = {

	preload: function() {
		// gamevar.load.audio('glitchitup', 'assets/sound/music/glitchitup.ogg');
		// gamevar.load.audio('seaoflava', 'assets/sound/music/seaoflava.ogg');
		// gamevar.load.audio('8bitfight', 'assets/sound/music/8bitfight.ogg');
		gamevar.load.audio('justkillit', 'assets/sound/music/justkillit.ogg');
	},

	create: function() {
		cursors = gamevar.input.keyboard.createCursorKeys();
		resetKey = gamevar.input.keyboard.addKey(Phaser.Keyboard.R);
		pauseKey = gamevar.input.keyboard.addKey(Phaser.Keyboard.ESC);
		skipKey = gamevar.input.keyboard.addKey(Phaser.Keyboard.S);
		//bombKey = gamevar.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
		gamevar.input.onDown.add(launchBomb);
		//bombKey.onDown.add(launchBomb);

		text_score = gamevar.add.bitmapText(200, 200, 'carrier', 'Score: ' + score_value, 40);
		text_coins = gamevar.add.bitmapText(200, 275, 'carrier', 'Coins: ' + coins_value, 40);
		text_health = gamevar.add.bitmapText(200, 350, 'carrier', 'Health: ' + health_value, 40);
		text_bombs = gamevar.add.bitmapText(200, 425, 'carrier', 'Bomb? ' + bomb_value, 40);

		textArray = [text_score, text_coins, text_health, text_bombs];
		textArray.forEach(function(text){
			text.alpha = 0.3;
		});

	},

	update: function() {
		if(!bMouseControl){
			if(cursors.left.isDown){
				playerSprite.body.velocity.x = -player_movementSpeed;
			} else if(cursors.right.isDown){
				playerSprite.body.velocity.x = player_movementSpeed;
			} else {
				playerSprite.body.velocity.x = 0;
			}

			if(cursors.up.isDown){
				playerSprite.body.velocity.y = -player_movementSpeed;
			} else if(cursors.down.isDown){
				playerSprite.body.velocity.y = player_movementSpeed;
			} else {
				playerSprite.body.velocity.y = 0;
			}
		} else if(!bDeathPause){
			playerSprite.x = gamevar.input.x;
			playerSprite.y = gamevar.input.y;
		}

	}

};


