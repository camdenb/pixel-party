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
var text_paused;
var text_score_gameover;
var text_hiscore_gameover;

var text_score_center;

var text_alert;
var text_alert_ach;

var textHeightOffset = 200;

var CONST_textDefaultAlpha = 0.3;
var CONST_textHighlightAlpha = 0.8;

MainState.Input.prototype = {

	preload: function() {
	},

	create: function() {

		gamevar.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;

		pauseKey = gamevar.input.keyboard.addKey(Phaser.Keyboard.ESC);
		//bombKey = gamevar.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		bindKeys();
		gamevar.onPause.add(windowPaused, this);
		gamevar.onResume.add(windowResumed, this);

		//bombKey.onDown.add(launchBomb);


		text_TEST = gamevar.add.bitmapText(200, 250, 'carrier', 'a', 40);
		text_TEST.alpha = 0;

		
		

		//IGNORE! vvvv
		text_coins = gamevar.add.bitmapText(200, 275, 'carrier', 'Coins: ' + coins_value, 40);
		text_health = gamevar.add.bitmapText(200, 350, 'carrier', 'Health: ' + health_value, 40);
		//        ^^^^

		text_alert = gamevar.add.bitmapText(0, -100, 'carrier', '', 30);
		text_alert.alpha = 0;

		text_alert_ach = gamevar.add.bitmapText(0, -100, 'carrier', '', 30);
		text_alert_ach.alpha = 0;

		text_header_score = gamevar.add.bitmapText(200, textHeightOffset, 'carrier', 'Score', 40);
		text_score = gamevar.add.bitmapText(200, textHeightOffset + 50, 'carrier', score_value + '', 40);
		
		text_header_bombs = gamevar.add.bitmapText(200, gamevar.height - textHeightOffset - 50, 'carrier', 'Bomb?', 40);
		text_bombs = gamevar.add.bitmapText(200, gamevar.height - textHeightOffset, 'carrier', bomb_value, 40);

		textArray = [text_score, text_coins, text_health, text_bombs, text_header_score, text_header_bombs];
		textArray.forEach(function(text){
			text.alpha = CONST_textDefaultAlpha;
			centerText(text);
		});
		text_score_center = 376.4;
		

		text_score.alpha = 0.4;
		text_health.alpha = 0;
		text_coins.alpha = 0;

		

	},

	update: function() {
			
		if(!bPaused){
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

	}

};

function setFullscreen(full){
	if(full){
		gamevar.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
		gamevar.scale.startFullScreen(false);
	} else {

		// gamevar.scale.stopFullScreen();
		// gamevar.scale.refresh();
	}
}

function alignText(text, alignLeft, offset){
	//true is left, false is right
	offset = offset || 10;
	if(alignLeft){
		text.x = 0 + offset;
	} else {
		text.x = gamevar.width - getTextWidth(text) - offset;
	}
	return text;
}

function alignSprite(spr, alignLeft, offset){
	//true is left, false is right
	offset = offset || 10;
	if(alignLeft){
		spr.x = 0 + offset;
	} else {
		spr.x = gamevar.width - spr.width - offset;
	}
	return spr;
}

function centerText(text){
	text.x = (gamevar.width / 2) - getTextWidth(text) / 2;
	return text;
}

function windowPaused(){
	bgMusic.pause();
	if(!bPaused && gamevar.state.current == 'gameplay'){
		pausedMask.alpha = 0.6;
		setPaused(true, false);
	}
}

function windowResumed(){
	if(!bgMusic.isPlaying && !music_menu.isPlaying){
		bgMusic.play();
	}
	bindKeys();
}

function bindKeys(){
	pauseKey.onDown.add(function(){
		if(!bPaused){
			setPaused(true, false);
		}
	});
	if(!bPaused){
		gamevar.input.onDown.add(launchBomb);
	} else {

	}
}

function textAlert(text, y, bAch){
	if(bAch){
		text_alert_ach.setText(text);
		text_alert_ach.y = y;
		centerText(text_alert_ach);
		gamevar.add.tween(text_alert_ach).to( { alpha: .4}, 100, Phaser.Easing.Linear.None, true, 0, 0, false).to( { alpha: 0}, 1500, Phaser.Easing.Linear.None, true, 1500, 0, false);
	} else {
		text_alert.setText(text);
		text_alert.y = y;
		centerText(text_alert);
		gamevar.add.tween(text_alert).to( { alpha: .4}, 100, Phaser.Easing.Linear.None, true, 0, 0, false).to( { alpha: 0}, 1500, Phaser.Easing.Linear.None, true, 1500, 0, false);
	}
}

function flashText(text, bStayHighlighted, finalAlpha, endAlpha){
	finalAlpha = finalAlpha || 1;
	endAlpha = endAlpha || CONST_textDefaultAlpha;
	var textX = text.x;
	var textY = text.y;
	gamevar.add.tween(text).to( { x: textX - 10, y: textY - 10}, 100, Phaser.Easing.Linear.None, true, 0, 0, false).to( { x: textX , y: textY}, 200, Phaser.Easing.Linear.None, true, 0, 0, true);

	
	if(bStayHighlighted){
		gamevar.add.tween(text).to( { alpha: finalAlpha}, 100, Phaser.Easing.Linear.None, true, 0, 0, false).to( { alpha: CONST_textHighlightAlpha}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
	} else {
		gamevar.add.tween(text).to( { alpha: finalAlpha}, 100, Phaser.Easing.Linear.None, true, 0, 0, false).to( { alpha: endAlpha}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
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


function textParticleBurst(text, emitter){
	if(graphicsLevel > 1){
		emitter.makeParticles('trail', 0, 50);
		// emitter_trail.setAll('scale.x', 2);
		// emitter_trail.setAll('scale.y', 2);
		emitter.setAlpha(0.5, 0, 1000);
		emitter.setScale(2, 0.5, 2, 0.5, 1000);
		//emitter_trail.setAll('alpha', .6);
		emitter.gravity = 100;
		emitter.width = 15;
		emitter.height = 15;
		emitter.particleDrag.setTo(20, 20);
		emitter.angularDrag = 200;
		// emitter_trail.minParticleScale = 1;
		// emitter_trail.maxParticleScale = 2;
		emitter.minParticleSpeed.setTo(-80, -80);
		emitter.maxParticleSpeed.setTo(80, 80);
		//console.log(emitter);
		emitter.width = getTextWidth(text);
		emitter.height = 40;
		emitter.x = text.x + emitter.width / 2;
		emitter.y = text.y + emitter.height / 2;
		emitter.start(true, 1000, 0, 40);
	}
}

function graphicsAdvance(){
	if(graphicsLevel < 3){
		graphicsLevel++;
	} else {
		graphicsLevel = 1;
	}
	store.set('graphicsLevel', graphicsLevel);
}

function volumeAdvance(all){
		
	if(all){
		if(volumeLevel < 10){
			volumeLevel += 1;
		} else {
			volumeLevel = 0;
		}
		gamevar.sound.volume = volumeLevel / 20;
		store.set('volume_all', volumeLevel);
	} else {
		if(volumeLevel_music < 10){
			volumeLevel_music += 1;
		} else {
			volumeLevel_music = 0;
		}
		console.log('set music');
		store.set('volume_music', volumeLevel_music);
	}

}

function toggleSound(){
	if(gamevar.sound.mute){
		gamevar.sound.mute = false;
		gamevar.sound.volume = volumeLevel / 20;
	} else {
		gamevar.sound.mute = true;
	}
}