MainState.Player = function(game) {
};

var playerSprite;
var player_movementSpeed = 400;
var player_maxVel = 500;
var PLAYER_MAXHEALTH = 5000;

var bombSprite;
var bBombExploding = false;
var timer_bombRecharge;
var bombRechargeTime = 10000;
var lastBombTime = 0;

var score_value = 0;
var coins_value = 0;
var health_value = PLAYER_MAXHEALTH;
var bomb_value = 'yeah.';
var hasBomb = true;

var hurtMask;
var coinMask;
var bombMask;
var pausedMask;

var emitter_blood;
var emitter_trail;

var bMouseControl = true;
var bPlayerDead = false;

MainState.Player.prototype = {

	preload: function() {
		gamevar.load.image('player', 'assets/sprites/shapes/32_light-blue.png');
		gamevar.load.image('redmask', 'assets/sprites/red-mask.png');
		gamevar.load.image('yellowmask', 'assets/sprites/yellow-mask.png');
		gamevar.load.image('greenmask', 'assets/sprites/green-mask.png');
		gamevar.load.image('blackmask', 'assets/sprites/black-mask.png')

		gamevar.load.image('blood', 'assets/sprites/shapes/4_red.png');
		gamevar.load.image('trail-bullet', 'assets/sprites/shapes/4_orange.png');
		//gamevar.load.spritesheet('explosion', 'assets/sprites/anim/explosion-ss.png', 128, 128);
		
	},

	create: function() {

		// initLocalStorage();
		if(store.get('hiscore') == null){
			store.set('hiscore', 0);
		}

		bombSprite = gamevar.add.sprite(-200, 0, 'explosion');
		//bombSprite.animations.add('explode', [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17], 10);
		bombSprite.anchor.setTo(0.5, 0.5);
		//bombSprite.scale.setTo(2, 2);

		//emitter
		emitter_blood = gamevar.add.emitter(0, 0, 100);
		emitter_blood.makeParticles('blood', 0, 300);
		emitter_blood.setScale(1, 2, 1, 2, 3000, Phaser.Easing.Exponential.Out);
		emitter_blood.gravity = 0;
		emitter_blood.particleDrag.setTo(20, 20);
		emitter_blood.angularDrag = 200;
		emitter_blood.minParticleSpeed.setTo(-40, -40);
		emitter_blood.maxParticleSpeed.setTo(40, 40);
		//emitter_blood.setRotation(0, 180);
		//emitter_blood.setYSpeed(-1000, -500);

		if(graphicsLevel > 1){
			//emitter
			emitter_trail = gamevar.add.emitter(-100, 0, 100);
			emitter_trail.makeParticles('trail', 0, 200);
			// emitter_trail.setAll('scale.x', 2);
			// emitter_trail.setAll('scale.y', 2);
			emitter_trail.setAlpha(1, 0, 1000);
			emitter_trail.setScale(3, 1, 3, 1, 1000);
			//emitter_trail.setAll('alpha', .6);
			emitter_trail.gravity = 0;
			emitter_trail.width = 15;
			emitter_trail.height = 15;
			emitter_trail.particleDrag.setTo(20, 20);
			emitter_trail.angularDrag = 200;
			// emitter_trail.minParticleScale = 1;
			// emitter_trail.maxParticleScale = 2;
			emitter_trail.minParticleSpeed.setTo(-40, -40);
			emitter_trail.maxParticleSpeed.setTo(40, 40);
			//emitter_trail.setRotation(0, 180);
			//emitter_trail.setYSpeed(-1000, -500);
		}


		playerSprite = gamevar.add.sprite(100, 100, 'player');
		playerSprite.scale.setTo(.75, .75);
		playerSprite.anchor.setTo(0.5, 0.5);

		gamevar.physics.enable([playerSprite], Phaser.Physics.ARCADE, true);

		//playerSprite.body.setSize(20, 20);

		hurtMask = gamevar.add.sprite(-100, -100, 'redmask');
		hurtMask.scale.setTo(60, 60);
		hurtMask.alpha = 0;

		coinMask = gamevar.add.sprite(-100, -100, 'greenmask');
		coinMask.scale.setTo(60, 60);
		coinMask.alpha = 0;

		bombMask = gamevar.add.sprite(-100, -100, 'yellowmask');
		bombMask.scale.setTo(60, 60);
		bombMask.alpha = 0;

		pausedMask = gamevar.add.sprite(-100, -100, 'blackmask');
		pausedMask.scale.setTo(60, 60);
		pausedMask.alpha = 0;

		playerSprite.body.collideWorldBounds = true;
		
		timer_bombRecharge = gamevar.time.create(false);
		timer_bombRecharge.add(bombRechargeTime, function(){setHasBomb(true); text_bombs.setText(bomb_value);});
		//timer_bombRecharge.start();
		hasBomb = true;


	},

	update: function() {
			
		if(!bPaused){
			gamevar.physics.arcade.overlap(playerSprite, bullets, playerHitByBullet);
			gamevar.physics.arcade.overlap(playerSprite, coins, playerCollectedCoin);

			if(graphicsLevel > 1){
				emitter_trail.x = playerSprite.x;
				emitter_trail.y = playerSprite.y;
				if(Math.abs(playerSprite.deltaX) == 0 && Math.abs(playerSprite.deltaY) == 0){
					emitter_trail.on = false;
				} else if(!emitter_trail.on){
					emitter_trail.start(false, 700, 0, 0);
				}
			}

			if(!hasBomb){
				text_bombs.alpha = CONST_textDefaultAlpha;
			} else {
				text_bombs.alpha = CONST_textHighlightAlpha;
			}
		}
	}

};

function resetGame(){
	resetCoinsAndBullets();
	resetScore();
	lifeEmpty = false;
	lifeMeter.y = gamevar.height + lifeMeterFillRate;
	resetDifficulty();
}

function resetCoinsAndBullets(){
	bullets.forEachAlive(function(bul){
		bul.kill();
	});
}

function resetDifficulty(){

	console.log(difficulty);
	maxDirectionRange = 0;
	difficulty = 0;

	bulletSpawnInterval = 275;
	bulletVelocity = 210;
	bulletVelocity_targeted = 200;
	

}

function resetScore(){
	score_value = 0;
	text_score.setText(score_value);
	setHasBomb(true);
	text_bombs.setText(bomb_value);
}

function setPaused(_bPaused, _bGameOver){
	bPaused = _bPaused;
	var firstButton;
	var firstButtonAction;

	if(_bGameOver){
		if(difficulty > store.get('maxDifficulty')){
			store.set('maxDifficulty', difficulty);
		}
		text_paused.setText('game over');
		firstButton = 'restart';
		firstButtonAction = 'btn_restart';
	} else {
		text_paused.setText('paused');
		firstButton = 'resume';
		firstButtonAction = 'btn_resume';
	}

	text_paused.x = (gamevar.width / 2) - getTextWidth(text_paused) / 2;

	if(_bPaused){

		text_score_gameover = gamevar.add.bitmapText(0, 150, 'carrier', 'Score:' + score_value, 30);
		if(score_value > store.get('hiscore')){
			store.set('hiscore', score_value);
		}
		text_hiscore_gameover = gamevar.add.bitmapText(0, 185, 'carrier', 'Hi-Score:' + store.get('hiscore'), 30);
		centerText(text_score_gameover);
		centerText(text_hiscore_gameover);

		gamevar.add.tween(pausedMask).to( { alpha: .6}, 100, Phaser.Easing.Linear.None, true, 0);
		// pausedMask.alpha = 0.6;
		text_paused.alpha = 1;

		pausedMenuObjects = addMenus([firstButtonAction, firstButton, 40, 'btn_mainmenu', 'main menu', 40], 300);

		console.log('paused');
		timer_bombRecharge.pause();
		timer_difficulty.pause();
		timer_scorePerSec.pause();
		timer_shake.pause();
		lifeMeter.body.velocity.y = 0;
		bullets.forEach(function(bul){
			if(!_bGameOver){
				bul.body.velocity.y = 0;
			}
		});
		emitter_trail.on = false;
		coins.forEach(function(coin){
			coin.trail.on = false;
		});
		gamevar.input.onDown.remove(launchBomb, this);
		// gamevar.world.setBounds(0, 0, 800, 600);
	} else {

		gamevar.add.tween(pausedMask).to( { alpha: 0}, 200, Phaser.Easing.Linear.None, true, 0);
		// pausedMask.alpha = 0;
		text_paused.alpha = 0;

		if(pausedMenuObjects != null){
			for(var i = 0; i < pausedMenuObjects.length; i++){
				if(i % 2 == 0){
					pausedMenuObjects[i].kill();
				} else {
					pausedMenuObjects[i].destroy();
				}
			}
		}

		text_score_gameover.destroy();
		text_hiscore_gameover.destroy();

		console.log('unpaused');
		timer_shake.resume();
		var newBombTimer = 0;
		timer_bombRecharge.resume();
		// if(bombRechargeTime - (gamevar.time.now - lastBombTime) < 0){
		// 	newBombTimer = 0;
		// } else {
		// 	newBombTimer = bombRechargeTime - (gamevar.time.now - lastBombTime);
		// }
		// timer_bombRecharge.add(newBombTimer, function(){
		// 	setHasBomb(true); 
		// 	text_bombs.setText(bomb_value);
		// 	flashText(text_bombs, true);
		// });
		timer_difficulty.resume();
		timer_scorePerSec.resume();
		lifeMeter.body.velocity.y = -lifeMeterFillRate;
		bullets.forEach(function(bul){
			if(bul.vertical){
				bul.body.velocity.x = (bul.direction == 1) ? -bulletVelocity : bulletVelocity;
			} else {
				bul.body.velocity.y = (bul.direction == 2) ? -bulletVelocity : bulletVelocity;
			}
			
		});
		emitter_trail.on = true;
		coins.forEach(function(coin){
			coin.trail.on = true;
		});
		gamevar.input.onDown.add(launchBomb);
		// gamevar.world.setBounds(-50, -50, 850, 650);
	}
}

function initLocalStorage(){
	coins_value = store.get('coins_value') || 0;
	text_coins.setText('Coins: ' + coins_value);
}

function emit_bloodBurst(_x, _y){
	emitter_blood.x = _x;
	emitter_blood.y = _y;

	emitter_blood.start(true, 4000, 0, gamevar.rnd.integerInRange(60, 125));
}

function flashHurt(){
	hurtMask.alpha = 0;
	gamevar.add.tween(hurtMask).to( { alpha: .6}, 100, Phaser.Easing.Linear.None, true, 0, 1, true);
}

function flashCoinCollect(){
	coinMask.alpha = 0;
	gamevar.add.tween(coinMask).to( { alpha: .6}, 100, Phaser.Easing.Linear.None, true, 0, 1, true);
}

function flashBomb(){
	bombMask.alpha = 0;
	gamevar.add.tween(bombMask).to( { alpha: 1}, 200, Phaser.Easing.Linear.None, true, 0, 1, true);
}



function launchBomb(){

	if(hasBomb && !bPaused){
		lastBombTime = gamevar.time.now;
		shakeScreen(20, 100, true);
		flashBomb();
		bullets.forEachAlive(function(_bullet){_bullet.kill();});
		//bombSprite.reset(playerSprite.x, playerSprite.y);
		bBombExploding = true;
		setHasBomb(false);
		text_bombs.setText(bomb_value);
		//bombSprite.alpha = 0;
		// gamevar.add.tween(bombSprite).to( { alpha: 1 }, 150, Phaser.Easing.Linear.None, true, 0).to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(){bombSprite.kill; bBombExploding = false; console.log('done')});

		timer_bombRecharge.add(bombRechargeTime, function(){
			setHasBomb(true); 
			text_bombs.setText(bomb_value);
			centerText(text_bombs);
			text_bombs.y = gamevar.height - textHeightOffset;
			flashText(text_bombs, true);
		});
		timer_bombRecharge.start();
	} else if(!bPaused){
		shakeText(text_bombs, 3, 50, true);
		text_bombs.alpha = CONST_textDefaultAlpha;
	}
}

function playerHitByBullet(_player, _bullet){
	if(!bPlayerDead){
		shakeScreen(10, 100, true);
		flashHurt();
		_bullet.kill();
		//addScore(-50);
		addToLifeMeter(-100);
	}
}

function playerCollectedCoin(_player, _coin){
	//increaseDifficulty();
	flashCoinCollect();
	_coin.kill();
	// gamevar.add.tween(_coin).to({y: '-100', alpha: 0}, 250, Phaser.Easing.Linear.None, true).onComplete.add(function(){/*_coin.kill;*/});
	//_coin.kill();
	spawnCoin();
	//console.log(_coin);
	addCoinValue(_coin.timeValue);
	addScore(75);
	addToLifeMeter(30);
}

function addCoinValue(amount){
	coins_value += amount;
	store.set('coins_value', coins_value);
	text_coins.setText('Coins: ' + coins_value);
}

function addScore(amount){
	score_value += amount;
	text_score.setText(score_value);
	text_score.x = text_score_center - getTextWidth(text_TEST) * Math.floor(score_value.toString().length / 2);
}

function addHealth(amount){
	health_value += amount;
	text_health.setText('Health: ' + health_value);
	if(health_value <= 0 && !bPlayerDead){
		bPlayerDead = true;
		emit_bloodBurst(playerSprite.x, playerSprite.y);
		resetGame(true);
	}
}


function setHasBomb(hasBomb_param){
	if(hasBomb_param){
		hasBomb = true;
		bomb_value = 'yeah.';
	} else {
		hasBomb = false;
		bomb_value = 'no.';
		text_bombs.alpha = CONST_textDefaultAlpha;
	}
}