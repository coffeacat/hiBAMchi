// select all elements
const finalScoreOverlay = document.getElementById("finalScoreOverlay");
const finalScorePopup = document.getElementById("finalScorePopup");
const finalScoreMessage = document.getElementById("finalScoreMessage");
const scoreBox = document.getElementById("score");
const comboBox = document.getElementById("combo");

const settings = document.getElementById("settingsButton");
const infoButton = document.getElementById("infoButton");
const menu = document.getElementById("menu");
const info = document.getElementById("infoBackground");
const infoOverlay = document.getElementById("infoOverlay");
const menuOverlay = document.getElementById("menuOverlay");
const bgmSlider = document.getElementById("bgmInput");
const bgmBar = document.getElementById("bgmBar");
const bgmValue = document.getElementById("bgmValue");
const bgmSpeaker = document.getElementById("bgmSpeaker");
const sfxSlider = document.getElementById("sfxInput");
const sfxBar = document.getElementById("sfxBar");
const sfxValue = document.getElementById("sfxValue");
const sfxSpeaker = document.getElementById("sfxSpeaker");
const voiceSlider = document.getElementById("voiceInput");
const voiceBar = document.getElementById("voiceBar");
const voiceValue = document.getElementById("voiceValue");
const voiceSpeaker = document.getElementById("voiceSpeaker");

const playButton = document.getElementById("playButton")
const timer = document.getElementById("timer");
const countdownOverlay = document.getElementById("countdownContainer");
const countdownTimer = document.getElementById("countdownLabel");
// const OKButton = document.getElementById("OKButton");

let aspecW = 1920;
let aspecH = 1080;

window.onload = function() {
    window.resizeTo(aspecW, aspecH)
    adapt();
    loadGame();
    primeBoard();
}

window.onresize = function() {
    adapt();
}

function adapt() {
    let winW = window.innerWidth;
    let winH = window.innerHeight;
    let el=document.querySelector(".wrapper")
    
    let maxw=winW
    let maxh=maxw*0.5625
    
    if (maxh>winH) {
        maxh=winH
        maxw=maxh*1.7778
    }

    let scale = winW / aspecW
    if (winH/aspecH<scale) scale=winH/aspecH
    el.style.transform="scale("+scale+")";
    if (winW<=aspecW)
        el.style.left=((winW-aspecW*scale)/2).toFixed(2)+'px'
    else
        el.style.left='0px'

    el.style.top=((el.getBoundingClientRect().height-aspecH*scale)/2).toFixed(2)+'px'
}

class Tile {
    constructor(type, variant, row, column) {
        this.type = type;
        this.variant = variant;
        this.row = row;
        this.column = column;
    }
}

let candyType1 = "perfume";
let candyType2 = "manatown";
let candyType3 = "bow";
let candyType4 = "clover";
let candyType5 = "osmanthus";
let candyType6 = "note";

// create our candy types
let candies = [
    {
	    type: candyType1,
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "./public/images/candy/perfume.webp"
	},{
		type: candyType2,
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "./public/images/candy/manatown.webp"
	},{
		type: candyType3,
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "./public/images/candy/bow.webp"
	},{
		type: candyType4,
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "./public/images/candy/clover.webp"
	},{
	    type: candyType5,
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "./public/images/candy/osmanthus.webp"
	},{
		type: candyType6,
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "./public/images/candy/note.webp"
	}
];

let donutType = "donut";
let rowVariant = "horizontal_4";
let colVariant = "vertical_4";
let bombVariant = "bomb";
let donutVariant = "full_clear";

// create our special candies
let special_candies = [
    {
	    type: candyType1,
		variant: rowVariant,
		sprite: "./public/images/candy/perfume_side_stripe.webp"
	},{
		type: candyType2,
		variant: rowVariant,
		sprite: "./public/images/candy/manatown_side_stripe.webp"
	},{
		type: candyType3,
		variant: rowVariant,
		sprite: "./public/images/candy/bow_side_stripe.webp"
	},{
		type: candyType4,
		variant: rowVariant,
		sprite: "./public/images/candy/clover_side_stripe.webp"
	},{
	    type: candyType5,
		variant: rowVariant,
		sprite: "./public/images/candy/osmanthus_side_stripe.webp"
	},{
		type: candyType6,
		variant: rowVariant,
		sprite: "./public/images/candy/note_side_stripe.webp"
	},{
	    type: candyType1,
		variant: colVariant,
		sprite: "./public/images/candy/perfume_up_stripe.webp"
	},{
		type: candyType2,
		variant: colVariant,
		sprite: "./public/images/candy/manatown_up_stripe.webp"
	},{
		type: candyType3,
		variant: colVariant,
		sprite: "./public/images/candy/bow_up_stripe.webp"
	},{
		type: candyType4,
		variant: colVariant,
		sprite: "./public/images/candy/clover_up_stripe.webp"
	},{
	    type: candyType5,
		variant: colVariant,
		sprite: "./public/images/candy/osmanthus_up_stripe.webp"
	},{
		type: candyType6,
		variant: colVariant,
		sprite: "./public/images/candy/note_up_stripe.webp"
	},{
	    type: candyType1,
		variant: bombVariant,
		sprite: "./public/images/candy/perfume_candy.webp"
	},{
		type: candyType2,
		variant: bombVariant,
		sprite: "./public/images/candy/manatown_candy.webp"
	},{
		type: candyType3,
		variant: bombVariant,
		sprite: "./public/images/candy/bow_candy.webp"
	},{
		type: candyType4,
		variant: bombVariant,
		sprite: "./public/images/candy/clover_candy.webp"
	},{
	    type: candyType5,
		variant: bombVariant,
		sprite: "./public/images/candy/osmanthus_candy.webp"
	},{
		type: candyType6,
		variant: bombVariant,
		sprite: "./public/images/candy/note_candy.webp"
	},{
        type: donutType,
        variant: donutVariant,
        sprite: "./public/images/candy/donut.webp"
    }
];

let blankTile = {
	type: "blank",
	variant: "blank", // horizontal 4, vertical 4, bomb, full clear
	sprite: "./public/images/candy/blank.webp"
};

let startGameSfx = new Audio("./public/audio/システム決定音_3.mp3");
let crushSfx = new Audio("./public/audio/ぷにょん.mp3");

// store the combo sfx
/* let combo_sfx = [
    {
		audio: new Audio("./public/audio/paper jam sfx/OK.wav")
	},{
		audio: new Audio("./public/audio/paper jam sfx/Good.wav")
	},{
		audio: new Audio("./public/audio/paper jam sfx/Great.wav")
	},{
		audio: new Audio("./public/audio/paper jam sfx/Excellent.wav")
    }
]; */

// store the ok voice lines
/* let ok_voice = [
    {
		audio: new Audio("./public/audio/wonder sfx/yes OR yeah/Voice_Peach_BeatJump_Combo4_00.wav")
	}
];

// store the good voice lines
let good_voice = [
    {
		audio: new Audio("./public/audio/wonder sfx/positive words/Voice_Peach_CharacterSelect_00.wav")
	},{
		audio: new Audio("./public/audio/wonder sfx/positive words/Voice_Peach_CourseIn_00.wav")
	},{
		audio: new Audio("./public/audio/wonder sfx/yay/Voice_Peach_RecoverShabon_00.wav")
	},{
		audio: new Audio("./public/audio/wonder sfx/yes OR yeah/Voice_Peach_CourseOut_Clear_01.wav")
	}
];

// store the great voice lines
let great_voice = [
    {
		audio: new Audio("./public/audio/wonder sfx/positive sfx/Voice_Peach_Badge_SquatHiJump_Jump_00.wav")
	},{
		audio: new Audio("./public/audio/wonder sfx/positive words/Voice_Peach_Badge_Recovery_01.wav")
	},{
		audio: new Audio("./public/audio/wonder sfx/wow/Voice_Peach_JumpInvincible_02.wav")
	}
];

// store the excellent voice lines
let excellent_voice = [
    {
		audio: new Audio("./public/audio/wonder sfx/positive words/Voice_Peach_GetMedal_02.wav")
	},{
		audio: new Audio("./public/audio/wonder sfx/positive words/Voice_Peach_GrandSeedGet_00.wav")
	},{
		audio: new Audio("./public/audio/wonder sfx/positive words/Voice_Peach_RecoverShabon_01.wav")
	},{
		audio: new Audio("./public/audio/wonder sfx/positive words/Voice_Peach_RecoverShabon_02.wav")
	},{
        audio: new Audio("./public/audio/wonder sfx/wow/Voice_Peach_PowerUp_Elephant_00.wav")
    }
]; */

// create some variables
var board = [];
var internalBoard = [];
var rows = 10;
var columns = 10;
var tempScore = 0;
var score = 0;
var combo = 0;
var matches = 0;
var notClear = false;
var startGame = false;
var playerAction = false;
var boardModified = false;
var matchedSpecial = false;
var donutActivated = false;
var notPopulated = false;

var currImage;
var otherImage;
var candy_value = 50;
let globalMatchCap;
var countdownInterval;
var candyInterval;
// var boardInterval;
var setTimer;
var bpm = 136;

let bgmSavedVolume = 50;
let sfxSavedVolume = 100;
let voiceSavedVolume = 100;

// store the bgm
let bgm = new Audio("./public/audio/とことこきっず.mp3");
bgm.autoplay = true;
bgm.loop = true;
bgmVolume();
// bgm.play();

document.addEventListener('click', playMusic, { once: true });

function playMusic() {
    bgm.play();
}

var prevLine = null;

/* ########## FUNCTIONS DIVIDER ########## */

// when window loads
function loadGame() {
    for (let r = 0; r < rows; r++) {
		let row = [];
        let internalRow = [];
		for (let c = 0; c < columns; c++) {
			let tile = document.createElement('img');
            // tile.classList.add('candy');
            // tile.setAttribute('draggable', true)
			tile.id = r.toString() + "-" + c.toString();
            // console.log(tile.id);
			var currentCandy = randomize(candies);
            // console.log(currentCandy.sprite);
            // if (currentCandy.type == 2) {
                // tile.classList.add('candy2');
            // }
            //// tile.style.backgroundImage = url("donut.webp");
            // console.log(tile.classList[1]);
			tile.src = currentCandy.sprite;
            tile.classList.add("prevent-select");

			// DRAG FUNCTIONALITY
			// tile.addEventListener("drag")
            tile.addEventListener("dragstart", dragStart); // click on a candy, initialize drag process
			tile.addEventListener("dragover", dragOver); // clicking on a candy, moving mouse to drag the candy
			tile.addEventListener("dragenter", dragEnter); // dragging candy onto another candy
			tile.addEventListener("dragleave", dragLeave); // leave candy over another candy
		    tile.addEventListener("drop", dragDrop); // drops the candy over another candy
			tile.addEventListener("dragend", dragEnd); // after drag process is completed, swap candies if valid move

            internalTile = new Tile(currentCandy.type, currentCandy.variant, r, c);

			document.getElementById('board').appendChild(tile);
			
            row.push(tile);
            internalRow.push(internalTile);
		}
		board.push(row);
        internalBoard.push(internalRow);
	}
	console.log(board);
    console.log(internalBoard);
}

function restartGame() {
    // set timer here
    timer.innerHTML = "3:00";

    // start game value later allows score and combo to be reset
    startGame = true;

    // should also set the play button to be disabled
    playButton.disabled = true;

    // play sfx
    startGameSfx.play();

    primeBoard();
}

function disableDrag() {
    for (let r = 0; r < rows; r++) {
		for (let c = 0; c < columns; c++) {
            board[r][c].draggable = false;
        }
    }
}

function enableDrag() {
    for (let r = 0; r < rows; r++) {
		for (let c = 0; c < columns; c++) {
            board[r][c].draggable = true;
        }
    }
}

// prime the board for gameplay
function primeBoard() {
    // prevents player from dragging candy while the board is being set up
    disableDrag();

    clearInterval(candyInterval);
    // clearInterval(boardInterval);

    // scramble the board
    scramble();
    // scrambleCustom();

    // player action is true initially to clear the board for matches
    playerAction = true;
    notClear = true;
    
    // matchCap = 3 only to trigger match 3s when clearing the board
    globalMatchCap = 3;

    candyInterval = window.setInterval(function() {
		checkCandy();
	}, 300 // every 300ms, will call checkCandy();
	) // delayed from clearing candy so it checks after the candies
      // have settled into their new positions
	
	/*boardInterval = window.setInterval(function() {
		dropCandy();
		generateCandy();
	}, 8 // every 50ms, will "drop" candy over blank tiles and replace with new candy
	)*/

    clearBoard();

}

// clearBoard is continously checked until the board is clear of matches
function clearBoard() {
    if (playerAction) {
        console.log("board not cleared");
        window.setTimeout(clearBoard, 1000);
    // when it is clear of matches, the game starts
    } else {
        // resets when to check for clearing candy (according to bpm)
        clearInterval(candyInterval);
        candyInterval = window.setInterval(function() {
			checkCandy();
		}, (bpm * (2000 / 120) / 2)
		)

        notClear = false;
        globalMatchCap = 5;
        enableDrag();

        if (startGame) {
            gameGo();
        }
    }
}

function gameGo() {
    // start game conditions
    window.setTimeout(function() {
        // sets and updates timer for the game
        clearInterval(setTimer);
        // console.log("clear timer interval");
        setTimer = setInterval(timerCountDown, 1000);
        // console.log("setTimer interval");

        // resets the bgm
        bgm.pause();   // pauses the bgm
        bgm.currentTime = 0; // and resets it
        bgm.play();

        // deletes/resets the 3 second countdown (for future use)
        clearInterval(countdownInterval);
        // console.log("clear countdown interval");
        countdownTimer.innerHTML = "";
        countdownOverlay.style.width = "0%";
    }, 3000 // gives 3 seconds to analyze the board
    )

    // resets score and combo
    score = 0;
    combo = 0;
    scoreBox.innerHTML = score;
    comboBox.innerHTML = "x" + combo;
    
    // shows the 3 second countdown
    var threeSeconds = 3;
    countdownOverlay.style.width = "100%";
    countdownTimer.innerHTML = threeSeconds;

    clearInterval(countdownInterval);
    // console.log("clear countdown interval");
    countdownInterval = window.setInterval(function() {
        // console.log("set countdown interval");

        threeSeconds--;
        countdownTimer.innerHTML = threeSeconds;
    }, 1000 // counts down the 3 seconds
    )
}

function scramble() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            tile = internalBoard[r][c];
            image = document.getElementById(r.toString() + "-" + c.toString());
            var newCandy = randomize(candies);
            image.src = newCandy.sprite;
            tile.type = newCandy.type;
            tile.variant = newCandy.variant;
        }
    }
}

function scrambleCustom() {
    let customBoard = [
        [ 0, 1, 2, 3, 4, 0, 1, 4, 3, 4 ],
        [ 4, 0, 1, 2, 3, 4, 0, 5, 4, 5 ],
        [ 3, 4, 0, 5, 2, 3, 4, 0, 5, 5 ],
        [ 2, 5, 5, 0, 5, 5, 3, 5, 0, 1 ],
        [ 1, 2, 3, 0, 0, 1, 2, 3, 4, 5 ],
        [ 1, 0, 0, 5, 4, 0, 1, 2, 3, 5 ],
        [ 4, 0, 5, 0, 5, 4, 0, 1, 2, 3 ],
        [ 3, 4, 0, 0, 2, 3, 4, 0, 1, 2 ],
        [ 2, 3, 4, 4, 1, 2, 3, 4, 0, 1 ],
        [ 1, 2, 3, 4, 0, 1, 2, 3, 4, 0 ]
    ];

    let copyAndPaste = [
        [ 0, 1, 2, 3, 4, 0, 1, 2, 3, 4 ],
        [ 4, 0, 1, 2, 3, 4, 0, 1, 2, 3 ],
        [ 3, 4, 0, 1, 2, 3, 4, 0, 1, 2 ],
        [ 2, 3, 4, 0, 1, 2, 3, 4, 0, 1 ],
        [ 1, 2, 3, 4, 0, 1, 2, 3, 4, 0 ],
        [ 0, 1, 2, 3, 4, 0, 1, 2, 3, 4 ],
        [ 4, 0, 1, 2, 3, 4, 0, 1, 2, 3 ],
        [ 3, 4, 0, 1, 2, 3, 4, 0, 1, 2 ],
        [ 2, 3, 4, 0, 1, 2, 3, 4, 0, 1 ],
        [ 1, 2, 3, 4, 0, 1, 2, 3, 4, 0 ],

        [ 0, 1, 2, 3, 4, 0, 1, 4, 3, 4 ],
        [ 4, 0, 1, 2, 3, 4, 0, 5, 4, 5 ],
        [ 3, 4, 0, 5, 2, 3, 4, 0, 5, 5 ],
        [ 2, 3, 5, 0, 5, 5, 3, 5, 0, 1 ],
        [ 1, 2, 3, 5, 0, 1, 2, 3, 4, 5 ],
        [ 0, 1, 2, 5, 4, 0, 1, 2, 3, 5 ],
        [ 4, 0, 5, 2, 5, 4, 0, 1, 2, 3 ],
        [ 3, 4, 0, 1, 2, 3, 4, 0, 1, 2 ],
        [ 2, 3, 4, 0, 1, 2, 3, 4, 0, 1 ],
        [ 1, 2, 3, 4, 0, 1, 2, 3, 4, 0 ]
    ];

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            tile = internalBoard[r][c];
            image = document.getElementById(r.toString() + "-" + c.toString());
            var newCandy = candies[customBoard[r][c]];
            image.src = newCandy.sprite;
            tile.type = newCandy.type;
            tile.variant = newCandy.variant;
        }
    }
}

function endGame() {
    console.log("end of game!")
    // should display score
    startGame = false;
    playButton.disabled = false;
    
    boardMechanics(combo);

    playerAction = false;
    matchedSpecial = false;
    score += tempScore * combo;
    tempScore = 0;
    matches = 0;

    scoreBox.innerHTML = score;
    comboBox.innerHTML = "x" + combo;

    finalScoreOverlay.style.width = "100%";
    finalScoreMessage.innerHTML = "You scored<br/>" + score;
    finalScorePopup.style.display = "inline-flex"
    // OKButton.style.display = "inline-flex";


    enableDrag();

    clearInterval(setTimer);
    // console.log("clear timer interval");
}

function timerCountDown() {
  var minutes = timer.innerHTML.split(":")[0];
  var seconds = timer.innerHTML.split(":")[1];

  if (seconds == 0 && minutes == 0) {
    endGame();
  } else if (seconds == 0 && minutes > 0) {
    minutes--;
    seconds = 59;
  } else if (seconds <= 10) {
    seconds--;
    seconds = "0" + seconds;
  } else {
    seconds--;
  }

  timer.innerHTML = minutes + ":" + seconds;
}

// selects a random element from a provided array
function randomize(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

// transfers / adds all the elements in one array to the other
function transferArray(arr, transfer) {
    for (let i = 0; i < transfer.length; i++) {
        arr.push(transfer[i]);
    }
}

function removeScoreOverlay() {
    finalScorePopup.style.display = "none"
    finalScoreOverlay.style.width = "0%";
    finalScoreMessage.innerHTML = "";
    // OKButton.style.display = "none";
}

function dragStart() {
    // this refers to the candy that was selected for the drag process
    currImage = this;
}

// these three do nothing right now
function dragOver(e) {
    // needed to swap images
    e.preventDefault();
}

function dragEnter(e) {
    //e.preventDefault();
}

function dragLeave() {
    
}

function dragDrop() {
    // this refers to the candy that our current candy was dropped on
    otherImage = this;
}

function dragEnd() {

    // cannot swap anything with blank tiles
      if (currImage.src.includes(blankTile.sprite.substring(2))
        || otherImage.src.includes(blankTile.sprite.substring(2))) {
        return;
    }

    let currCoords = currImage.id.split("-"); // id="0-0" -> ["0", "0"]
        let r1 = parseInt(currCoords[0]);
        let c1 = parseInt(currCoords[1]);
    
    let otherCoords = otherImage.id.split("-"); // id="0-0" -> ["0", "0"]
        let r2 = parseInt(otherCoords[0]);
        let c2 = parseInt(otherCoords[1]);
    
    let moveLeft = r1 == r2 && c1-1 == c2;
    let moveRight = r1 == r2 && c1+1 == c2;
    let moveUp = r1-1 == r2 && c1 == c2;
    let moveDown = r1+1 == r2 && c1 == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    // only swap adjacent candies
    if (isAdjacent) {
        disableDrag();

        let currTile = internalBoard[r1][c1];
        let otherTile = internalBoard[r2][c2];

        // console.log("current coords: " + r1 + ", " + c1);
        //console.log("other coords: " + r2 + ", " + c2);

        // console.log("current tile: " + currTile.type);
        // console.log("current image: " + currImage.src);
        // console.log("other tile: " + otherTile.type);
        // console.log("other image: " + otherImage.src);
        
        // swap tiles
        let temp = otherImage.src;
        otherImage.src = currImage.src;
        currImage.src = temp;

        // NEED TWO TEMPS BC THIS IS A REMOTE OBJECT
        // TOOK ME FOREVER TO DEBUG BTW.
        let tempType = otherTile.type;
        let tempVariant = otherTile.variant
        otherTile.type = currTile.type;
        otherTile.variant = currTile.variant;
        currTile.type = tempType;
        currTile.variant = tempVariant;
        
        // console.log("swapped tile: " + currTile.type);
        // console.log("swapped image: " + currImage.src);
        // console.log("swapped tile: " + otherTile.type);
        // console.log("swapped image: " + otherImage.src);

        // check if move is valid (aka creates a match)
        let isValid = checkValid(currTile, otherTile);
        if (!isValid) {
            // if not, swaps the images back
            let temp = otherImage.src;
            otherImage.src = currImage.src;
            currImage.src = temp;

            let tempType = otherTile.type;
            let tempVariant = otherTile.variant
            otherTile.type = currTile.type;
            otherTile.variant = currTile.variant;
            currTile.type = tempType;
            currTile.variant = tempVariant;
            
            enableDrag();
        } else {
            playerAction = true;
        }
    }
}

function findTile(sprite, array) {
    var foundTile = null;

    for (let i = 0; i < array.length; i++) {
        var currTile = array[i];
        console.log(sprite);
        console.log(currTile.sprite);
        if (currTile.sprite == sprite) {
            foundTile = currTile;
            break;
        }
    }

    console.log(foundTile.type + foundTile.variant);
    return foundTile;
}

function findCandy(type, variant, array) {
    var foundCandy = null;
    // console.log("type: " + type);
    // console.log("variant: " + variant);
    for (let i = 0; i < array.length; i++) {
        var currCandy = array[i];
        // console.log("candy type: " + currCandy.type);
        // console.log("candy variant: " + currCandy.variant);
        if (currCandy.type == type && currCandy.variant == variant) {
            foundCandy = currCandy;
            break;
        }
    }

    // console.log(foundCandy.sprite);
    return foundCandy;
}

function checkCandy() {
    comboBox.innerHTML = "x" + combo;
    if (playerAction) {
        crushCandy();
        // console.log("CRUSHED!");
    } else {
        enableDrag();
    }
    // console.log("check candy");
}

function crushCandy() {
    let matchArray = [];
    // crushFive();
    // crushFour();
    // console.log("donut? " + donutActivated);
    if (donutActivated) {
        let donutArray = activateDonut(internalBoard[0][0], false)
        transferArray(matchArray, donutArray);
        donutActivated = false;
    }
    let crushArray = crushThreePlus();
    transferArray(matchArray, crushArray);
    // console.log("PA1: " + playerAction);
    // console.log("BM1: " + boardModified);

    let tempCombo = calculateCombo(matchArray);
    if (tempCombo != 0) {
        boardMechanics(tempCombo);
    }
    
    if (!boardModified) {
        playerAction = false;
        matchedSpecial = false;

        // console.log("final score added: " + tempScore*combo);
        score += tempScore * combo;
        scoreBox.innerHTML = score;
        tempScore = 0;
        combo = 0;
        matches = 0;

        enableDrag();
    } else {
        matches++;
        if (!notClear) {
            playMatchSFX();
        }
    }
    boardModified = false;
    // console.log("PA2: " + playerAction);
    // console.log("BM2: " + boardModified);
}

// how to account for special candies?
function crushThreePlus() {
    // let potentialMatches = 0;
    let matchCap = globalMatchCap;
    let matchArray = [];

    for (let matchAmount = matchCap; matchAmount >= 3; matchAmount--) {
        // console.log(matchAmount);
        matchCap--;

        // check rows
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns-matchCap; c++) {
                let matchCandyTiles = [];
                let matchCandyImages = [];
                let matchFound = true;
                for (let j = 0; j < matchAmount; j++) {
                    // console.log("j: " + j);
                    matchCandyTiles.push(internalBoard[r][c+j]);
                    matchCandyImages.push(board[r][c+j]);

                    if (j > 0 && matchCandyTiles[j-1].type != matchCandyTiles[j].type) {
                        matchFound = false;
                    }
                }

                // if there is a match
                if (matchFound) {
                    // trigger the appropriate mechanics
                    let matches = matchMechanics(matchCandyTiles, matchCandyImages, matchFound, matchAmount, true);
                    transferArray(matchArray, matches);
                }
            }
        }
    

        // check columns
        for (let c = 0; c < columns; c++) {
            for (let r = 0; r < rows-matchCap; r++) {
                let matchCandyTiles = [];
                let matchCandyImages = [];
                let matchFound = true;
                for (let j = 0; j < matchAmount; j++) {
                    // console.log("j: " + j);
                    matchCandyTiles.push(internalBoard[r+j][c]);
                    matchCandyImages.push(board[r+j][c]);

                    if (j > 0 && matchCandyTiles[j-1].type != matchCandyTiles[j].type) {
                        matchFound = false;
                    }
                }

                // if there is a match
                if (matchFound) {
                    // trigger the appropriate mechanics
                    let matches = matchMechanics(matchCandyTiles, matchCandyImages, matchFound, matchAmount, false);
                    transferArray(matchArray, matches);
                }
            }
        }
    }

    return matchArray;
}

function matchMechanics(matchCandyTiles, matchCandyImages, matchFound, matchAmount, horizontal) {
    let comboArray = [];

    // match 5
    if (matchAmount == 5) {
        if (matchFound && matchCandyTiles[0].type != blankTile.type
            && matchCandyTiles[0].type != donutType
            && matchCandyTiles[0].type != "temp") {
            let donut = special_candies[special_candies.length - 1];

            comboArray = clearTilesSpecial(matchCandyTiles, matchCandyImages, donut);
            transferArray(comboArray, matchCandyTiles);
        }
    // match 4
    } else if (matchAmount == 4) {
        // if it's a match 5 ignore it
        if (matchFound && matchCandyTiles[0].type != blankTile.type
            && matchCandyTiles[0].type != donutType
            && matchCandyTiles[0].type != "temp") {
            let ignore = isMatchGreater(matchCandyTiles, horizontal);
            
            // console.log("ignore the 4 match? " + ignore);

            if (!ignore) {
                let specialCandy;

                if (horizontal) {
                    specialCandy = findCandy(matchCandyTiles[0].type, colVariant, special_candies);
                } else {
                    specialCandy = findCandy(matchCandyTiles[0].type, rowVariant, special_candies);
                }

                let isBomb = checkBomb(matchCandyTiles, matchCandyImages, horizontal);
                // console.log("is4Bomb? " + isBomb);
            
                if (isBomb) {
                    // find appropriate bomb candy
                    specialCandy = findCandy(matchCandyTiles[0].type, bombVariant, special_candies);
                    // console.log("bomb candy: " + specialCandy.type + " " + specialCandy.variant);
                }
                            
                comboArray = clearTilesSpecial(matchCandyTiles, matchCandyImages, specialCandy);
                transferArray(comboArray, matchCandyTiles);
            }
        }
    // match 3 & bombs
    } else {
        if (matchFound && matchCandyTiles[0].type != blankTile.type
            && matchCandyTiles[0].type != donutType
            && matchCandyTiles[0].type != "temp") {
            let ignore = isMatchGreater(matchCandyTiles, horizontal);
            
            // if the game hasn't started
            if (notClear) {
                // console.log("game not started");
                // clear the tiles anyways
                ignore = false;
            }

            // console.log("ignore the match? " + ignore);

            // if it's a match 4 or 5, ignore it
            if (!ignore) {
                let isBomb = checkBomb(matchCandyTiles, matchCandyImages, horizontal);
                // console.log("isBomb? " + isBomb);
            
                if (isBomb && !notClear) {
                    // find appropriate bomb candy
                    // console.log("bomb candy type: " + matchCandyTiles[0].type);
                    let bomb = findCandy(matchCandyTiles[0].type, bombVariant, special_candies);
                    // console.log("bomb candy: " + bomb.type + " " + bomb.variant);

                    // clear special tiles and images
                    comboArray = clearTilesSpecial(matchCandyTiles, matchCandyImages, bomb);
                    transferArray(comboArray, matchCandyTiles);
                } else {
                    comboArray = clearTiles(matchCandyTiles, matchCandyImages);
                    transferArray(comboArray, matchCandyTiles);
                }
            }
        }
    }

    return comboArray;
}

function activateSpecialCandy(candy, random) {
    let variant = candy.variant;
    let clearArray = [];

    // console.log("active: " + candy.type + ", " + variant);

    if (variant == rowVariant || variant == colVariant) {
        clearArray = activateStripe(candy);
    }
    
    if (variant == bombVariant) {
        clearArray = activateBomb(candy);
    }

    if (variant == donutVariant) {
        clearArray = activateDonut(candy, random);
    }

    return clearArray;
}

function activateStripe(candy) {
    // console.log("activated stripe");
    let variant = candy.variant;
    let clearTiles = [];
    let specialArrays = [];

    // if the stripe is horizontal, clear a row
    if (variant == rowVariant) {
        let row = candy.row;
        for (let i = 0; i < columns; i++) {
            // console.log("coordinates: (" + row + ", " + i + ")");
            // if the tile to clear is the special candy
            if (candy == internalBoard[row][i]) {
                clearTiles.push(internalBoard[row][i]);
                // internalBoard[row][i].type = "temp";
                animateCrush(board[row][i]);
                internalBoard[row][i].variant = blankTile.variant;
                window.setTimeout(function() {
                    board[row][i].src = blankTile.sprite;
                    internalBoard[row][i].type = blankTile.type;
                    reverseCrush(board[row][i]);
                    
                    populate();
                }, animationTime)
            // if the tile to clear is ANOTHER special candy
            } else if (internalBoard[row][i].variant != "normal" && 
                       internalBoard[row][i].variant != "blank") {
                // console.log("activated special candy");
                    // activates the special candy and returns with another array
                    // with candies that special candy has cleared
                    let specialArray = activateSpecialCandy(internalBoard[row][i], true);
                //window.setTimeout(function() {
                    transferArray(specialArrays, specialArray);
                //}, animationTime)
            // otherwise clears the tile if it's not already cleared
            } else {
                // console.log("activated r else");
                if (internalBoard[row][i].type != "blank") {
                    // console.log("not blank");
                    clearTiles.push(internalBoard[row][i]);
                    // internalBoard[row][i].type = "temp";
                    animateCrush(board[row][i]);
                    window.setTimeout(function() {
                        board[row][i].src = blankTile.sprite;
                        internalBoard[row][i].type = blankTile.type;
                        internalBoard[row][i].variant = blankTile.variant;
                        reverseCrush(board[row][i]);

                        populate();
                    }, animationTime)
                }
            }
        }
    } else {
        let column = candy.column;
        for (let i = 0; i < rows; i++) {
            // console.log("coordinates: (" + i + ", " + column + ")");
            if (candy == internalBoard[i][column]) {
                clearTiles.push(internalBoard[i][column]);
                animateCrush(board[i][column]);
                // internalBoard[i][column].type = "temp";
                internalBoard[i][column].variant = blankTile.variant;
                window.setTimeout(function() {
                    board[i][column].src = blankTile.sprite;
                    internalBoard[i][column].type = blankTile.type;
                    reverseCrush(board[i][column]);

                    populate();
                }, animationTime)
            } else if (internalBoard[i][column].variant != "normal" &&
                       internalBoard[i][column].variant != "blank") {
                    // console.log("activated special candy");
                    let specialArray = activateSpecialCandy(internalBoard[i][column], true);
                //window.setTimeout(function() {
                    transferArray(specialArrays, specialArray);
                //}, animationTime)
            } else {
                // console.log("activated c else");
                if (internalBoard[i][column].type != "blank") {
                    clearTiles.push(internalBoard[i][column]);
                    // internalBoard[i][column].type = "temp";
                    animateCrush(board[i][column]);
                    window.setTimeout(function() {
                        board[i][column].src = blankTile.sprite;
                        internalBoard[i][column].type = blankTile.type;
                        internalBoard[i][column].variant = blankTile.variant;
                        reverseCrush(board[i][column]);

                        populate();
                    }, animationTime)
                }
            }
        }
    }

    // add any special arrays to this stripe array
    transferArray(clearTiles, specialArrays);

    /* console.log("all stripe tiles");
    for (let k = 0; k < clearTiles.length; k++) {
        console.log("coords: (" + clearTiles[k].row + ", " + clearTiles[k].column +
        "); type: " + clearTiles[k].type + "; variant: " + clearTiles[k].variant);
    } */ 

    return clearTiles;
}

function activateBomb(candy) {
    let clearTiles = [];
    let specialArrays = [];

    let r = candy.row;
    let c = candy.column;

    // in a 3x3 area like this
    // 1 2 3
    // 4 5 6
    // 7 8 9

    // case 5
    clearTiles.push(internalBoard[r][c]);

    // case 1
    if (r != 0 && c != 0) {
        clearTiles.push(internalBoard[r-1][c-1]);
    }

    // case 2
    if (r != 0) {
        clearTiles.push(internalBoard[r-1][c]);
    }

    // case 3
    if (r != 0 && c != 9) {
        clearTiles.push(internalBoard[r-1][c+1]);
    }

    // case 4
    if (c != 0) {
        clearTiles.push(internalBoard[r][c-1]);
    }

    // case 6
    if (c != 9) {
        clearTiles.push(internalBoard[r][c+1]);
    }

    // case 7
    if (r != 9 && c != 0) {
        clearTiles.push(internalBoard[r+1][c-1]);
    }

    // case 8
    if (r != 9) {
        clearTiles.push(internalBoard[r+1][c]);
    }

    // case 9
    if (r != 9 && c != 9) {
        clearTiles.push(internalBoard[r+1][c+1]);
    }

    // for the tiles that were added
    // console.log("bomb clear tiles");
    for (let i = 0; i < clearTiles.length; i++) {
        let curr = clearTiles[i];
        let currRow = curr.row;
        let currCol = curr.column;

        // console.log("tile "+ i + ": (" + currRow + ", " + currCol + ")");
        
        // if it's the bomb, clear it
        if (curr == candy) {
            // console.log("go off");
            animateCrush(board[currRow][currCol]);
            // internalBoard[currRow][currCol].type = "temp";
            internalBoard[currRow][currCol].variant = blankTile.variant;
            window.setTimeout(function() {
                board[currRow][currCol].src = blankTile.sprite;
                internalBoard[currRow][currCol].type = blankTile.type;
                reverseCrush(board[currRow][currCol]);

                populate();
            }, animationTime)
        // if it's a special candy activate it
        } else if (internalBoard[currRow][currCol].variant != "normal" &&
                   internalBoard[currRow][currCol].variant != "blank") {
                // console.log("activate special candy");
                let specialArray = activateSpecialCandy(internalBoard[currRow][currCol], true);
            //window.setTimeout(function() {
                transferArray(specialArrays, specialArray);
            //}, animationTime)
        // if it's normal, clear it if it's not already cleared
        } else {
            if (internalBoard[currRow][currCol].type != "blank") {
                // internalBoard[currRow][currCol].type = "temp";
                animateCrush(board[currRow][currCol]);
                window.setTimeout(function() {
                    board[currRow][currCol].src = blankTile.sprite;
                    internalBoard[currRow][currCol].type = blankTile.type;
                    internalBoard[currRow][currCol].variant = blankTile.variant;
                    reverseCrush(board[currRow][currCol]);

                    populate();
                }, animationTime)
            }
        }
    }

    // add any special arrays to this bomb array
    transferArray(clearTiles, specialArrays);

    /* console.log("all bomb tiles");
    for (let k = 0; k < clearTiles.length; k++) {
        console.log("coords: (" + clearTiles[k].row + ", " + clearTiles[k].column +
        "); type: " + clearTiles[k].type + "; variant: " + clearTiles[k].variant);
    }*/

    return clearTiles;
}

// random here is supposed to provide a case for the donut
// to activate when it's destroyed by a special candy but
// i might scrap it due to the lack of visual clarity
function activateDonut(candy, random) {
    let clearTiles = [];
    let specialArrays = [];

    let type;
    let variant;

    // if donut is player activated
    if (!random) {
        // get the internal tiles of both swapped images
        let currCoords = currImage.id.split("-"); // id="0-0" -> ["0", "0"]
            let r1 = parseInt(currCoords[0]);
            let c1 = parseInt(currCoords[1]);
        
        let otherCoords = otherImage.id.split("-"); // id="0-0" -> ["0", "0"]
            let r2 = parseInt(otherCoords[0]);
            let c2 = parseInt(otherCoords[1]);
        
        let currTile = internalBoard[r1][c1];
        let otherTile = internalBoard[r2][c2];

        // find out which image is the donut and which is the other candy
        // if current tile is not the donut
        if (currTile.type != donutType) {
            // sets the type to clear as the current tile type
            type = currTile.type;
            variant = currTile.variant;
            // delete the donut
            clearTiles.push(otherTile);
        } else {
            // otherwise sets the other tile as the type to clear
            type = otherTile.type;
            variant = otherTile.variant;
            // there is a chance that the other type is also a donut
            // delete the donut
            clearTiles.push(currTile);
        }
    } else {
        let candyCount = [ 0, 0, 0, 0, 0, 0 ]

        // finds the most prominent candy on the board
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                switch(internalBoard[r][c].type) {
                    case candyType1:
                        candyCount[0]++;
                        break;
                    case candyType2:
                        candyCount[1]++;
                        break;
                    case candyType3:
                        candyCount[2]++;
                        break;
                    case candyType4:
                        candyCount[3]++;
                        break;
                    case candyType5:
                        candyCount[4]++;
                        break;
                    case candyType6:
                        candyCount[5]++;
                        break;
                    default:
                        // do nothing
                }
            }
        }

        // finds the type that has the most candies on the board
        let largest = 0;
        for (let i = 0; i < candyCount.length; i++) {
            if (candyCount[i] > largest) {
                largest = candyCount[i];
            }
        }

        // set type as the one to be cleared
        let index = candyCount.indexOf(largest);
        type = candies[index].type;
        variant = candies[index].variant;

        // clear donut
        clearTiles.push(candy);
    }

    // console.log("selected donut type: " + type)

    // if the other tile is a donut
    if (variant == donutVariant) {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                // adds the entire board to clear
                clearTiles.push(internalBoard[r][c]);
            }
        }
    } else {
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                // adds tiles that are the same type to clear
                if (internalBoard[r][c].type == type) {
                    clearTiles.push(internalBoard[r][c]);
                }
            }
        }
    }

    // what if donut somehow swaps with blank?
    // assume that it's not?

    // if the variant of the other candy is not normal
    if (variant != donutVariant && variant != "normal" && variant != "blank") {
        let variantCandies = [];        

        // add the variant(s) to an array
        if (variant == rowVariant || variant == colVariant) {
            // stripes
            variantCandies.push(findCandy(type, rowVariant, special_candies));
            variantCandies.push(findCandy(type, colVariant, special_candies));
        } else {
            // bomb
            variantCandies.push(findCandy(type, bombVariant, special_candies));
        }

        // then replace all the candies with a variant of the candy
        for (let i = 0; i < clearTiles.length; i++) {
            let specialCandy = randomize(variantCandies);
            let row = clearTiles[i].row;
            let column = clearTiles[i].column;

            clearTiles[i].variant = specialCandy.variant;
            board[row][column].src = specialCandy.sprite;
        }
    }

    // console.log("selected donut variant: " + variant);

    // then clear the array
    for (let i = 0; i < clearTiles.length; i++) {
        let curr = clearTiles[i];
        let currRow = curr.row;
        let currCol = curr.column;

        // console.log("clear coords: (" + currRow + ", " + currCol + ")")

        // if stripe or bomb, activate it
        if (curr.variant != donutVariant && curr.variant != "normal" && curr.variant != "blank") {
            let specialArray = activateSpecialCandy(internalBoard[currRow][currCol], true);
            //window.setTimeout(function() {
                transferArray(specialArrays, specialArray);
            //}, animationTime);
        // otherwise, clear normally
        } else {
            // there shouldn't be any donut variants other than the one
            // activated and if the whole screen is cleared
            animateCrush(board[currRow][currCol]);
            // internalBoard[currRow][currCol].type = "temp";
            curr.variant = blankTile.variant;
            window.setTimeout(function() {
                board[currRow][currCol].src = blankTile.sprite;
                reverseCrush(board[currRow][currCol]);
                curr.type = blankTile.type;

                populate();
            }, animationTime);
        }
    }

    // add any special arrays to the clear tiles
    transferArray(clearTiles, specialArrays);

    /* console.log("all donut tiles");
    for (let k = 0; k < clearTiles.length; k++) {
        console.log("coords: (" + clearTiles[k].row + ", " + clearTiles[k].column +
        "); type: " + clearTiles[k].type + "; variant: " + clearTiles[k].variant);
    }*/

    // add this array to any special arrays
    transferArray(clearTiles, specialArrays);

    return clearTiles;
}

function calculateCombo(matchArray) {
    let comboTiles = [];
    
    // match array is an array that contains the tiles that make up
    // the original match made by the player, along with
    // any arrangement of tiles cleared by special candy
    for (let i = 0; i < matchArray.length; i++) {
        // if this is the first tile, add to combo tiles
        if (comboTiles.length == 0) {
            comboTiles.push(matchArray[i]);
            // otherwise compares the current tile in matchArray
            // to all the ones that are already in comboTiles
        } else {
            let matchFound = false;
            // if the current matchArray tile is the same
            // as one of the tiles already added to comboTiles
            for (let j = 0; j < comboTiles.length; j++) {
                // flags as a match
                if (comboTiles[j] == matchArray[i]) {
                    matchFound = true;
                }
            }

            // if the tile is not already in comboTiles
            // aka a duplicate tile that's been "cleared"
            if (!matchFound) {
                // adds it
                comboTiles.push(matchArray[i]);
            }
        }
    }

    /*console.log("all combo tiles - after " + combo);
    for (let k = 0; k < comboTiles.length; k++) {
        console.log("coords: (" + comboTiles[k].row + ", " + comboTiles[k].column +
            "); type: " + comboTiles[k].type + "; variant: " + comboTiles[k].variant);
    }*/
    
    // however many nonoverlapping tiles there are (aka comboTiles) is the combo
    return comboTiles.length;
}

// matchArray is 4 or 3
function isMatchGreater(matchArray, horizontal) {
    // get first and last candy and array length
    let firstCandy = matchArray[0];
    let lastCandy = matchArray[matchArray.length - 1];
    let arrayLength = matchArray.length;
    let ignore = false;

    // get their coords
    // built into tiles now
    let firstRow = firstCandy.row;
    let firstColumn = firstCandy.column;
    let lastRow = lastCandy.row;
    let lastColumn = lastCandy.column;

    // console.log(arrayLength + " -- cond 1 (>= 3): " + (arrayLength >= 3) + " cond 2 (<= 4): " + (arrayLength <= 4));
    
    // if the match array is 3 or 4 objects long
    if (arrayLength >= 3 && arrayLength <= 4) {
        // depending on whether it's a row or a column being checked

        // horizontal case
        if (horizontal) {
            // console.log("CHECKING HORIZONTAL");
            // default (match 3 & 4): check 1 tiles left and the right
            
            // console.log("first col: " + firstColumn);
            // if there is room left
            if (firstColumn != 0) {
                // console.log("CHECKING LEFT");
                // check 1 tile left
                let checkCandy = internalBoard[firstRow][firstColumn-1];
                // console.log("first candy: r - " + firstCandy.row + " c - " + firstCandy.column);
                // console.log("check candy: r - " + checkCandy.row + " c - " + checkCandy.column);
                // if the candy left is the same type as the match
                if (checkCandy.type == firstCandy.type) {
                    // ignore clearing it
                    // console.log("IGNORE TRIGGERED 1");
                    ignore = true;
                }
            }
            
            // console.log("last col: " + lastColumn);
            // if there is room right
            if (lastColumn != 9) {
                // console.log("CHECKING RIGHT");
                // check 1 tile right
                let checkCandy = internalBoard[lastRow][lastColumn+1];
                // console.log("last candy: r - " + lastCandy.row + " c - " + lastCandy.column);
                // console.log("check candy: r - " + checkCandy.row + " c - " + checkCandy.column);
                // if the candy right is the same type as the match
                if (checkCandy.type == lastCandy.type) {
                    // ignore clearing it
                    // console.log("IGNORE TRIGGERED 2");
                    ignore = true;
                }
            }
            
            // might be redundant to check for 2 tiles
            // if arrayLength is 3, also check 2 tiles left and the right
            /* if (arrayLength == 3) {
                // if there is room left
                if (firstColumn > 2) {
                    // check 1 tile left
                    let checkCandy1 = internalBoard[firstRow][firstColumn-1];
                    // if the candy left is the same type as the match
                    if (checkCandy.type == firstCandy.type) {
                        // ignore it
                        ignore = true;
                    }
                }
                
                // if there is room right
                if (lastColumn <= 7) {
                    // check 1 tile right
                    let checkCandy = internalBoard[lastRow][lastColumn+1];
                    // if the candy right is the same type as the match
                    if (checkCandy.type == lastCandy.type) {
                        // ignore it
                        ignore = true;
                    }
                }
            } */ 
            
        // vertical case
        } else {
            // console.log("CHECKING VERTICAL");
            // default (match 3 & 4): check 1 tiles left and the right
            
            // if there is room up
            if (firstRow != 0) {
                // console.log("CHECKING UP");
                // check 1 tile up
                let checkCandy = internalBoard[firstRow-1][firstColumn];
                // console.log("first candy: r - " + firstCandy.row + " c - " + firstCandy.column);
                // console.log("check candy: r - " + checkCandy.row + " c - " + checkCandy.column);
                // if the candy up is the same type as the match
                if (checkCandy.type == firstCandy.type) {
                    // ignore clearing it
                    // console.log("IGNORE TRIGGERED 3");
                    ignore = true;
                }
            }
            
            // if there is room down
            if (lastRow != 9) {
                // console.log("CHECKING DOWN");
                // check 1 tile down
                let checkCandy = internalBoard[lastRow+1][lastColumn];
                // console.log("last candy: r - " + lastCandy.row + " c - " + lastCandy.column);
                // console.log("check candy: r - " + checkCandy.row + " c - " + checkCandy.column);
                // if the candy down is the same type as the match
                if (checkCandy.type == lastCandy.type) {
                    // ignore clearing it
                    // console.log("IGNORE TRIGGERED 4");
                    ignore = true;
                }
            }
        }
    }
    
    // if either checked tiles matches the match candy array: true
    // otherwise clear the match
    // console.log("IGNORE?: " + ignore);
    return ignore;
}

function checkBomb(matchTiles, matchImages, horizontal) {
    let matchFive = false;
    let isBomb = false;

    // default (match 3 & 4)
    // checks for L, T, and + formations

    // horizontal case
    if (horizontal) {
        // console.log("ROW MATCH DETECTED");
        // console.log("CHECKING FOR INTERSECTING COLUMNS");

        // checks for L formations
        // for each tile in the found match
        for (let i = 0; i < matchTiles.length; i++) {
            // if there's no match 5 or bomb already found in the cross section
            if (!matchFive && !isBomb) {
                let checkTile = matchTiles[i];
                let row = checkTile.row;
                let column = checkTile.column;

                let checkCandies = [];

                // console.log("check row: " + row);
                // console.log("check column: " + column);
                
                // if there is room up
                if (row > 2) {
                    // console.log("CHECKING 2 UP");
                    // check 2 tiles up
                    checkCandies.push(internalBoard[row-2][column]);
                    checkCandies.push(internalBoard[row-1][column]);
                }

                // if there is room down
                if (row <= 7) {
                    // console.log("CHECKING 2 DOWN");
                    // check 2 tiles down
                    checkCandies.push(internalBoard[row+1][column]);
                    checkCandies.push(internalBoard[row+2][column]);
                }

                // for (let i = 0; i < checkCandies.length; i++) {
                    // console.log("check candy " + i + " position: (" +
                    // checkCandies[i].row + ", " + checkCandies[i].column + ")");
                // }

                // records whether there was a match 5 found or not
                matchFive = findMatchFive(checkTile, horizontal);
                
                // if there's not a match 5 found
                if (!matchFive) {
                    isBomb = checkBombMechanics(checkTile, checkCandies, matchTiles, matchImages);
                }

            }
        }

        // now do it again but only checking one tile on either side
        // for each tile in the found match
        // checks for T and + formations
        for (let i = 0; i < matchTiles.length; i++) {
            // if there's no match 5 or bomb already found in the cross section
            if (!matchFive && !isBomb) {
                let checkTile = matchTiles[i];
                let row = checkTile.row;
                let column = checkTile.column;

                let checkCandies = [];
                
                // console.log("check row: " + row);
                // console.log("check column: " + column);

                // if there is room up and down
                if (row != 0 && row != 9) {
                    // console.log("CHECKING 1 UP AND 1 DOWN");
                    // check 1 tile up and 1 tile down
                    checkCandies.push(internalBoard[row-1][column]);
                    checkCandies.push(internalBoard[row+1][column]);
                }

                // records whether there was a match 5 found or not
                matchFive = findMatchFive(checkTile, horizontal);
                
                // if there's not a match 5 found
                if (!matchFive) {
                    isBomb = checkBombMechanics(checkTile, checkCandies, matchTiles, matchImages);
                }

            }
        }
    // vertical case
    } else {
        // console.log("COLUMN MATCH DETECTED");
        // console.log("CHECKING FOR INTERSECTING ROWS");
        
        // checks for L formations
        // for each tile in the found match
        for (let i = 0; i < matchTiles.length; i++) {
            // if there's no match 5 or bomb already found in the cross section
            if (!matchFive && !isBomb) {
                let checkTile = matchTiles[i];
                let row = checkTile.row;
                let column = checkTile.column;

                let checkCandies = [];
                
                // console.log("check row: " + row);
                // console.log("check column: " + column);

                // if there is room left
                if (column > 2) {
                    // console.log("CHECKING 2 LEFT");
                    // check 2 tiles left
                    checkCandies.push(internalBoard[row][column-2]);
                    checkCandies.push(internalBoard[row][column-1]);
                }

                if (column <= 7) {
                    // console.log("CHECKING 2 RIGHT");
                    // check 2 tiles right
                    checkCandies.push(internalBoard[row][column+1]);
                    checkCandies.push(internalBoard[row][column+2]);
                }

                // records whether there was a match 5 found or not
                matchFive = findMatchFive(checkTile, horizontal);
                
                // if there's not a match 5 found
                if (!matchFive) {
                    isBomb = checkBombMechanics(checkTile, checkCandies, matchTiles, matchImages);
                }

            }
        }

        // now do it again but only checking one tile on either side
        // for each tile in the found match
        for (let i = 0; i < matchTiles.length; i++) {
            // if there's no match 5 or bomb already found in the cross section
            if (!matchFive && !isBomb) {
                let checkTile = matchTiles[i];
                let row = checkTile.row;
                let column = checkTile.column;

                let checkCandies = [];

                // console.log("check row: " + row);
                // console.log("check column: " + column);
                
                // if there is room left and right
                if (column != 0 && column != 9) {
                    // console.log("CHECKING 1 LEFT AND 1 RIGHT");
                    // check 1 tile left and 1 tile right
                    checkCandies.push(internalBoard[row][column-1]);
                    checkCandies.push(internalBoard[row][column+1]);
                }

                // records whether there was a match 5 found or not
                matchFive = findMatchFive(checkTile, horizontal);
                
                // if there's not a match 5 found
                if (!matchFive) {
                    isBomb = checkBombMechanics(checkTile, checkCandies, matchTiles, matchImages);
                }

            }
        }
    }

    return isBomb;
}

function findMatchFive(checkTile, horizontal) {
    let matchFive = false;
    let matchAmount = 5;

    let row = checkTile.row;
    let column = checkTile.column;
    // check everything in the column of the selected tile for a match 5
    // like a mini match 5 
    
    // match is a row; check columns
    if (horizontal) {
        // console.log("checking columns for match 5");
        for (let r = 0; r < rows-(matchAmount-1); r++) {
            let matchCandyTiles = [];
            let matchFound = true;

            // console.log("match " + r);
            for (let j = 0; j < matchAmount; j++) {
                matchCandyTiles.push(internalBoard[r+j][column]);
                // console.log("candy " + j + ": " + internalBoard[r+j][column].type);
                
                if (j > 0 && matchCandyTiles[j-1].type != matchCandyTiles[j].type) {
                    matchFound = false;
                }
            }

            // if there is a match
            if (matchFound && matchCandyTiles.includes(checkTile)) {
                matchFive = matchFound;
                // console.log("MATCH R FOUND!!!!!");
                break;
            }
        }
    // match is a column; check rows
    } else {
        // console.log("checking rows for match 5");
        for (let c = 0; c < columns-(matchAmount-1); c++) {
            let matchCandyTiles = [];
            let matchFound = true;
            
            // console.log("match " + c);
            for (let j = 0; j < matchAmount; j++) {
                matchCandyTiles.push(internalBoard[row][c+j]);
                // console.log("candy " + j + ": " + internalBoard[row][c+j].type);
                
                if (j > 0 && matchCandyTiles[j-1].type != matchCandyTiles[j].type) {
                    matchFound = false;
                }
            }

            // if there is a match
            if (matchFound && matchCandyTiles.includes(checkTile)) {
                matchFive = matchFound;
                // console.log("MATCH C FOUND!!!!!");
                break;
            }
        }
    }

    // console.log("found match 5? " + matchFive);

    return matchFive;
}

function checkBombMechanics(checkTile, checkCandies, matchTiles, matchImages) {
    let isBomb = false;

    for (let i = 0; i < checkCandies.length; i = i+2) {
        // checks the left two, right two, or both
        // depending on what's added to checkCandies
        // checks checkCandies if anything was added to it

        // console.log("checking candies " + i + " & " + (i+1));
        // console.log("checking candy " + i + ": (" + checkCandies[i].row + ", " + checkCandies[i].column + ")");
        // console.log("type: " + checkCandies[i].type);
        // console.log("checking candy " + (i+1) + ": (" + checkCandies[i+1].row + ", " + checkCandies[i+1].column + ")");
        // console.log("type: " + checkCandies[i+1].type);

        if (checkCandies[i].type == checkTile.type &&
            checkCandies[i+1].type == checkTile.type) {
            
            // adds the tiles to the match array
            // console.log("BOMB DETECTED");
            isBomb = true;
            matchTiles.push(checkCandies[i]);
            matchTiles.push(checkCandies[i+1]);
            matchImages.push(board[checkCandies[i].row][checkCandies[i].column]);
            matchImages.push(board[checkCandies[i+1].row][checkCandies[i+1].column]);
            
            // remove the extra tile if there are more than 5
            if (matchTiles.length > 5) {
                extraTileBomb(checkTile, matchTiles, matchImages);
            }

            break;
        }
    }

    // console.log("found bomb mechanic? " + isBomb);
    return isBomb;
}

function extraTileBomb(checkTile, matchTiles, matchImages) {
    let index = matchTiles.findIndex(function (object) {
        return object === checkTile;
    });

    // console.log("checkTile is index " + index);

    if (index == 0 || index == 2) {
        // console.log("index 0 & 2 activated");
        // gets rid of the right most tile of the match
        for (let i = 3; i < (matchTiles.length-1); i++) {
            matchTiles[i] = matchTiles[i+1];
            matchImages[i] = matchImages[i+1];
        }

        // console.log("array shifted: ");
        // for (let i = 0; i < matchTiles.length; i++) {
            // console.log(i + " tile coords: (" + matchTiles[i].row + ", " + matchTiles[i].column+ ")");
            // console.log(i + " image coords: (" + matchImages[i].id);
        // }

        matchTiles.pop();
        matchImages.pop();
    } else if (index == 1 || index == 3) {
        // gets rid of the left most tile of the match
        // console.log("index 1 & 3 activated");
        for (let i = 0; i < (matchTiles.length-1); i++) {
            matchTiles[i] = matchTiles[i+1];
            matchImages[i] = matchImages[i+1];
        }

        // console.log("array shifted: ");
        // for (let i = 0; i < matchTiles.length; i++) {
            // console.log(i + " tile coords: (" + matchTiles[i].row + ", " + matchTiles[i].column+ ")");
            // console.log(i + " image coords: " + matchImages[i].id);
        // }

        matchTiles.pop();
        matchImages.pop();
    }
}

function boardMechanics(cleared) {
    // flag board as modified
    boardModified = true;
    
    if (!notClear) {
        tempScore += candy_value * cleared;
        // console.log("score: " + tempScore);
        combo += cleared;
        // console.log("combo: " + combo);
        comboBox.innerHTML = "x" + combo;
    }
            
}

/*function clearImages(images) {
    for (let i = 0; i < images.length; i++) {
        console.log("images1: " + images[i].src);
        animateCrush(images[i]);
        window.setTimeout(function() {
            images[i].src = blankTile.sprite;
            console.log("images1: " + images[i].src);
            reverseCrush(images[i]);
            populate();
        }, animationTime)
    }
}*/

/*function clearImagesSpecial(images, specialCandy, specialTile) {
    let selectedImage = document.getElementById(specialTile.row + "-" + specialTile.column);
    // let found = false;

    // console.log("swap id: " + selectedImage.id);
    // console.log("special candy: " + specialCandy.sprite);
    
    // is coords player made?
    for (let i = 0; i < images.length; i++) {
        if (selectedImage.id == images[i].id) {
            found = true;
        }
    }
    // console.log("player made? " + found);

    // if it's not player made
    if (!found) {
        // selects the 3rd tile to put the special candy there
        selectedImage = images[2];
    }
    
    for (let i = 0; i < images.length; i++) {
        // console.log("curr id: " + otherImage.id);
        // console.log("image id: " + images[i].id);
        animateCrush(images[i]);
        window.setTimeout(function() {
            if (selectedImage.id == images[i].id) {
                console.log("TRIGGERED SPECIAL IMAGE");
                images[i].src = specialCandy.sprite;
            } else {
                console.log("blank tile");
                images[i].src = blankTile.sprite;
            }
            reverseCrush(images[i]);

            populate();
        }, animationTime)
    }
}*/

function clearTiles(tiles, images) {
    // clearImages(images);

    let clear = [];
    // console.log("regular clear activated");
    for (let i = 0; i < tiles.length; i++) {
        // console.log("tiles1: " + tiles[i].type + ", " + tiles[i].variant);
        if (tiles[i].variant != "normal" &&
            tiles[i].variant != "blank") {
            transferArray(clear, activateSpecialCandy(tiles[i], false));
        } else {
            // tiles[i].type = "temp";
            // console.log("temp flag normal")
            animateCrush(images[i]);
            window.setTimeout(function() {
                // console.log("images b" + i + ": " + images[i].src);
                // console.log("tile type b" + i + ": " + tiles[i].type);
                // console.log("variant type b" + i + ": " + tiles[i].variant);
                images[i].src = blankTile.sprite;
                tiles[i].type = blankTile.type;
                tiles[i].variant = blankTile.variant;
                // console.log("images a" + i + ": " + images[i].src);
                // console.log("tile type a" + i + ": " + tiles[i].type);
                // console.log("variant type a" + i + ": " + tiles[i].variant);
                reverseCrush(images[i]);
                populate();
                // console.log("images a" + i + ": " + images[i].src);
                // console.log("tile type a" + i + ": " + tiles[i].type);
                // console.log("variant type a" + i + ": " + tiles[i].variant);
        }, animationTime)
        }
    }

    return clear;
}

function clearTilesSpecial(tiles, images, specialCandy) {
    let clear = [];
    let coords = otherImage.id.split("-"); // id="0-0" -> ["0", "0"]
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
    let selectedTile = internalBoard[r][c];
    let found = false;

    // console.log("swap coords: " + r + ", " + c);
    // console.log("special candy: " + specialCandy.type + ", " + specialCandy.variant);
    
    // is coords player made?
    for (let i = 0; i < tiles.length; i++) {
        if (selectedTile == tiles[i] && !matchedSpecial) {
            found = true;
        }
    }
    // console.log("player made? " + found);

    // if it's not player made
    if (!found) {
        // selects a random tile in the match array to put the special candy there
        selectedTile = randomize(tiles);
        // console.log("random coords: (" + selectedTile.row + ", " + selectedTile.column + ")");
    }
    // console.log("selected tile coords: (" + selectedTile.row + ", " + selectedTile.column + ")");

    // clearImagesSpecial(images, specialCandy, selectedTile);

    // places the special candy where you swapped it
    // or at a random location
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].variant != "normal" &&
            tiles[i].variant != "blank") {
            transferArray(clear, activateSpecialCandy(tiles[i], false));
        }
        
        // normal tiles
        
        // console.log("blank tile");
        tiles[i].type = "temp";
        // console.log("temp flag special")
        animateCrush(images[i]);
        window.setTimeout(function() {
            if (selectedTile == tiles[i]) {
                // console.log("TRIGGERED SPECIAL TILE");
                board[selectedTile.row][selectedTile.column].src = specialCandy.sprite;
                selectedTile.type = specialCandy.type;
                selectedTile.variant = specialCandy.variant;
            } else {
                images[i].src = blankTile.sprite;
                tiles[i].type = blankTile.type;
                tiles[i].variant = blankTile.variant;
            }
            reverseCrush(images[i]);

            populate();
        }, animationTime)
    }

    matchedSpecial = true;

    return clear;
}

let animationTime = 250;

function animateCrush(image) {
    image.style.transition = "all 25ms ease-out";
    image.style.transform = "scale(1.10)";
    window.setTimeout(function() {
        image.style.transition = "all 0.250s ease-in";
        image.style.transform = "scale(0)";
    }, 25)
}

function reverseCrush(image) {
    image.style.transition = "0s";
    image.style.transform = "scale(1)";
}

function reverseCrushSpecial(image) {
    image.style.transition = "all 0.5s ease-in";
    image.style.transform = "scale(1)";
}

function checkValid(currTile, otherTile) {

    if (currTile.type == donutType || otherTile.type == donutType) {
        donutActivated = true;
        return true;
    }

    // check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = internalBoard[r][c];
            let candy2 = internalBoard[r][c+1];
            let candy3 = internalBoard[r][c+2];
            if (candy1.type == candy2.type && candy2.type == candy3.type &&
                candy1.type != blankTile.type) {
                return true;
            }
        }
    }

    // check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = internalBoard[r][c];
            let candy2 = internalBoard[r+1][c];
            let candy3 = internalBoard[r+2][c];
            if (candy1.type == candy2.type && candy2.type == candy3.type &&
                candy1.type != blankTile.type) {
                return true;
            }
        }
    }

    return false;
}

function populate() {
    // console.log("notPopulated before: " + notPopulated);
    checkBlank();
    // console.log("notPopulated after: " + notPopulated);
    while (notPopulated) {
        // console.log("a");
        dropCandy();
        generateCandy();
        checkBlank();
    }
}

function checkBlank() {
    // console.log("checking for blanks");
    let found = false;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let currTile = internalBoard[r][c];
            // console.log("current image coords: (" + r + ", " + c + ")");
            // console.log("image: " + currImage.src);
            // console.log("condition: " + currImage.src.includes(blankTile.sprite.substring(2)));
            if (currTile.type == blankTile.type) {
                found = true;
            }
        }
    }

    notPopulated = found;
}

// drops the candy above empty tiles downwards
function dropCandy() {
    // iterate through columns -> this way
    for (let c = 0; c < columns; c++) {
        let i = rows - 1;
        // iterate through rows ^ this way
        for (let r = columns - 1; r >= 0; r--) {
            // console.log("column: " + c + "\nrow: " + r);
            let selectedImage = board[r][c];
            let selectedTile = internalBoard[r][c];
            //!selectedImage.src.includes(blankTile.sprite.substring(2))
            if (selectedTile.type != blankTile.type) {
                // if tile is not blank, move to bottom of the board
                if (i != r) {
                    board[i][c].src = selectedImage.src;
                    internalBoard[i][c].type = selectedTile.type;
                    internalBoard[i][c].variant = selectedTile.variant;
                    
                    // console.log("image: " + selectedImage.src);
                    // console.log("type: " + selectedTile.type);
                    // console.log("type: " + selectedTile.variant);
                    // console.log("condition value: " + selectedImage.src.search(selectedTile.type));
                    /*if (selectedTile.type != "temp" && selectedImage.src.search(selectedTile.type) == -1) {
                        console.log("DROP CANDY ERROR");
                        console.log("candy: " + board[r][c].src);
                        console.log("dropped from (" + r + ", " + c + ")");
                        console.log("to (" + i + ", " + c + ")");
                        console.log("swap type: " + internalBoard[r][c].type);
                        console.log("swap variant: " + internalBoard[r][c].variant);
                    }*/
                }
                // change the bottom to be one candy above
                i -= 1;
            }
        }

        // fill the rest with blank spaces
        for (let r = i; r >= 0; r--) {
            board[r][c].src = blankTile.sprite;
            internalBoard[r][c].type = blankTile.type;
            internalBoard[r][c].variant = blankTile.variant;
        }
    }
}

// only generates a row of new candy and only for the blank tiles
// dropCandy() slides the generated candy downwards
function generateCandy() {
    for (let c = 0; c < columns; c++) {
        // if top tile of any column is empty
        // board[0][c].src.includes(blankTile.sprite.substring(2))
        if (internalBoard[0][c].type == blankTile.type) {
            // generates new candy
            let newCandy = randomize(candies);
            let matchCandyIndex;
            for (let i = 0; i < candies.length; i++) {
                if (newCandy.type == candies[i].type) {
                    // console.log("MATCH TYPE");
                    matchCandyIndex = i;
                    break;
                } else if (newCandy.sprite == candies[i].sprite) {
                    // console.log("MATCH SPRITE");
                    matchCandyIndex = i;
                    break;
                }
            }
            /*if (candies[matchCandyIndex].type != newCandy.type ||
                candies[matchCandyIndex].variant != newCandy.variant ||
                candies[matchCandyIndex].sprite != newCandy.sprite) {
                console.log("GENERATE CANDY ERROR!!");
                console.log("column: " + c);
                console.log(newCandy.sprite);
                console.log(newCandy.type);
                console.log(newCandy.variant);
            }*/
            board[0][c].src = newCandy.sprite;
            internalBoard[0][c].type = newCandy.type;
            internalBoard[0][c].variant = newCandy.variant;
        }
    }
}

// not working?
function rollLine(voiceBank) {
    let voiceline = randomize(voiceBank).audio;
    if (prevLine != null) {
        // console.log("prev line:" + prevLine.src);
    }
    // console.log("expression 1: " + (voiceBank.length > 1));
    // console.log("expression 2: " + (voiceline == prevLine));
    while (voiceBank.length > 1 && voiceline == prevLine) {
        voiceline = randomize(voiceBank).audio;
        // console.log("in loop:" + voiceline.src);
    }
    // console.log("out loop:" + voiceline.src);
    prevLine = voiceline;
    return voiceline;
}

// sound effects + voice lines depending on number of matches per tick
function playMatchSFX() {
    // console.log("match: " + matches);
    // cloneNode so another instance of the audio is playing
        // allows the same sound to play, even if it's already playing
        // if not --> awkward silence

    let sfx = adjustVolume(crushSfx.cloneNode(true), crushSfx);
    // let line;
    // let specialSfx = adjustVolume(???.cloneNode(true), ???);
    /* if (matches == 1) {
        sfx = adjustVolume(combo_sfx[0].audio.cloneNode(true), combo_sfx[0].audio);
    } else if (matches == 2) {
        sfx = adjustVolume(combo_sfx[1].audio.cloneNode(true), combo_sfx[1].audio);
        line = rollLine(ok_voice);
        line = adjustVolume(line.cloneNode(true), line);
    } else if (matches == 3) {
        sfx = adjustVolume(combo_sfx[2].audio.cloneNode(true), combo_sfx[2].audio);
        line = rollLine(good_voice);
        line = adjustVolume(line.cloneNode(true), line);
    } else if (matches == 4) {
        sfx = adjustVolume(combo_sfx[3].audio.cloneNode(true), combo_sfx[3].audio);
        line = rollLine(great_voice);
        line = adjustVolume(line.cloneNode(true), line);
    } else if (matches > 4) {
        sfx = adjustVolume(combo_sfx[3].audio.cloneNode(true), combo_sfx[3].audio);
        line = rollLine(excellent_voice);
        line = adjustVolume(line.cloneNode(true), line);
    }*/

    sfx.play();

    /*if (matches > 1) {
        line.play();
    }*/

    /* if (special) {
        specialSfx.play();
    }*/
}

function adjustVolume(clone, audio) {
    clone.volume = audio.volume;
    return clone;
}

settings.addEventListener("click", openMenu);
let menuVisable = false;

// opens the sound menu
function openMenu() {
    if (!menuVisable) {
        menuVisable = true;
        menu.style.opacity = "1";
        menu.style.transform = "translate(-50%, -50%)";
        menuOverlay.style.width = "100%";
    } else {
        closeMenu();
    }
}

function closeMenu() {
    menuVisable = false;
    menu.style.opacity = "0";
    menu.style.transform = "translate(-50%, 200%)";
    menuOverlay.style.width = "0%";
}

infoButton.addEventListener("click", openInfo);
let infoVisable = false;

// opens the info card
function openInfo() {
    if (!infoVisable) {
        infoVisable = true;
        info.style.opacity = "1";
        info.style.transform = "translate(-50%, -50%)";
        infoOverlay.style.width = "100%";
    } else {
        closeInfo();
    }
}

function closeInfo() {
    infoVisable = false;
    info.style.opacity = "0";
    info.style.transform = "translate(-50%, 200%)";
    infoOverlay.style.width = "0%";
}

bgmSlider.addEventListener("input", bgmVolume);
sfxSlider.addEventListener("input", sfxVolume);
// voiceSlider.addEventListener("input", voiceVolume);

function bgmVolume() {
    volumeControl(bgmSlider, bgmBar, bgmValue, bgmSpeaker);
    bgmSavedVolume = bgmSlider.value;
    setVolume(bgm, bgmSavedVolume);
}

function sfxVolume() {
    volumeControl(sfxSlider, sfxBar, sfxValue, sfxSpeaker);
    sfxSavedVolume = sfxSlider.value;
    setVolume(crushSfx, sfxSavedVolume);
}

function voiceVolume() {
    volumeControl(voiceSlider, voiceBar, voiceValue, voiceSpeaker);
    voiceSavedVolume = voiceSlider.value;
    setArrayVolume(ok_voice, voiceSavedVolume);
    setArrayVolume(good_voice, voiceSavedVolume);
    setArrayVolume(great_voice, voiceSavedVolume);
    setArrayVolume(excellent_voice, voiceSavedVolume);
}

function volumeControl(slider, bar, value, speaker) {
    bar.value = slider.value;
    value.innerHTML = slider.value;
    // if the bar is 0
    if (slider.value == 0) {
        // change the speaker icon to muted
        // speaker.src = "./public/images/ui/mute.svg";
        speaker.setAttribute("href", "./public/images/ui/mute.svg")
    } else {
        // speaker.src = "./public/images/ui/volume.svg";
        speaker.setAttribute("href", "./public/images/ui/volume.svg")
        
    }
}

function setVolume(audio, value) {
    audio.volume = value / 100;
}

function setArrayVolume(audioArray, value) {
    for (i = 0; i < audioArray.length; i++) {
        setVolume(audioArray[i].audio, value);
    }
}

bgmSpeaker.addEventListener("click", bgmMute);
sfxSpeaker.addEventListener("click", sfxMute);
// voiceSpeaker.addEventListener("click", voiceMute);

function bgmMute() {
    setMute(bgmSlider, bgmBar, bgmValue, bgmSpeaker, bgmSavedVolume);
    setVolume(bgm, bgmSlider.value);
}

function sfxMute() {
    setMute(sfxSlider, sfxBar, sfxValue, sfxSpeaker, sfxSavedVolume);
    setVolume(crushSfx, sfxSavedVolume);
}

function voiceMute() {
    setMute(voiceSlider, voiceBar, voiceValue, voiceSpeaker, voiceSavedVolume);
    setArrayVolume(ok_voice, voiceSlider.value);
    setArrayVolume(good_voice, voiceSlider.value);
    setArrayVolume(great_voice, voiceSlider.value);
    setArrayVolume(excellent_voice, voiceSlider.value);
}

function setMute(slider, bar, value, speaker, volume) {
    if (slider.value > 0) {
        // change the speaker icon to muted
        speaker.setAttribute("href", "./public/images/ui/mute.svg")
        // speaker.src = ;
        // set everything to 0
        slider.value = 0;
        bar.value = 0;
        value.innerHTML = 0;
    } else {
        // change the speaker to sound on
        if (volume > 0) {
            speaker.setAttribute("href", "./public/images/ui/volume.svg")
            // speaker.src = ;
        }
        // change the value to the last remembered value
        slider.value = volume;
        bar.value = volume;
        value.innerHTML = volume;
    }
}