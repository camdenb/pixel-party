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
		gamevar.load.image('trail', 'assets/sprites/shapes/4_white.png');
		gamevar.load.image('trail-bullet', 'assets/sprites/shapes/4_orange.png');
		//gamevar.load.spritesheet('explosion', 'assets/sprites/anim/explosion-ss.png', 128, 128);
		
	},

	create: function() {

		initLocalStorage();

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

		gamevar.physics.enable([playerSprite, bombSprite], Phaser.Physics.ARCADE, true);

		playerSprite.body.setSize(20, 20);

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
		timer_bombRecharge.add(bombRechargeTime, function(){setHasBomb(true); text_bombs.setText('Bomb? ' + bomb_value);});
		timer_bombRecharge.start();
		hasBomb = true;

	},

	update: function() {
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

	}

};

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


function setPaused(bPaused){
	if(bPaused){
		pausedMask.alpha = 0;
		gamevar.add.tween(pausedMask).to( { alpha: .6}, 100, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(){
			// gamevar.state.start('menu_paused', false);
			gamevar.paused = true;
		});
	} else {
		pausedMask.alpha = 0;
		gamevar.paused = false;
	}
}

function launchBomb(){
	if(hasBomb){
		shakeScreen(20, 100, true);
		flashBomb();
		bullets.forEachAlive(function(_bullet){_bullet.kill();});
		//bombSprite.reset(playerSprite.x, playerSprite.y);
		bBombExploding = true;
		setHasBomb(false);
		text_bombs.setText('Bomb? ' + bomb_value);
		//bombSprite.alpha = 0;
		// gamevar.add.tween(bombSprite).to( { alpha: 1 }, 150, Phaser.Easing.Linear.None, true, 0).to( { alpha: 0 }, 250, Phaser.Easing.Linear.None, true, 0).onComplete.add(function(){bombSprite.kill; bBombExploding = false; console.log('done')});

		timer_bombRecharge.add(bombRechargeTime, function(){setHasBomb(true); text_bombs.setText('Bomb? ' + bomb_value);});
		timer_bombRecharge.start();
	}
}

function playerHitByBullet(_player, _bullet){
	if(!bPlayerDead){
		shakeScreen(10, 100, true);
		flashHurt();
		_bullet.kill();
		//addScore(-50);
		addHealth(-1);
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
	text_score.setText('Score: ' + score_value);
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

function resetScores(){

	//coins_value = 0;
	//text_coins.setText('Coins: ' + coins_value);

	score_value = 0;
	text_score.setText('Score: ' + score_value);

	health_value = PLAYER_MAXHEALTH;
	text_health.setText('Health: ' + health_value);

}

function resetDifficulty(){

	bulletSpawnInterval = CONST_bulletSpawnInterval;
	bulletVelocity = CONST_bulletVelocity;
	bulletVelocity_targeted = CONST_bulletVelocity_targeted;

	difficulty = 0;
	console.log(difficulty);
	maxDirectionRange = 0;

}

function setHasBomb(hasBomb_param){
	if(hasBomb_param){
		hasBomb = true;
		bomb_value = 'yeah.';
	} else {
		hasBomb = false;
		bomb_value = 'no.';
	}
}