MainState.Menus = {};

MainState.Menus.Loader = function(game){};
MainState.Menus.Paused = function(game){};
MainState.Menus.Main = function(game){};
MainState.Menus.Credits = function(game){};
MainState.Menus.Options = function(game){};
MainState.Menus.HowTo = function(game){};

var buttonOffset = 10;
var menuItemSpace = 60;
var buttonSizeAdjustment = 10;
var backButtonY = 550;

var advanceScreenKey;
var nextScreen = 'gameplay';
var parentScreen = 'menu_main';

var optionsMenuArr;

var title;
var lastTitleShakeTime = 0;
var menuShakeInterval = 1000;
var titleX;
var titleY;
var emitter_title;

var lastBearShakeTime = 0;
var bearsoapImg;
var bearsoapImgX;
var bearsoapImgY;
var bearShakeInterval = 0;

var sound_switch;
var sound_click;
var music_menu;
var volumeLevel = 3;
var volumeLevel_music = 3;

var menuLifeMeter;
var menuPlayer;
var testBullet;
var testCoin;
var testCoin1;
var testCoin2;

var menuMusicPlaying = false;


MainState.Menus.Main.prototype = {
	//PIXEL PARTY

	preload: function(){
		this.load.image('title', 'assets/title.png');
		this.load.image('trail', 'assets/sprites/shapes/4_white.png');
		this.load.image('bearsoap', 'assets/bearsoap_transparent.png');
	},

	create: function() {
		
		if(menuLifeMeter != null && menuLifeMeter.exists){
				menuLifeMeter.destroy();
		}

		if(store.get('maxDifficulty') == null){
			store.set('maxDifficulty', 0);
		}
		if(store.get('volume_all') != null){
			volumeLevel = store.get('volume_all');
		}
		if(store.get('volume_music') != null){
			volumeLevel_music = store.get('volume_music');
		}
		graphicsLevel = store.get('graphicsLevel') || 2;

		gamevar.world.setBounds(-30, -30, 830, 630);
		gamevar.sound.volume = volumeLevel / 10;
		music_menu = this.add.audio('limbo', 1, true);
		music_menu.volume = volumeLevel_music / 10;
		if(!menuMusicPlaying){
			music_menu.play();
			menuMusicPlaying = true;
			console.log('playing music!');
		}

		title = gamevar.add.image(0, 0, 'title');
		title.scale.setTo(0.95, 0.95);
		title.x = gamevar.width / 2 - title.width / 2;
		title.y = 20;

		titleX = title.x;
		titleY = title.y;


		title.alpha = 0.3;
		gamevar.add.tween(title).to( { alpha: .9 }, 2000, Phaser.Easing.Sinusoidal.InOut, true, 0, 1000, true);

		emitter_title = gamevar.add.emitter(-100, 0, 100);
		emitter_title.makeParticles('trail', 0, 350);
		// emitter_trail.setAll('scale.x', 2);
		// emitter_trail.setAll('scale.y', 2);
		emitter_title.setAlpha(0.5, 0, 2000);
		emitter_title.setScale(3, 1, 3, 1, 2000);
		//emitter_trail.setAll('alpha', .6);
		emitter_title.gravity = -100;
		emitter_title.width = 15;
		emitter_title.height = 15;
		emitter_title.particleDrag.setTo(20, 20);
		emitter_title.angularDrag = 200;
		// emitter_trail.minParticleScale = 1;
		// emitter_trail.maxParticleScale = 2;
		emitter_title.minParticleSpeed.setTo(-80, -80);
		emitter_title.maxParticleSpeed.setTo(80, 80);
		//console.log(emitter_title);
		emitter_title.width = title.width + 10;
		emitter_title.height = title.height;
		emitter_title.x = title.x + emitter_title.width / 2 - 5;
		emitter_title.y = title.y + emitter_title.height / 2;

		title.inputEnabled = true;
		title.events.onInputDown.add(titleShake, this);

		this.stage.backgroundColor = '#aaaaaa';
		console.log('main menu started');
		sound_switch = this.add.audio('switch');
		sound_click = this.add.audio('click');
		//this.add.button(this.world.centerX - 64, 300, 'button_play', buttonPressed_play, this);
		addMenus(['btn_play', 'play', 30, 'btn_howto', 'how to play', 30, 'btn_options', 'options', 30, 'btn_credits', 'credits', 30], 275);
		nextScreen = 'gameplay';

		advanceScreenKey = gamevar.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		advanceScreenKey.onDown.add(advanceScreenCheck);
		//gamevar.state.start('gameplay');
	},

	update: function() {
		if(gamevar.time.now - lastTitleShakeTime > menuShakeInterval){
			lastTitleShakeTime = gamevar.time.now;
			menuShakeInterval = gamevar.rnd.integerInRange(1000, 4000);
			titleShake();
		}
	}

};



MainState.Menus.Credits.prototype = {

	create: function() {

		centerText(gamevar.add.bitmapText(0, 50, 'carrier', 'Made with phaser.js!', 20));
		var phaserLink = gamevar.add.bitmapText(0, 75, 'carrier', '[Phaser homepage]', 15);
		centerText(phaserLink);
		var img = gamevar.add.sprite(phaserLink.x - buttonOffset, phaserLink.y - buttonOffset, 'rect');
		img.crop({x : 0, y : 0 , width : getTextWidth(phaserLink) + 2 * buttonOffset, height : phaserLink.fontSize + 2 * buttonOffset});
		img.alpha = 0;
		img.inputEnabled = true;
		img.linkedText = phaserLink;
		img.linkedText.alpha = .5;
		img.currentHeight = phaserLink.y;
		img.events.onInputDown.add(function(){
			window.open('http://phaser.io/');
		}, this);
		img.events.onInputOver.add(function(_img){
			buttonInputOver(_img);
		});
		img.events.onInputOut.add(function(_img){
			_img.linkedText.alpha = 0.5;
		});

		centerText(gamevar.add.bitmapText(0, 120, 'carrier', 'Music credit: Deco Music', 20));
		var musicLink = gamevar.add.bitmapText(0, 145, 'carrier', '[soundcloud/deco-music]', 15);
		centerText(musicLink);
		var img = gamevar.add.sprite(musicLink.x - buttonOffset, musicLink.y - buttonOffset, 'rect');
		img.crop({x : 0, y : 0 , width : getTextWidth(musicLink) + 2 * buttonOffset, height : musicLink.fontSize + 2 * buttonOffset});
		img.alpha = 0;
		img.inputEnabled = true;
		img.linkedText = musicLink;
		img.linkedText.alpha = .5;
		img.currentHeight = musicLink.y;
		img.events.onInputDown.add(function(){
			window.open('https://soundcloud.com/deco-music');
		}, this);
		img.events.onInputOver.add(function(_img){
			buttonInputOver(_img);
		});
		img.events.onInputOut.add(function(_img){
			_img.linkedText.alpha = 0.5;
		});


		centerText(gamevar.add.bitmapText(0, 185, 'carrier', 'Developed by Bearsoap Software', 20));
		bearsoapImg = gamevar.add.image(100, 330, 'bearsoap');
		bearsoapImg.anchor.setTo(0.5, 0.5);
		bearsoapImg.scale.setTo(0.7, 0.7);
		bearsoapImg.x = gamevar.width / 2;
		bearsoapImgX = bearsoapImg.x;
		bearsoapImgY = bearsoapImg.y;
		bearsoapImg.inputEnabled = true;
		bearsoapImg.events.onInputDown.add(function(){
			window.open('https://twitter.com/bearsoapdev');
		}, this);
		bearsoapImg.events.onInputOver.add(function(){
			shakeBear();
			bearsoapImg.scale.setTo(0.8, 0.8);
		}, this);
		bearsoapImg.events.onInputOut.add(function(){
			bearsoapImg.scale.setTo(0.7, 0.7);
		}, this);


		var emitter_bear = gamevar.add.emitter(-100, 0, 100);
		emitter_bear.makeParticles('trail', 0, 200);
		// emitter_trail.setAll('scale.x', 2);
		// emitter_trail.setAll('scale.y', 2);
		emitter_bear.setAlpha(0.4, 0, 2000);
		emitter_bear.setScale(3, 1, 3, 1, 2000);
		//emitter_trail.setAll('alpha', .6);
		emitter_bear.gravity = -100;
		emitter_bear.particleDrag.setTo(20, 20);
		emitter_bear.angularDrag = 200;
		// emitter_trail.minParticleScale = 1;
		// emitter_trail.maxParticleScale = 2;
		emitter_bear.minParticleSpeed.setTo(-80, -80);
		emitter_bear.maxParticleSpeed.setTo(80, 80);
		//console.log(emitter_bear);
		emitter_bear.width = bearsoapImg.width;
		emitter_bear.height = bearsoapImg.height;
		emitter_bear.x = bearsoapImg.x;
		emitter_bear.y = bearsoapImg.y;
		emitter_bear.start(false, 2000, 150, 0);
		
		centerText(gamevar.add.bitmapText(0, 480, 'carrier', 'High Score:' + store.get('hiscore'), 15));
		centerText(gamevar.add.bitmapText(0, 510, 'carrier', 'Most Time Survived:' + store.get('maxDifficulty') + ' seconds', 15));

		addBackButton();
	},

	update: function() {
		if(gamevar.time.now - lastBearShakeTime > bearShakeInterval){
			shakeBear();
		}
	}

};

function shakeBear(){
	lastBearShakeTime = gamevar.time.now;
	bearShakeInterval = gamevar.rnd.integerInRange(2000, 6000);
	setBGRandomColor(150);
	bearsoapImg.x = bearsoapImgX;
	bearsoapImg.y = bearsoapImgY;
	var shakeAmt = gamevar.rnd.integerInRange(3, 10);
	shakeScreen(shakeAmt / 2, 50, true);
	shakeText(bearsoapImg, shakeAmt, 50, true);
}

MainState.Menus.HowTo.prototype = {

	create: function() {

		menuLifeMeter = gamevar.add.sprite(-100, -100, 'square', 1);
		menuLifeMeter.scale.setTo(60, 50);
		menuLifeMeter.x = -100;
		menuLifeMeter.y = gamevar.height + 10;
		menuLifeMeter.alpha = .2;
		gamevar.physics.enable(menuLifeMeter, Phaser.Physics.ARCADE, true);
		menuLifeMeter.body.velocity.y = -lifeMeterFillRate;

		centerText(gamevar.add.bitmapText(0, 50, 'carrier', 'avoid these guys.', 15));
		centerText(gamevar.add.bitmapText(0, 65 + 5, 'carrier', 'hit one, and the water level rises.', 15));
		this.add.image(500, 100 + 10, 'square', 0);
		this.add.image(420, 80 + 15, 'square', 0);

		testBullet = this.add.sprite(350, 100 + 20, 'square', 0);

		centerText(gamevar.add.bitmapText(0, 160, 'carrier', 'click to launch a bomb!', 15));
		centerText(gamevar.add.bitmapText(0, 185, 'carrier', 'bombs kill all bullets on screen.', 15));
		centerText(gamevar.add.bitmapText(0, 210, 'carrier', 'bombs take 10 seconds to recharge.', 15));

		centerText(gamevar.add.bitmapText(0, 220 + 35, 'carrier', 'the water keeps rising as time goes on.', 15));
		centerText(gamevar.add.bitmapText(0, 235 + 40, 'carrier', 'it\'s okay to touch,', 15));
		centerText(gamevar.add.bitmapText(0, 250 + 45, 'carrier', 'but don\'t let it reach the top', 15));
		centerText(gamevar.add.bitmapText(0, 265 + 50, 'carrier', 'or game over!', 15));

		centerText(gamevar.add.bitmapText(0, 380, 'carrier', 'collect these to lower the water.', 15));
		testCoin1 = this.add.sprite(320, 370 + 50, 'square', 2);
		testCoin2 = this.add.sprite(470, 370 + 60, 'square', 2);
		testCoin = this.add.sprite(250, 370 + 40, 'square', 2);

		testCoin1.animations.add('cycle', [2, 3, 4, 5], 15, true);
		testCoin2.animations.add('cycle', [2, 3, 4, 5], 15, true);
		testCoin.animations.add('cycle', [2, 3, 4, 5], 15, true);
		testCoin1.animations.play('cycle');
		testCoin2.animations.play('cycle');
		testCoin.animations.play('cycle');

		this.physics.enable([testBullet, testCoin], Phaser.Physics.ARCADE, true);

		menuPlayer = this.add.sprite(510, -200, 'player');
		this.physics.enable([menuPlayer], Phaser.Physics.ARCADE, true);
		menuPlayer.scale.setTo(.75, .75);
		menuPlayer.anchor.setTo(0.5, 0.5);
		var newVect = new Phaser.Point(testCoin.x - menuPlayer.x, testCoin.y - menuPlayer.y);
		newVect.normalize();
		newVect.multiply(65, 65);
			
		setTimeout(function(){
			menuPlayer.body.velocity = newVect;
		}, 6000);

		

		centerText(gamevar.add.bitmapText(0, 475, 'carrier', 'good luck!', 20));

		addBackButton();
	},

	update: function() {
		gamevar.physics.arcade.overlap(testBullet, menuPlayer, function(bul){
			bul.kill();
			menuLifeMeter.y -= 100;
		});
		gamevar.physics.arcade.overlap(testCoin, menuPlayer, function(coin){
			coin.kill();
			menuLifeMeter.y += 30;
		});
		if(menuLifeMeter.y < 0){
			menuLifeMeter.y = 0;
		}
	}

};

MainState.Menus.Options.prototype = {

	create: function() {
		nextScreen = 'menu_main';

		optionsMenuArr = addMenus(['btn_volumeLevel_master', 'master volume:' + volumeLevel, 30, 'btn_volumeLevel_music', 'music volume:' + volumeLevel_music, 30, 'btn_graphicsLevel', 'graphics level:' + graphicsLevel, 30], 200);
		addBackButton();
	},

	update: function() {
		music_menu.volume = volumeLevel_music / 10;
	}

};

function titleShake(){
	setBGRandomColor(150);
	title.x = titleX;
	title.y = titleY;
	var shakeAmt = gamevar.rnd.integerInRange(3, 10);
	shakeScreen(shakeAmt / 2, 50, true);
	shakeText(title, shakeAmt, 50, true);
	emitter_title.setScale(shakeAmt / 2, 1, shakeAmt / 2, 1, 2000);
	emitter_title.setAlpha(title.alpha, 0, 2000);
	if(graphicsLevel > 1){
		emitter_title.start(true, 2000, 0, 20);
	}
}

//buttonArr is array of keys for menus
function addMenus(buttonArr, heightOffset) {

	var currentHeight = heightOffset;
	var buttons = [];
	var buttonObjects = [];

	for(var i = 0; i < buttonArr.length; i += 3){
		// var newText = gamevar.add.button((gamevar.width / 2) - 64, currentHeight, buttonArr[i], null, null, 1, 0);
		// newText.name = buttonArr[i] + "";
		// buttons.push(newText);
		// currentHeight += menuItemSpace;
		var btnValue = buttonArr[i + 1] + "";
		var btnSize = buttonArr[i + 2];
		var newText = gamevar.add.bitmapText((gamevar.width / 2) - (getTextWidthFromParam(btnSize, btnValue.length) / 2), currentHeight, 'carrier', btnValue, btnSize);
		newTextX = gamevar.width / 2 - (getTextWidthFromParam(btnSize, btnValue.length) / 2);

		var img = gamevar.add.sprite(newTextX - buttonOffset, currentHeight - buttonOffset, 'rect');
		img.crop({x : 0, y : 0 , width : getTextWidth(newText) + 2 * buttonOffset, height : newText.fontSize + 2 * buttonOffset});
		img.alpha = 0;
		img.inputEnabled = true;
		img.name = buttonArr[i] + "";
		img.currentHeight = currentHeight;
		img.linkedText = newText;
		img.linkedText.alpha = .5;
		img.events.onInputDown.add(buttonPressed, this);
		img.events.onInputOver.add(function(_img){
			buttonInputOver(_img);
		});
		img.events.onInputOut.add(function(_img){
			_img.linkedText.alpha = 0.5;
		});

		buttonObjects.push(img);
		buttonObjects.push(newText);

		currentHeight += menuItemSpace + btnSize / buttonSizeAdjustment;
	}

	return buttonObjects;

	//assignActions(buttons);

}

function buttonInputOver(_img){
	sound_switch.play();
	setBGRandomColor(150);
	centerText(_img.linkedText);
	_img.linkedText.y = _img.currentHeight;
	shakeText(_img.linkedText, 3, 100, true);
	_img.linkedText.alpha = 1;
	textParticleBurst(_img.linkedText);
}

function buttonPressed(btn){
	//console.log(btn.name);
	sound_click.play();
	switch(btn.name){
		case 'btn_play':
			menuMusicPlaying = false;
			gamevar.state.start('gameplay', true);
			break;
		case 'btn_options':
			parentScreen = gamevar.state.current;
			gamevar.state.start('menu_options', true);
			break;
		case 'btn_toggleSound':
			toggleSound();
			break;	
		case 'btn_resume':
			setPaused(false);
			break;			
		case 'btn_back':
			console.log('parent: ' + parentScreen);
			gamevar.state.start(parentScreen, true);
			break;
		case 'btn_mainmenu':
			if(difficulty > store.get('maxDifficulty')){
				store.set('maxDifficulty', difficulty);
			}
			bgMusic.stop();
			if(!music_menu.isPlaying){
				music_menu.play();
			}
			setPaused(false);
			resetGame();
			gamevar.state.start('menu_main', true);

			break;
		case 'btn_credits':
			gamevar.state.start('menu_credits', true);
			break;
		case 'btn_restart':
			setPaused(false);
			resetGame();
			break;
		case 'btn_graphicsLevel':
			graphicsAdvance();
			optionsMenuArr[5].setText('graphics level:' + graphicsLevel);
			break;
		case 'btn_volumeLevel_master':
			volumeAdvance(true);
			optionsMenuArr[1].setText('master volume:' + volumeLevel);
			break;
		case 'btn_volumeLevel_music':
		setFullscreen(false);
			volumeAdvance(false);
			optionsMenuArr[3].setText('music volume:' + volumeLevel_music);
			break;
		case 'btn_howto':
			gamevar.state.start('menu_howto', true);
			break;
		case 'btn_fullscreen':
			setFullscreen(true);
			break;
		default:
	}

}

function addBackButton(){
	btnValue = 'back';
	var backText = gamevar.add.bitmapText((gamevar.width / 2) - (getTextWidthFromParam(30, btnValue.length) / 2), backButtonY, 'carrier', btnValue, 30);	

	var img = gamevar.add.sprite((gamevar.width / 2) - (getTextWidthFromParam(30, backText.text.length) / 2) - buttonOffset, backButtonY - buttonOffset, 'rect');
	img.crop({x : 0, y : 0 , width : getTextWidth(backText) + 2 * buttonOffset, height : backText.fontSize + 2 * buttonOffset});
	img.alpha = 0;
	img.inputEnabled = true;
	img.name = 'btn_back';
	img.linkedText = backText;
	img.linkedText.alpha = 0.5;
	img.currentHeight = backButtonY;
	img.events.onInputDown.add(buttonPressed, this);
	img.events.onInputOver.add(function(_img){
			buttonInputOver(_img);
	});
	img.events.onInputOut.add(function(_img){
			_img.linkedText.alpha = 0.5;
	});

	//backText.inputEnabled = true;
	//backText.events.onInputDown.add(buttonPressed, this);
	// backText.name = 'btn_back';
}

function advanceScreenCheck(){
	gamevar.state.start(nextScreen);
}

function getTextWidth(bitmapTxt){
	//ONLY WORKS FOR CARRIER COMMAND FONT
	return (bitmapTxt.fontSize * bitmapTxt.text.length) * 1.18;
}

function getTextWidthFromParam(fontSize, length){
	//ONLY WORKS FOR CARRIER COMMAND FONT
	return (fontSize * length) * 1.15;
}

