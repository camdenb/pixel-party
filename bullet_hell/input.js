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

var songs;
var currentSong;
var currentSongStart = 0;
var currentSongPosition = 0;

var musicStartTime;
var musicEventTimes = [1000, 2000, 3000];
var musicEventShakeOffset = 0;
var eventsDone = [false, false, false];
var eventsDoneCheck = false;
var currentEvent = 0;

MainState.Input.prototype = {

	preload: function() {
		gamevar.load.audio('glitchitup', 'assets/sound/music/glitchitup.ogg');
		gamevar.load.audio('seaoflava', 'assets/sound/music/seaoflava.ogg');
		gamevar.load.audio('8bitfight', 'assets/sound/music/8bitfight.ogg');
		gamevar.load.audio('justkillit', 'assets/sound/music/justkillit.ogg');
	},

	create: function() {
		cursors = gamevar.input.keyboard.createCursorKeys();
		resetKey = gamevar.input.keyboard.addKey(Phaser.Keyboard.R);
		pauseKey = gamevar.input.keyboard.addKey(Phaser.Keyboard.ESC);
		skipKey = gamevar.input.keyboard.addKey(Phaser.Keyboard.S);
		//bombKey = gamevar.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		
		gamevar.input.onDown.add(launchBomb);

		skipKey.onDown.add(function(){
			//currentSong.addMarker('before1', 110, 20);
			//currentSong.currentTime = curTime + 10000;
			currentSong.stop();
			var timeToSkipTo = 220;
			currentEvent = getEventFromTime(timeToSkipTo * 1000);
			currentSong.play('', timeToSkipTo, 1, false, true);
			currentSongPosition = timeToSkipTo;
			currentSongStart = gamevar.time.now - timeToSkipTo * 1000;
		});

		resetKey.onDown.add(function(){resetGame(false)});
		pauseKey.onDown.add(function(){
			setPaused(!gamevar.paused);
		});
		//bombKey.onDown.add(launchBomb);

		text_score = gamevar.add.bitmapText(200, 200, 'carrier', 'Score: ' + score_value, 40);
		text_coins = gamevar.add.bitmapText(200, 275, 'carrier', 'Coins: ' + coins_value, 40);
		text_health = gamevar.add.bitmapText(200, 350, 'carrier', 'Health: ' + health_value, 40);
		text_bombs = gamevar.add.bitmapText(200, 425, 'carrier', 'Bomb? ' + bomb_value, 40);

		songs = [gamevar.add.audio('8bitfight', 1, true), 11100, 13000, 14000,
				gamevar.add.audio('seaoflava', 1, true), 14700, 16000, 17000,
				gamevar.add.audio('justkillit', 1, true), 5800, 120000, 168000,
				gamevar.add.audio('glitchitup', 1, true), 21000, 214500, 234000]
				
				

		setCurrentLevel(2);
		currentSongPosition = 0;
		currentSongStart = gamevar.time.now;
		currentSong.play();
		currentSong.onPlay.add(function(){
			
			currentSongStart = gamevar.time.now;
		});

	},

	update: function() {
		currentSongPosition = gamevar.time.now - currentSongStart;
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

		if((!eventsDoneCheck || !eventsDone[currentEvent]) && currentSongPosition > musicEventTimes[currentEvent]){
			eventsDone[currentEvent] = true;
			console.log('event! ' + currentEvent);

			playMusicEvent();
		}

		if(currentEvent == 3){
			setBGRandomColor();
		}

	}

};

function getEventFromTime(timeChk){
	var test1 = songs[currentLevel * 4 + 1];
	var test2 = songs[currentLevel * 4 + 2];
	var test3 = songs[currentLevel * 4 + 3];
	if(timeChk < test1){
		return 0;
	} else if(timeChk > test1 && timeChk < test2){
		return 1;
	} else if(timeChk > test2 && timeChk < test3){
		return 2;
	} else if(timeChk > test3){
		return 2;
	} else {
		return null;
	}
}

