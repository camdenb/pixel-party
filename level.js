MainState.Level = function(game) {
};


var timerEvent_bulletSpawn;
var timer_bulletSpawn;
var timerEvent_coinSpawn;
var timer_coinSpawn;
var timer_shake;
var timer_difficulty;
var timer_difficulty_walls;

var currentLevel = 0;

var CONST_bulletSpawnInterval = 275;
var CONST_bulletVelocity = 210;
var CONST_bulletVelocity_random = 200;

var lastBulletSpawnTime = 0;

var bulletSpawnInterval = CONST_bulletSpawnInterval;
var bulletVelocity = CONST_bulletVelocity;
var bulletVelocity_random = CONST_bulletVelocity_random;

var coinSpawnInterval = 4000;

var bullets;
var bullet;
var bOnlyRandomBullets = false;
var bOnlyNormalBullets = false;

var highestDifficulty = 0;
var difficulty = 0;
var maxDirectionRange = 0;

var coins;
var coin;


var lifeMeter;
var lifeEmpty = false;

var bPaused = false;
var bDeathPause = false;

var bgMusic;

//ACHIEVEMENT BOOLEANS!
var bUsedBombThisRound = false;
var coinsCollectedThisRound = 0;
var lastCoinCollectedTime = 0;
var bPlayerHitThisRound = false;

var graphicsLevel = 2;

MainState.Level.prototype = {

	preload: function() {
		gamevar.load.spritesheet('square', 'assets/sprites/shapes/16_ss2.png', 16, 16);
		gamevar.load.audio('stutter', 'assets/sound/music/stutter.mp3');
		gamevar.load.audio('switch', 'assets/sound/ui/switch30.ogg');
		gamevar.load.audio('click', 'assets/sound/ui/switch32.ogg');
		gamevar.load.audio('limbo', 'assets/sound/music/limbo.ogg');

	},

	create: function() {
		// gamevar.stage.backgroundColor = '#EE99FF';
		// console.log(Phaser.Color.RGBtoHexstring(Phaser.Color.getRandomColor(0, 255)));

		// gamevar.world.setBounds(-30, -30, 830, 630);


		music_menu.stop();
		gamevar.sound.stopAll();
		menuMusicPlaying = false;
		bgMusic = gamevar.add.audio('stutter', 1, true);
		bgMusic.volume = volumeLevel_music / 10;
		bgMusic.play();
		gameMusicPlaying = true;
		setBGRandomColor(175);
		//gamevar.physics.arcade.gravity.y = 1700;

		resetPerRoundAchievementValues();

		//bullets
		bullets = gamevar.add.group();
		bullets.enableBody = true;
    	bullets.physicsBodyType = Phaser.Physics.ARCADE;
    	bullets.createMultiple(300, 'square', 0, false);
    	bullets.setAll('anchor.x', 0.5);
    	bullets.setAll('anchor.y', 0.5);
    	bullets.setAll('body.allowGravity', false);
    	bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);
		bullets.setProperty('random', false);
		bullets.setProperty('direction', 0);
		bullets.setProperty('vertical', true);
		//bullets.setProperty('trail', Phaser.Emitter);
		bullets.forEach(function(bullet){
			if(graphicsLevel > 2){
				bullet.trail = gamevar.add.emitter(-200, -200, 100);
				bullet.trail.makeParticles('trail-bullet', 0, 50);
				// emitter_trail.setAll('scale.x', 2);
				// emitter_trail.setAll('scale.y', 2);
				bullet.trail.setAlpha(1, 0, 600);
				bullet.trail.setScale(3, 1, 3, 1, 600);
				//emitter_trail.setAll('alpha', .6);
				bullet.trail.gravity = 0;
				bullet.trail.width = 10;
				bullet.trail.height = 10;
				bullet.trail.particleDrag.setTo(20, 20);
				bullet.trail.angularDrag = 200;
				// emitter_trail.minParticleScale = 1;
				// emitter_trail.maxParticleScale = 2;
				bullet.trail.minParticleSpeed.setTo(-40, -40);
				bullet.trail.maxParticleSpeed.setTo(40, 40);
				bullet.trail.start(false, 700, 50, 0);
			}
			bullet.frame = 0;
			bullet.body.setSize(10, 10);
		});
		// bullets.setProperty('line', new Phaser.Line);

		// timer_bulletSpawn = gamevar.time.create(false);
		// timerEvent_bulletSpawn = timer_bulletSpawn.loop(bulletSpawnInterval, spawnBullet);
		// timer_bulletSpawn.start();

		//coins
		coins = gamevar.add.group();
		coins.enableBody = true;
    	coins.physicsBodyType = Phaser.Physics.ARCADE;
    	coins.createMultiple(3, 'square', 0, false);
    	coins.setAll('anchor.x', 0.5);
    	coins.setAll('anchor.y', 0.5);
    	coins.setAll('body.allowGravity', false);
    	coins.setProperty('timeValue', 10);
   		coins.forEach(function(coin){
			if(graphicsLevel > 1){
				coin.trail = gamevar.add.emitter(100, 100, 100);
				coin.trail.makeParticles('trail', 0, 50);
				// emitter_trail.setAll('scale.x', 2);
				// emitter_trail.setAll('scale.y', 2);
				coin.trail.setAlpha(.8, 0, 2000);
				coin.trail.setScale(2, 0.5, 2, 0.5, 2000);
				//emitter_trail.setAll('alpha', .6);
				coin.trail.gravity = 0;
				coin.trail.width = 10;
				coin.trail.height = 10;
				coin.trail.particleDrag.setTo(20, 20);
				coin.trail.angularDrag = 200;
				// emitter_trail.minParticleScale = 1;
				// emitter_trail.maxParticleScale = 2;
				coin.trail.minParticleSpeed.setTo(-90, -90);
				coin.trail.maxParticleSpeed.setTo(90, 90);
				coin.trail.start(false, 2000, 300, 0);
			}
			coin.scale.setTo(1.1, 1.1);
			coin.frame = 2;
			coin.animations.add('cycle', [2, 3, 4, 5], 15, true);
		});
		

  //   	timer_coinSpawn = gamevar.time.create(false);
		// timerEvent_coinSpawn = timer_coinSpawn.loop(coinSpawnInterval, spawnCoin);
		// timer_coinSpawn.start();

		timer_scorePerSec = gamevar.time.create(false);
		timerEvent_scorePerSec = timer_scorePerSec.loop(300, function(){addScore(1);});
		timer_scorePerSec.start();

		timer_difficulty = gamevar.time.create(false);
		timer_difficulty.loop(1000, function(){increaseDifficulty();});
		timer_difficulty.start();

		timer_difficulty_walls = gamevar.time.create(false);
		timer_difficulty_walls.loop(25000, function(){increaseDifficulty_Walls();});
		// timer_difficulty_walls.start();
		
		timer_shake = gamevar.time.create(false);
		timer_shake.loop(300, function(){
			shakeScreen((gamevar.height - lifeMeter.y) / 100, 40, true)
		});
		timer_shake.start();
		

		spawnCoin();
		updateDifficulty();


	},

	update: function() {

		if((!bPaused || lifeEmpty) && gamevar.time.now - lastBulletSpawnTime > bulletSpawnInterval){
			spawnBullet();
			lastBulletSpawnTime = gamevar.time.now;
		}

		if(music_menu.isPlaying){
			music_menu.stop();
		}

		if(!bPaused){
			if(graphicsLevel > 2){
				bullets.forEach(function(bullet){
					bullet.trail.x = bullet.x;
					bullet.trail.y = bullet.y;
				});
			}
			coins.forEach(function(coin){
				coin.animations.play('cycle');
				if(graphicsLevel > 1){
					if(coin.exists){
						coin.trail.x = coin.x;
						coin.trail.y = coin.y;
					} else {	
						coin.trail.on = false;
					}
				}
			});
		}
	}

};


function resetPerRoundAchievementValues(){
	lastCoinCollectedTime = 0;
	bUsedBombThisRound = false;
	coinsCollectedThisRound = 0;
	bPlayerHitThisRound = false;
}

function onLeaveGameplay(){
	if(difficulty > store.get('maxDifficulty')){
		store.set('maxDifficulty', difficulty);
	}
	checkForAchievements();
	console.log(bUsedBombThisRound);
}

function checkForAchievements(){
	if(!bUsedBombThisRound && difficulty > getAchProgress(2)){
		setAchProgress(2, difficulty);
	}
}

function addToLifeMeter(amount){
	lifeMeter.y += amount;
	if(lifeMeter.y > gamevar.height + lifeMeterFillRate){
		lifeMeter.y = gamevar.height + lifeMeterFillRate;
	}
}

function setBGRandomColor(brightness){
	var newColorString = Phaser.Color.RGBtoWebstring(Phaser.Color.getRandomColor(brightness - 50, brightness + 50));
	var newTinyColor = tinycolor(newColorString);
	tinycolor.saturate(newTinyColor, 100);
	tinycolor.lighten(newTinyColor, 100);
	gamevar.stage.backgroundColor = newTinyColor.toHexString()
}


function increaseDifficulty(){
	difficulty++;
	updateDifficulty();
	if(!bPlayerHitThisRound && difficulty > getAchProgress(6)){
		setAchProgress(6, difficulty);
	}
}

function updateDifficulty(){
	if(Math.floor(difficulty / 50) < 5){
		var oldMaxDir = maxDirectionRange;
		maxDirectionRange = Math.floor(difficulty / 50);
		if(maxDirectionRange - oldMaxDir != 0){
			setBGRandomColor(150);
			textAlert('difficulty increase!', 100);
		}

	} else {
		maxDirectionRange = 4;
	}
	//console.log(difficultyAdditions[currentLevel][currentEvent]);
	var difficultyToSubtract = (difficulty / 2 > CONST_bulletSpawnInterval + 10) ? 10 : CONST_bulletSpawnInterval - (difficulty / 2);
	bulletSpawnInterval = difficultyToSubtract;
	bulletVelocity = CONST_bulletVelocity + (difficulty / 4);
	bulletVelocity_random = CONST_bulletVelocity_random + (difficulty / 4);
}

function spawnBullet(){

	//console.log('spawned bullet');
	bullet = bullets.getFirstExists(false);
	var randomPoint;

	if(bOnlyRandomBullets){
		randomPoint = new Phaser.Point(gamevar.rnd.integerInRange(0, gamevar.width), gamevar.rnd.integerInRange(0, gamevar.height));
		bullet.random = true;
		bullet.frame = 0;
	} else if (bOnlyNormalBullets){
		bullet.random = false;
		bullet.frame = 0;
	} else if(difficulty > 200 && gamevar.rnd.integerInRange(0, 3) == 0){
		randomPoint = new Phaser.Point(gamevar.rnd.integerInRange(0, gamevar.width), gamevar.rnd.integerInRange(0, gamevar.height));
		bullet.random = true;
		bullet.frame = 0;
	} else {
		bullet.random = false;
		bullet.frame = 0;
	}

	

	var boundsMin;
	var boundsMax;
	var spawnPoint;
	var spawnPointOffset = 0;
	var stageOffset = 10;
	var bVertical = false;

	var direction = gamevar.rnd.integerInRange(0, maxDirectionRange); //0 is north, 1 is east, etc clockwise...
	bullet.direction = direction;

	switch(direction){
		case 0:
			randomPoint = new Phaser.Point(gamevar.rnd.integerInRange(0, gamevar.width), gamevar.height)
			spawnPoint = -spawnPointOffset;
			bVertical = false;
			break;
		case 1:
			randomPoint = new Phaser.Point(0, gamevar.rnd.integerInRange(0, gamevar.height))
			spawnPoint = gamevar.width + spawnPointOffset;
			bVertical = true;
			break;
		case 2:
			randomPoint = new Phaser.Point(gamevar.rnd.integerInRange(0, gamevar.width), 0)
			spawnPoint = gamevar.height + spawnPointOffset;
			bVertical = false;
			break;
		case 3:
			randomPoint = new Phaser.Point(gamevar.width, gamevar.rnd.integerInRange(0, gamevar.height))
			spawnPoint = -spawnPointOffset;
			bVertical = true;
			break;
	}

	bullet.vertical = bVertical;

	if(bVertical){
		boundsMin = stageOffset;
		boundsMax = gamevar.height - stageOffset;
		bullet.reset(spawnPoint, gamevar.rnd.integerInRange(boundsMin, boundsMax));
		if(bullet.random){
			var targetVector = new Phaser.Point(randomPoint.x - bullet.x, randomPoint.y - bullet.y);
			targetVector.normalize();
			targetVector.multiply(bulletVelocity_random, bulletVelocity_random);
			bullet.body.velocity = targetVector;
		} else {
			bullet.body.velocity.x = (direction == 1) ? -bulletVelocity : bulletVelocity;
		}
	} else {
		boundsMin = stageOffset;
		boundsMax = gamevar.width - stageOffset;
		bullet.reset(gamevar.rnd.integerInRange(boundsMin, boundsMax), spawnPoint);
		if(bullet.random){
			var targetVector = new Phaser.Point(randomPoint.x - bullet.x, randomPoint.y - bullet.y);
			targetVector.normalize();
			targetVector.multiply(bulletVelocity_random, bulletVelocity_random);
			bullet.body.velocity = targetVector;
		} else {
			bullet.body.velocity.y = (direction == 2) ? -bulletVelocity : bulletVelocity;
		}
	}
	// bullet.line = new Phaser.Line(bullet.x, bullet.y, bullet.x + bullet.body.velocity.x, bullet.y + bullet.body.velocity.y);
}

function spawnCoin(){
	var coinSpawnOffset = 100;
	var _x = gamevar.rnd.integerInRange(coinSpawnOffset, gamevar.width - coinSpawnOffset);
	var _y = gamevar.rnd.integerInRange(coinSpawnOffset, gamevar.height - coinSpawnOffset);


	coin = coins.getFirstExists(false);
	coin.reset(_x, _y);

	return coin;
}


function bulletHitByBomb(_bomb, _bullet){
	_bullet.kill();
}

function shakeScreen(amount, time, isRandomish){
	//thanks to lessmilk for the inspiration
	var amtX = amount;
	var amtY = amount;
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
		gamevar.add.tween(gamevar.camera).to({x : amtX}, time, Phaser.Easing.Linear.None, true, 0).to({x : -amtX}, time, Phaser.Easing.Linear.None, true, 0).to({x : 0}, time, Phaser.Easing.Linear.None, true, 0);
	}

	if(enableY){
		gamevar.add.tween(gamevar.camera).to({y : amtY}, time, Phaser.Easing.Linear.None, true, 0).to({y : -amtY}, time, Phaser.Easing.Linear.None, true, 0).to({y : 0}, time, Phaser.Easing.Linear.None, true, 0);;
	}
}

function addEachBulletVelocity(amount){
	bullets.forEachExists(function(bullet){
		switch(bullet.direction){
		case 0:
			bullet.body.velocity.y += amount;
			break;
		case 1:
			bullet.body.velocity.x -= amount;
			break;
		case 2:
			bullet.body.velocity.y -= amount;
			break;
		case 3:
			bullet.body.velocity.x += amount;
			break;
	}
	});
}
