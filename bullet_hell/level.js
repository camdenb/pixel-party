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

var CONST_bulletSpawnInterval = 400;
var CONST_bulletVelocity = 200;
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

var difficulty = 0;
var difficultyAdditions = [[100, 250, 400], [100, 250, 400], [100, 250, 400], [150, 300, 400]];
var maxDirectionRange = 0;
var difficultyToAdd = 0;

var coins;
var coin;
var shine;

var bDeathPause = false;

var graphicsLevel = 2;

MainState.Level.prototype = {

	preload: function() {
		gamevar.load.spritesheet('bullet', 'assets/sprites/shapes/16_ss.png', 16, 16);
		gamevar.load.image('coin', 'assets/sprites/shapes/16_green1.png');
		gamevar.load.image('shine', 'assets/sprites/shine.png');

	},

	create: function() {
		// gamevar.stage.backgroundColor = '#EE99FF';
		// console.log(Phaser.Color.RGBtoHexstring(Phaser.Color.getRandomColor(0, 255)));
		gamevar.world.setBounds(-50, -50, 900, 700);
		setBGRandomColor();
		//gamevar.physics.arcade.gravity.y = 1700;

		shine = gamevar.add.sprite(-200, 0, 'shine');
		shine.anchor.setTo(0.5, 0.5);



		//bullets
		bullets = gamevar.add.group();
		bullets.enableBody = true;
    	bullets.physicsBodyType = Phaser.Physics.ARCADE;
    	bullets.createMultiple(60, 'bullet', 0, false);
    	bullets.setAll('anchor.x', 0.5);
    	bullets.setAll('anchor.y', 0.5);
    	bullets.setAll('body.allowGravity', false);
    	bullets.setAll('outOfBoundsKill', true);
		bullets.setAll('checkWorldBounds', true);
		bullets.setProperty('random', false);
		bullets.setProperty('direction', 0);
		//bullets.setProperty('trail', Phaser.Emitter);
		if(graphicsLevel > 2){
			bullets.forEach(function(bullet){
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
			});
		}
		// bullets.setProperty('line', new Phaser.Line);

		// timer_bulletSpawn = gamevar.time.create(false);
		// timerEvent_bulletSpawn = timer_bulletSpawn.loop(bulletSpawnInterval, spawnBullet);
		// timer_bulletSpawn.start();

		//coins
		coins = gamevar.add.group();
		coins.enableBody = true;
    	coins.physicsBodyType = Phaser.Physics.ARCADE;
    	coins.createMultiple(10, 'coin', 0, false);
    	coins.setAll('anchor.x', 0.5);
    	coins.setAll('anchor.y', 0.5);
    	coins.setAll('body.allowGravity', false);
    	coins.setProperty('timeValue', 10);
    	if(graphicsLevel > 1){
			coins.forEach(function(coin){
				coin.trail = gamevar.add.emitter(-200, -200, 100);
				coin.trail.makeParticles('trail', 0, 50);
				// emitter_trail.setAll('scale.x', 2);
				// emitter_trail.setAll('scale.y', 2);
				coin.trail.setAlpha(1, 0, 1500);
				coin.trail.setScale(3, 1, 3, 1, 1500);
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
				coin.trail.start(false, 700, 200, 0);
			});
		}

  //   	timer_coinSpawn = gamevar.time.create(false);
		// timerEvent_coinSpawn = timer_coinSpawn.loop(coinSpawnInterval, spawnCoin);
		// timer_coinSpawn.start();

		timer_scorePerSec = gamevar.time.create(false);
		timerEvent_scorePerSec = timer_scorePerSec.loop(1000, function(){addScore(10);});
		//timer_scorePerSec.start();

		timer_difficulty = gamevar.time.create(false);
		timer_difficulty.loop(5000, function(){increaseDifficulty();});
		timer_difficulty.start();

		timer_difficulty_walls = gamevar.time.create(false);
		timer_difficulty_walls.loop(25000, function(){increaseDifficulty_Walls();});
		// timer_difficulty_walls.start();
		
		timer_shake = gamevar.time.create(false);
		timer_shake.loop(300, function(){shakeScreen(difficulty / 20 + currentEvent * 2, 40, true)});
		timer_shake.start();

		spawnCoin();
		updateDifficulty();
		musicStartTime = gamevar.time.now;

	},

	update: function() {
		if(gamevar.time.now - lastBulletSpawnTime > bulletSpawnInterval){
			spawnBullet();
			lastBulletSpawnTime = gamevar.time.now;
		}

		if(graphicsLevel > 2){
			bullets.forEach(function(bullet){
				bullet.trail.x = bullet.x;
				bullet.trail.y = bullet.y;
			});
		}
		if(graphicsLevel > 1){
			coins.forEach(function(coin){
				coin.trail.x = coin.x;
				coin.trail.y = coin.y;
			});
		}
	}

};

function setBGRandomColor(){
	gamevar.stage.backgroundColor = Phaser.Color.RGBtoWebstring(Phaser.Color.getRandomColor(150, 235));
}

function toggleSound(){
	if(gamevar.sound.mute){
		gamevar.sound.mute = false;
		gamevar.sound.volume = .3;
	} else {
		gamevar.sound.mute = true;
	}
}

function increaseDifficulty(){
	difficulty++;
	updateDifficulty();
}

function updateDifficulty(){
	difficultyToAdd = (currentEvent < 1) ? 0 : difficultyAdditions[currentLevel][currentEvent - 1];
	//console.log(difficultyAdditions[currentLevel][currentEvent]);
	bulletSpawnInterval = CONST_bulletSpawnInterval - (difficulty / 6) - difficultyToAdd / 2;
	bulletVelocity = CONST_bulletVelocity + (difficulty / 5) + difficultyToAdd;
	bulletVelocity_random = CONST_bulletVelocity_random + (difficulty / 5) + difficultyToAdd;
}

function increaseDifficulty_Walls(){
	if(maxDirectionRange < 4){
		maxDirectionRange++;
	} else {
		timer_difficulty_walls.on = false;
	}
}

function spawnBullet(){

	//console.log('spawned bullet');
	bullet = bullets.getFirstExists(false);
	var randomPoint;

	if(bOnlyRandomBullets){
		randomPoint = new Phaser.Point(gamevar.rnd.integerInRange(0, gamevar.width), gamevar.rnd.integerInRange(0, gamevar.height));
		bullet.random = true;
		bullet.frame = 1;
	} else if (bOnlyNormalBullets){
		bullet.random = false;
		bullet.frame = 0;
	} else if(difficulty > 40 && gamevar.rnd.integerInRange(0, 5) == 0){
		randomPoint = new Phaser.Point(gamevar.rnd.integerInRange(0, gamevar.width), gamevar.rnd.integerInRange(0, gamevar.height));
		bullet.random = true;
		bullet.frame = 1;
	} else {
		bullet.random = false;
		bullet.frame = 0;
	}

	

	var boundsMin;
	var boundsMax;
	var spawnPoint;
	var spawnPointOffset = 100;
	var stageOffset = 100;
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
	var coinSpawnOffset = 75;
	var _x = gamevar.rnd.integerInRange(coinSpawnOffset, gamevar.width - coinSpawnOffset);
	var _y = gamevar.rnd.integerInRange(coinSpawnOffset, gamevar.height - coinSpawnOffset);


	coin = coins.getFirstExists(false);
	coin.reset(_x, _y);
	coin.timeValue = 1;
	// coin.timer = gamevar.time.create(false);
	// coin.timer.loop(2000, function(){
	// 	if(coin.timeValue > 5){
	// 		coin.timeValue--; 
	// 	} else {
	// 		coin.timeValue = 5;
	// 		coin.timer.stop();
	// 	}
	// });
	// coin.timer.start();

	shine.reset(_x, _y);
	shine.scale.setTo(.3, .3);
	gamevar.add.tween(shine.scale).to( { x: 1.5, y: 1.5}, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, 20, true);
}

function resetGame(bDeath){
	if(bDeath){
		bDeathPause = true;
		gamevar.time.events.add(4000, function(){
			gamevar.state.start('gameplay');
			resetScores();
			resetDifficulty();
			gamevar.stage.backgroundColor = Phaser.Color.RGBtoWebstring(Phaser.Color.getRandomColor(150, 235));
			bDeathPause = false;
			bPlayerDead = false;
		});
	} else {
		gamevar.state.start('gameplay');
		resetScores();
		resetDifficulty();
		gamevar.stage.backgroundColor = Phaser.Color.RGBtoWebstring(Phaser.Color.getRandomColor(150, 235));
	}
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

function playMusicEvent(){
	if(currentEvent <= 2){
		currentEvent++;
	}
	updateDifficulty();
	setBGRandomColor();
	addEachBulletVelocity(difficultyToAdd);
	switch(currentEvent - 1){
		case 0:
			increaseDifficulty_Walls();
			break;
		case 1:
			increaseDifficulty_Walls();
			break;
		case 2:
			increaseDifficulty_Walls();
			break;
		default:
			console.log('song doesn\'t exist');
	}
	musicEventShakeOffset = 2;
}

function setCurrentLevel(newLevel){
	currentLevel = newLevel;
	currentSong = songs[newLevel * 4];
	musicEventTimes[0] = songs[newLevel * 4 + 1];
	musicEventTimes[1] = songs[newLevel * 4 + 2];
	musicEventTimes[2] = songs[newLevel * 4 + 3];
	switch(newLevel){
		case 0:
			bOnlyNormalBullets = true;
			bOnlyRandomBullets = false;
			break;
		case 1:
			bOnlyNormalBullets = true;
			bOnlyRandomBullets = false;
			break;
		case 2:
			bOnlyNormalBullets = false;
			bOnlyRandomBullets = false;
			break;
		case 3:
			bOnlyNormalBullets = false;
			bOnlyRandomBullets = true;
			break;
		default:
			console.log('song doesn\'t exist');
	}
}