MainState.Menus = {};

MainState.Menus.Loader = function(game){};
MainState.Menus.Paused = function(game){};
MainState.Menus.Main = function(game){};
MainState.Menus.Modes = function(game){};
MainState.Menus.Options = function(game){};

var heightOffset = 250;
var buttonOffset = 5;
var menuItemSpace = 70;
var buttonSizeAdjustment = 2;
var backButtonY = 500;

var advanceScreenKey;
var nextScreen = 'gameplay';
var parentScreen = 'menu_main';

var sound_switch;

MainState.Menus.Paused.prototype = {

	create: function() {
		addMenus(['btn_resume', 'resume', 60, 'btn_options', 'options', 40]);
		nextScreen = 'gameplay';
	},

	update: function() {
	}

};


MainState.Menus.Main.prototype = {
	//PIXEL PARTY

	preload: function(){
		this.load.audio('switch', 'assets/sound/ui/switch30.ogg');
	},

	create: function() {
		this.stage.backgroundColor = '#aaaaaa';
		console.log('main menu started');
		sound_switch = this.add.audio('switch');
		//this.add.button(this.world.centerX - 64, 300, 'button_play', buttonPressed_play, this);
		addMenus(['btn_play', 'play', 60, 'btn_options', 'options', 40]);

		nextScreen = 'gameplay';

		advanceScreenKey = gamevar.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		advanceScreenKey.onDown.add(advanceScreenCheck);
		//gamevar.state.start('gameplay');
	},

	update: function() {
	}

};



MainState.Menus.Modes.prototype = {

	create: function() {
		addMenus(['button_endless', 'button_timed']);
		nextScreen = 'gameplay';
	},

	update: function() {
	}

};

MainState.Menus.Options.prototype = {

	create: function() {
		nextScreen = 'menu_main';

		addMenus(['btn_toggleSound', 'toggle sound', 30]);
		addBackButton();
	},

	update: function() {
	}

};

//buttonArr is array of keys for menus
function addMenus(buttonArr) {

	var currentHeight = heightOffset;
	var buttons = [];

	for(var i = 0; i < buttonArr.length; i += 3){
		// var newText = gamevar.add.button(gamevar.world.centerX - 64, currentHeight, buttonArr[i], null, null, 1, 0);
		// newText.name = buttonArr[i] + "";
		// buttons.push(newText);
		// currentHeight += menuItemSpace;
		var btnValue = buttonArr[i + 1] + "";
		var btnSize = buttonArr[i + 2];
		var newText = gamevar.add.bitmapText(gamevar.world.centerX - (getTextWidthFromParam(btnSize, btnValue.length) / 2), currentHeight, 'carrier', btnValue, btnSize);
		newTextX = gamevar.world.centerX - (getTextWidthFromParam(btnSize, btnValue.length) / 2);

		var img = gamevar.add.sprite(newTextX - buttonOffset, currentHeight - buttonOffset, 'rect');
		img.crop({x : 0, y : 0 , width : getTextWidth(newText) + 2 * buttonOffset, height : newText.fontSize + 2 * buttonOffset});
		img.alpha = 0;
		img.inputEnabled = true;
		img.name = buttonArr[i] + "";
		img.linkedText = newText;
		img.linkedText.alpha = .5;
		img.events.onInputDown.add(buttonPressed, this);
		img.events.onInputOver.add(function(_img){
			sound_switch.play();
			shakeText(_img.linkedText, 3, 100, true);
			_img.linkedText.alpha = 1;
			textParticleBurst(_img.linkedText);
		});
		img.events.onInputOut.add(function(_img){
			_img.linkedText.alpha = 0.5;
		});

		currentHeight += menuItemSpace + btnSize / buttonSizeAdjustment;
	}

	//assignActions(buttons);

}

function buttonPressed(btn){
	console.log(btn.name);
	switch(btn.name){
		case 'btn_play':
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
			gamevar.state.start('gameplay', true);
		break;			
		case 'btn_back':
			console.log('parent: ' + parentScreen);
			gamevar.state.start(parentScreen, true);
		default:
	}

}

function addBackButton(){
	btnValue = 'back';
	var backText = gamevar.add.bitmapText(gamevar.world.centerX - (getTextWidthFromParam(30, btnValue.length) / 2), backButtonY, 'carrier', btnValue, 30);	

	var img = gamevar.add.sprite(gamevar.world.centerX - (getTextWidthFromParam(30, backText.text.length) / 2) - buttonOffset, backButtonY - buttonOffset, 'rect');
	img.crop({x : 0, y : 0 , width : getTextWidth(backText) + 2 * buttonOffset, height : backText.fontSize + 2 * buttonOffset});
	img.alpha = 0;
	img.inputEnabled = true;
	img.name = 'btn_back';
	img.linkedText = backText;
	img.linkedText.alpha = 0.5;
	img.events.onInputDown.add(buttonPressed, this);
	img.events.onInputOver.add(function(_img){
			sound_switch.play();
			shakeText(_img.linkedText, 3, 100, true);
			_img.linkedText.alpha = 1;
			textParticleBurst(_img.linkedText);
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

