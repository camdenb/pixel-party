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

var text_TEST;
var text_header_score;
var text_header_bombs;

var text_score_center;

var textHeightOffset = 200;

var emitter_text;

var CONST_textDefaultAlpha = 0.3;
var CONST_textHighlightAlpha = 0.8;

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

		text_TEST = gamevar.add.bitmapText(200, 250, 'carrier', 'a', 40);
		text_TEST.alpha = 0;

		//IGNORE! vvvv
		text_coins = gamevar.add.bitmapText(200, 275, 'carrier', 'Coins: ' + coins_value, 40);
		text_health = gamevar.add.bitmapText(200, 350, 'carrier', 'Health: ' + health_value, 40);
		//        ^^^^

		text_header_score = gamevar.add.bitmapText(200, textHeightOffset, 'carrier', 'Score', 40);
		text_score = gamevar.add.bitmapText(200, textHeightOffset + 50, 'carrier', score_value + '', 40);
		
		text_header_bombs = gamevar.add.bitmapText(200, gamevar.height - textHeightOffset - 50, 'carrier', 'Bomb?', 40);
		text_bombs = gamevar.add.bitmapText(200, gamevar.height - textHeightOffset, 'carrier', bomb_value, 40);

		textArray = [text_score, text_coins, text_health, text_bombs, text_header_score, text_header_bombs];
		textArray.forEach(function(text){
			text.alpha = CONST_textDefaultAlpha;
			text.x = gamevar.world.centerX - getTextWidth(text) / 2;
		});
		text_score_center = text_score.x;
		text_score.alpha = 0.4;
		text_health.alpha = 0;
		text_coins.alpha = 0;

		

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

function flashText(text, bStayHighlighted){
	var textX = text.x;
	var textY = text.y;
	gamevar.add.tween(text).to( { x: textX - 10, y: textY - 10}, 100, Phaser.Easing.Linear.None, true, 0, 0, false).to( { x: textX , y: textY}, 200, Phaser.Easing.Linear.None, true, 0, 0, true);

	
	if(bStayHighlighted){
		gamevar.add.tween(text).to( { alpha: 1}, 100, Phaser.Easing.Linear.None, true, 0, 0, false).to( { alpha: CONST_textHighlightAlpha}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
	} else {
		gamevar.add.tween(text).to( { alpha: 1}, 100, Phaser.Easing.Linear.None, true, 0, 0, false).to( { alpha: CONST_textDefaultAlpha}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
	}
	

	gamevar.add.tween(text.scale).to( { x: 1.05, y: 1.05}, 100, Phaser.Easing.Linear.None, true, 0, 0, false).to( { x: 1, y: 1}, 200, Phaser.Easing.Linear.None, true, 0, 0, false);
}

function shakeText(text, amount, time, isRandomish){
	var amtX = amount;
	var amtY = amount;
	var oldX = text.x;
	var oldY = text.y;
	var enableX = true;
	var enableY = true;
	if(isRandomish){
		if(gamevar.rnd.integerInRange(0, 1) == 0){
			amtX *= -1;
		}
		if(gamevar.rnd.integerInRange(0, 1) == 0){
			amtY *= -1;
		}

		if(gamevar.rnd.integerInRange(0, 4) == 0){
			enableX = false;
		}
		if(gamevar.rnd.integerInRange(0, 3) == 0){
			enableY = false;
		}

		if(!enableY && !enableX){
			enableX = true;
			enableY = true;
		}

	}

	if(enableX){
		gamevar.add.tween(text).to({x : oldX + amtX}, time, Phaser.Easing.Linear.None, true, 0).to({x : oldX - amtX}, time, Phaser.Easing.Linear.None, true, 0).to({x : oldX}, time, Phaser.Easing.Linear.None, true, 0);
	}

	if(enableY){
		gamevar.add.tween(text).to({y : oldY + amtY}, time, Phaser.Easing.Linear.None, true, 0).to({y : oldY - amtY}, time, Phaser.Easing.Linear.None, true, 0).to({y : oldY}, time, Phaser.Easing.Linear.None, true, 0);;
	}
}


function textParticleBurst(text){
	emitter_text = gamevar.add.emitter(-100, 0, 100);
	emitter_text.makeParticles('trail', 0, 50);
	// emitter_trail.setAll('scale.x', 2);
	// emitter_trail.setAll('scale.y', 2);
	emitter_text.setAlpha(0.5, 0, 1000);
	emitter_text.setScale(3, 1, 3, 1, 1000);
	//emitter_trail.setAll('alpha', .6);
	emitter_text.gravity = 500;
	emitter_text.width = 15;
	emitter_text.height = 15;
	emitter_text.particleDrag.setTo(20, 20);
	emitter_text.angularDrag = 200;
	// emitter_trail.minParticleScale = 1;
	// emitter_trail.maxParticleScale = 2;
	emitter_text.minParticleSpeed.setTo(-80, -80);
	emitter_text.maxParticleSpeed.setTo(80, 80);
	//console.log(emitter_text);
	emitter_text.width = getTextWidth(text);
	emitter_text.height = 40;
	emitter_text.x = text.x + emitter_text.width / 2;
	emitter_text.y = text.y + emitter_text.height / 2;
	emitter_text.start(true, 1000, 0, 40);
}
