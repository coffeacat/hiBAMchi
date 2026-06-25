// select all elements
const finalScoreOverlay = document.getElementById("finalScoreContainer");
const finalScoreBox = document.getElementById("finalScoreMessage");
const scoreBox = document.getElementById("score");
const comboBox = document.getElementById("combo");

// const music = document.getElementById("track");
const settings = document.getElementById("settingsButton");
const menu = document.getElementById("menu");
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
const OKButton = document.getElementById("OKButton");

// document.addEventListener('click', playMusic, { once: true });
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
    // offset because the body is being weird
    // and there's an extra slice of something to the right...
    // remove offset if it causes issues
    let winW = window.innerWidth - 16;
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
    el.style.transform="scale("+scale+")"
    if (winW<=aspecW)
        el.style.left=((winW-aspecW)/2).toFixed(2)+'px'
    else
        el.style.left='0px'

    el.style.top=((el.getBoundingClientRect().height-aspecH)/2).toFixed(2)+'px'
}

class Tile {
    constructor(type, variant, row, column) {
        this.type = type;
        this.variant = variant;
        this.row = row;
        this.column = column;
    }
}

// create our candy types
let candies = [
    {
	    type: "perfume",
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "./public/images/candy/perfume.png"
	},{
		type: "manatown",
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "./public/images/candy/manatown.png"
	},{
		type: "bow",
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "./public/images/candy/bow.png"
	},{
		type: "clover",
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "./public/images/candy/clover.png"
	},{
	    type: "osmanthus",
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "./public/images/candy/osmanthus.png"
	},{
		type: "note",
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "./public/images/candy/note.png"
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
	    type: "perfume",
		variant: "horizontal_4",
		sprite: "./public/images/candy/perfume_side_stripe.png"
	},{
		type: "manatown",
		variant: "horizontal_4",
		sprite: "./public/images/candy/manatown_side_stripe.png"
	},{
		type: "bow",
		variant: "horizontal_4",
		sprite: "./public/images/candy/bow_side_stripe.png"
	},{
		type: "clover",
		variant: "horizontal_4",
		sprite: "./public/images/candy/clover_side_stripe.png"
	},{
	    type: "osmanthus",
		variant: "horizontal_4",
		sprite: "./public/images/candy/osmanthus_side_stripe.png"
	},{
		type: "note",
		variant: "horizontal_4",
		sprite: "./public/images/candy/note_side_stripe.png"
	},{
	    type: "perfume",
		variant: "vertical_4",
		sprite: "./public/images/candy/perfume_up_stripe.png"
	},{
		type: "manatown",
		variant: "vertical_4",
		sprite: "./public/images/candy/manatown_up_stripe.png"
	},{
		type: "bow",
		variant: "vertical_4",
		sprite: "./public/images/candy/bow_up_stripe.png"
	},{
		type: "clover",
		variant: "vertical_4",
		sprite: "./public/images/candy/clover_up_stripe.png"
	},{
	    type: "osmanthus",
		variant: "vertical_4",
		sprite: "./public/images/candy/osmanthus_up_stripe.png"
	},{
		type: "note",
		variant: "vertical_4",
		sprite: "./public/images/candy/note_up_stripe.png"
	},{
	    type: "perfume",
		variant: "bomb",
		sprite: "./public/images/candy/perfume_candy.png"
	},{
		type: "manatown",
		variant: "bomb",
		sprite: "./public/images/candy/manatown_candy.png"
	},{
		type: "bow",
		variant: "bomb",
		sprite: "./public/images/candy/bow_candy.png"
	},{
		type: "clover",
		variant: "bomb",
		sprite: "./public/images/candy/clover_candy.png"
	},{
	    type: "osmanthus",
		variant: "bomb",
		sprite: "./public/images/candy/osmanthus_candy.png"
	},{
		type: "note",
		variant: "bomb",
		sprite: "./public/images/candy/note_candy.png"
	},{
        type: donutType,
        variant: donutVariant,
        sprite: "./public/images/candy/donut.png"
    }
];

let blankTile = {
	type: "blank",
	variant: "blank", // horizontal 4, vertical 4, bomb, full clear
	sprite: "./public/images/candy/blank.png"
};

// store the bgm
let bgm = new Audio("./public/audio/tokotokokizzu.mp3");
bgm.autoplay = true;
bgm.loop = true;

// store the combo sfx
let combo_sfx = [
    {
		audio: new Audio("./public/audio/paper jam sfx/OK.wav")
	},{
		audio: new Audio("./public/audio/paper jam sfx/Good.wav")
	},{
		audio: new Audio("./public/audio/paper jam sfx/Great.wav")
	},{
		audio: new Audio("./public/audio/paper jam sfx/Excellent.wav")
    }
];

// store the ok voice lines
let ok_voice = [
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
];

let sfx = new Audio("./public/audio/paper jam sfx/OK.wav");

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

var currImage;
var otherImage;
var candy_value = 50;
let globalMatchCap;
var isPlaying = false;
var countdownInterval;
var candyInterval;
var boardInterval;
var setTimer;
var bpm = 138;

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
            //// tile.style.backgroundImage = url("donut.png");
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

    primeBoard();
}

// prime the board for gameplay
function primeBoard() {
    clearInterval(candyInterval);
    clearInterval(boardInterval);

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
	
	boardInterval = window.setInterval(function() {
		dropCandy();
		generateCandy();
	}, 100 // every 100ms, will "drop" candy over blank tiles and replace with new candy
	)

    clearBoard();

}

// clearBoard is continously checked until the board is clear of matches
function clearBoard() {
    if (playerAction) {
        console.log("board not cleared");
        window.setTimeout(clearBoard, 1000);
    // when it is clear of matches, the game starts
    } else {
        // resets when to check for clearing candy (according to bgm)
        clearInterval(candyInterval);
        candyInterval = window.setInterval(function() {
			checkCandy();
		}, (bpm * (2000 / 120) / 2)
		)

        notClear = false;
        globalMatchCap = 5;

        if (startGame) {
            gameGo();
        }
    }
}

function gameGo() {
    // start game conditions
    window.setTimeout(function() {
        // sets and updates timer for the game
        setTimer = setInterval(timerCountDown, 1000);

        // resets the bgm
        bgm.pause();   // pauses the bgm
        bgm.currentTime = 0; // and resets it
        bgm.play();

        // deletes/resets the 3 second countdown (for future use)
        clearInterval(countdownInterval);
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

    countdownInterval = window.setInterval(function() {
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
        [ 2, 3, 5, 0, 5, 5, 3, 5, 0, 1 ],
        [ 1, 2, 3, 5, 0, 1, 2, 3, 4, 5 ],
        [ 0, 1, 2, 5, 4, 0, 1, 2, 3, 5 ],
        [ 4, 0, 5, 2, 5, 4, 0, 1, 2, 3 ],
        [ 3, 4, 0, 1, 2, 3, 4, 0, 1, 2 ],
        [ 2, 3, 4, 0, 1, 2, 3, 4, 0, 1 ],
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
    finalScoreBox.innerHTML = "You scored<br/>" + score + "<br/><br/>Press OK to continue.";
    OKButton.style.display = "inline-flex";

    clearInterval(setTimer);
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
    finalScoreOverlay.style.width = "0%";
    finalScoreBox.innerHTML = "";
    OKButton.style.display = "none";
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
        let isValid = checkValid();
        if (!isValid) {
            // if not, swaps the images back
            let temp = otherImage.src;
            otherImage.src = currImage.src;
            currImage.src = temp;

            temp = otherTile;
            otherTile.type = currTile.type;
            otherTile.variant = currTile.variant;
            currTile.type = temp.type;
            currTile.variant = temp.variant;
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
    if (playerAction) {
        crushCandy();
        console.log("CRUSHED!");
    }
    console.log("check candy");
}

function crushCandy() {
    // crushFive();
    // crushFour();
    crushThree();
    // console.log("PA1: " + playerAction);
    // console.log("BM1: " + boardModified);
    if (!boardModified) {
        playerAction = false;
        matchedSpecial = false;
        // console.log("final score added: " + tempScore*combo);
        score += tempScore * combo;
        scoreBox.innerHTML = score;
        tempScore = 0;
        combo = 0;
        matches = 0;
        comboBox.innerHTML = "x" + combo;
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
function crushThree() {
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

    let combo = calculateCombo(matchArray);
    if (combo != 0) {
        boardMechanics(combo);
    }
    return matchArray;
}

function matchMechanics(matchCandyTiles, matchCandyImages, matchFound, matchAmount, horizontal) {
    let comboArray = [];

    // match 5
    if (matchAmount == 5) {
        if (matchFound && matchCandyTiles[0].type != blankTile.type
            && matchCandyTiles[0].type != donutType) {
            let donut = special_candies[special_candies.length - 1];

            comboArray = clearTilesSpecial(matchCandyTiles, matchCandyImages, donut);
            transferArray(comboArray, matchCandyTiles);
        }
    // match 4
    } else if (matchAmount == 4) {
        // if it's a match 5 ignore it
        if (matchFound && matchCandyTiles[0].type != blankTile.type
            && matchCandyTiles[0].type != donutType) {
            let ignore = isMatchGreater(matchCandyTiles, horizontal);
            
            console.log("ignore the 4 match? " + ignore);

            if (!ignore) {
                let specialCandy;

                if (horizontal) {
                    specialCandy = findCandy(matchCandyTiles[0].type, "vertical_4", special_candies);
                } else {
                    specialCandy = findCandy(matchCandyTiles[0].type, "horizontal_4", special_candies);
                }

                let isBomb = checkBomb(matchCandyTiles, matchCandyImages, horizontal);
                console.log("is4Bomb? " + isBomb);
            
                if (isBomb) {
                    // find appropriate bomb candy
                    specialCandy = findCandy(matchCandyTiles[0].type, "bomb", special_candies);
                    // console.log("bomb candy: " + specialCandy.type + " " + specialCandy.variant);
                }
                            
                comboArray = clearTilesSpecial(matchCandyTiles, matchCandyImages, specialCandy);
                transferArray(comboArray, matchCandyTiles);
            }
        }
    // match 3 & bombs
    } else {
        if (matchFound && matchCandyTiles[0].type != blankTile.type
            && matchCandyTiles[0].type != donutType) {
            let ignore = isMatchGreater(matchCandyTiles, horizontal);
            
            // if the game hasn't started
            if (notClear) {
                console.log("game not started");
                // clear the tiles anyways
                ignore = false;
            }

            console.log("ignore the match? " + ignore);

            // if it's a match 4 or 5, ignore it
            if (!ignore) {
                let isBomb = checkBomb(matchCandyTiles, matchCandyImages, horizontal);
                console.log("isBomb? " + isBomb);
            
                if (isBomb && !notClear) {
                    // find appropriate bomb candy
                    let bomb = findCandy(matchCandyTiles[0].type, "bomb", special_candies);
                    // console.log("bomb candy: " + specialCandy.type + " " + specialCandy.variant);

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

    console.log("active: " + candy.type + ", " + variant);

    if (variant == "horizontal_4" || variant == "vertical_4") {
        clearArray = activateStripe(candy);
    }
    
    if (variant == "bomb") {
        clearArray = activateBomb(candy);
    }

    if (variant == donutVariant) {
        candy.type = blankTile.type;
        candy.variant = blankTile.variant;
        board[candy.row][candy.column].src = blankTile.sprite;
        clearArray.push(candy);
        // combo =+ activateDonut(candy, random);
    }

    return clearArray;
}

function activateStripe(candy) {
    console.log("activated stripe");
    let variant = candy.variant;
    let clearTiles = [];
    let specialArrays = [];

    // if the stripe is horizontal, clear a row
    if (variant == "horizontal_4") {
        let row = candy.row;
        for (let i = 0; i < columns; i++) {
            console.log("coordinates: (" + row + ", " + i + ")");
            // if the tile to clear is the special candy
            if (candy == internalBoard[row][i]) {
                clearTiles.push(internalBoard[row][i]);
                internalBoard[row][i].type = blankTile.type;
                internalBoard[row][i].variant = blankTile.variant;
                board[row][i].src = blankTile.sprite;
            // if the tile to clear is ANOTHER special candy
            } else if (internalBoard[row][i].variant != "normal" && 
                       internalBoard[row][i].variant != "blank") {
                console.log("activated special candy");
                // activates the special candy and returns with another array
                // with candies that special candy has cleared
                let specialArray = activateSpecialCandy(internalBoard[row][i], true);
                transferArray(specialArrays, specialArray);
            // otherwise clears the tile if it's not already cleared
            } else {
                console.log("activated r else");
                if (internalBoard[row][i].type != "blank") {
                    console.log("not blank");
                    clearTiles.push(internalBoard[row][i]);
                    internalBoard[row][i].type = blankTile.type;
                    internalBoard[row][i].variant = blankTile.variant;
                    board[row][i].src = blankTile.sprite;
                }
            }
        }
    } else {
        let column = candy.column;
        for (let i = 0; i < rows; i++) {
            console.log("coordinates: (" + i + ", " + column + ")");
            if (candy == internalBoard[i][column]) {
                clearTiles.push(internalBoard[i][column]);
                internalBoard[i][column].type = blankTile.type;
                internalBoard[i][column].variant = blankTile.variant;
                board[i][column].src = blankTile.sprite;
            } else if (internalBoard[i][column].variant != "normal" &&
                       internalBoard[i][column].variant != "blank") {
                console.log("activated special candy");
                let specialArray = activateSpecialCandy(internalBoard[i][column], true);
                transferArray(specialArrays, specialArray);
            } else {
                console.log("activated c else");
                if (internalBoard[i][column].type != "blank") {
                    clearTiles.push(internalBoard[i][column]);
                    internalBoard[i][column].type = blankTile.type;
                    internalBoard[i][column].variant = blankTile.variant;
                    board[i][column].src = blankTile.sprite;
                }
            }
        }
    }

    // add this array to any special arrays
    transferArray(clearTiles, specialArrays);

    console.log("all stripe tiles");
    for (let k = 0; k < clearTiles.length; k++) {
        console.log("coords: (" + clearTiles[k].row + ", " + clearTiles[k].column +
        "); type: " + clearTiles[k].type + "; variant: " + clearTiles[k].variant);
    }

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
    console.log("bomb clear tiles");
    for (let i = 0; i < clearTiles.length; i++) {
        let curr = clearTiles[i];
        let currRow = curr.row;
        let currCol = curr.column;

        console.log("tile "+ i + ": (" + currRow + ", " + currCol + ")");
        
        // if it's the bomb, clear it
        if (curr == candy) {
            console.log("go off");
            internalBoard[currRow][currCol].type = blankTile.type;
            internalBoard[currRow][currCol].variant = blankTile.variant;
            board[currRow][currCol].src = blankTile.sprite;
        // if it's a special candy activate it
        } else if (internalBoard[currRow][currCol].variant != "normal" &&
                   internalBoard[currRow][currCol].variant != "blank") {
            console.log("activate another bomb");
            let specialArray = activateSpecialCandy(internalBoard[currRow][currCol], true);
            transferArray(specialArrays, specialArray);
        // if it's normal, clear it if it's not already cleared
        } else {
            if (internalBoard[currRow][currCol].type != "blank") {
                internalBoard[currRow][currCol].type = blankTile.type;
                internalBoard[currRow][currCol].variant = blankTile.variant;
                board[currRow][currCol].src = blankTile.sprite;
            }
        }
    }

    // add this bomb array to any special arrays
    transferArray(clearTiles, specialArrays);

    console.log("all bomb tiles");
    for (let k = 0; k < clearTiles.length; k++) {
        console.log("coords: (" + clearTiles[k].row + ", " + clearTiles[k].column +
        "); type: " + clearTiles[k].type + "; variant: " + clearTiles[k].variant);
    }

    return clearTiles;
}

function activateDonut(candy, random) {
    let clearTiles = [];
    let specialArrays = [];

    let type;

    if (!random) {
        let currCoords = currImage.id.split("-"); // id="0-0" -> ["0", "0"]
            let r1 = parseInt(currCoords[0]);
            let c1 = parseInt(currCoords[1]);
        
        let otherCoords = otherImage.id.split("-"); // id="0-0" -> ["0", "0"]
            let r2 = parseInt(otherCoords[0]);
            let c2 = parseInt(otherCoords[1]);
        
        let currTile = internalBoard[r1][c1];
        let otherTile = internalBoard[r2][c2];

        if (currTile.type != donutType) {
            type = currTile.type;
        } else {
            type = otherTile.type;
        }
    } else {
        type = randomize(candies).type;
    }

    // remove donut

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // clear all type
            //if ( == type)
            // if special candy activate it
        }
    }

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

    console.log("all combo tiles - after " + combo);
    for (let k = 0; k < comboTiles.length; k++) {
        console.log("coords: (" + comboTiles[k].row + ", " + comboTiles[k].column +
            "); type: " + comboTiles[k].type + "; variant: " + comboTiles[k].variant);
    }
    
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
                    console.log("IGNORE TRIGGERED 1");
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
                    console.log("IGNORE TRIGGERED 2");
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
                    console.log("IGNORE TRIGGERED 3");
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
                    console.log("IGNORE TRIGGERED 4");
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
        console.log("ROW MATCH DETECTED");
        console.log("CHECKING FOR INTERSECTING COLUMNS");

        // checks for L formations
        // for each tile in the found match
        for (let i = 0; i < matchTiles.length; i++) {
            // if there's no match 5 or bomb already found in the cross section
            if (!matchFive && !isBomb) {
                let checkTile = matchTiles[i];
                let row = checkTile.row;
                let column = checkTile.column;

                let checkCandies = [];

                console.log("check row: " + row);
                console.log("check column: " + column);
                
                // if there is room up
                if (row > 2) {
                    console.log("CHECKING 2 UP");
                    // check 2 tiles up
                    checkCandies.push(internalBoard[row-2][column]);
                    checkCandies.push(internalBoard[row-1][column]);
                }

                // if there is room down
                if (row <= 7) {
                    console.log("CHECKING 2 DOWN");
                    // check 2 tiles down
                    checkCandies.push(internalBoard[row+1][column]);
                    checkCandies.push(internalBoard[row+2][column]);
                }

                for (let i = 0; i < checkCandies.length; i++) {
                    console.log("check candy " + i + " position: (" +
                    checkCandies[i].row + ", " + checkCandies[i].column + ")");
                }

                // records whether there was a match 5 found or not
                matchFive = findMatchFive(checkTile, horizontal);
                
                // if there's not a match 5 found
                if (!matchFive) {
                    isBomb = checkBombMechanics(checkTile, checkCandies, matchTiles, matchImages);
                    console.log("found bomb? " + isBomb);
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
                
                console.log("check row: " + row);
                console.log("check column: " + column);

                // if there is room up and down
                if (row != 0 && row != 9) {
                    console.log("CHECKING 1 UP AND 1 DOWN");
                    // check 1 tile up and 1 tile down
                    checkCandies.push(internalBoard[row-1][column]);
                    checkCandies.push(internalBoard[row+1][column]);
                }

                // records whether there was a match 5 found or not
                matchFive = findMatchFive(checkTile, horizontal);
                
                // if there's not a match 5 found
                if (!matchFive) {
                    isBomb = checkBombMechanics(checkTile, checkCandies, matchTiles, matchImages);
                    console.log("found bomb? " + isBomb);
                }

            }
        }
    // vertical case
    } else {
        console.log("COLUMN MATCH DETECTED");
        console.log("CHECKING FOR INTERSECTING ROWS");
        
        // checks for L formations
        // for each tile in the found match
        for (let i = 0; i < matchTiles.length; i++) {
            // if there's no match 5 or bomb already found in the cross section
            if (!matchFive && !isBomb) {
                let checkTile = matchTiles[i];
                let row = checkTile.row;
                let column = checkTile.column;

                let checkCandies = [];
                
                console.log("check row: " + row);
                console.log("check column: " + column);

                // if there is room left
                if (column > 2) {
                    console.log("CHECKING 2 LEFT");
                    // check 2 tiles left
                    checkCandies.push(internalBoard[row][column-2]);
                    checkCandies.push(internalBoard[row][column-1]);
                }

                if (column <= 7) {
                    console.log("CHECKING 2 RIGHT");
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

                console.log("check row: " + row);
                console.log("check column: " + column);
                
                // if there is room left and right
                if (column != 0 && column != 9) {
                    console.log("CHECKING 1 LEFT AND 1 RIGHT");
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
                console.log("MATCH R FOUND!!!!!");
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
                console.log("MATCH C FOUND!!!!!");
                break;
            }
        }
    }

    console.log("found match 5? " + matchFive);

    return matchFive;
}

function checkBombMechanics(checkTile, checkCandies, matchTiles, matchImages) {
    let isBomb = false;

    for (let i = 0; i < checkCandies.length; i = i+2) {
        // checks the left two, right two, or both
        // depending on what's added to checkCandies
        // checks checkCandies if anything was added to it

        console.log("checking candies " + i + " & " + (i+1));
        console.log("checking candy " + i + ": (" + checkCandies[i].row + ", " + checkCandies[i].column + ")");
        console.log("type: " + checkCandies[i].type);
        console.log("checking candy " + (i+1) + ": (" + checkCandies[i+1].row + ", " + checkCandies[i+1].column + ")");
        console.log("type: " + checkCandies[i+1].type);

        if (checkCandies[i].type == checkTile.type &&
            checkCandies[i+1].type == checkTile.type) {
            
            // adds the tiles to the match array
            console.log("BOMB DETECTED");
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

    console.log("found bomb mechanic? " + isBomb);
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

function clearImages(images) {
    for (let i = 0; i < images.length; i++) {
        console.log("images1: " + images[i].src);
        images[i].src = blankTile.sprite;
    }
}

function clearImagesSpecial(images, specialCandy, specialTile) {
    let selectedImage = document.getElementById(specialTile.row + "-" + specialTile.column);
    // let found = false;

    // console.log("swap id: " + selectedImage.id);
    // console.log("special candy: " + specialCandy.sprite);
    
    // is coords player made?
    /* for (let i = 0; i < images.length; i++) {
        if (selectedImage.id == images[i].id) {
            found = true;
        }
    }
    // console.log("player made? " + found);

    // if it's not player made
    if (!found) {
        // selects the 3rd tile to put the special candy there
        selectedImage = images[2];
    } */
    
    for (let i = 0; i < images.length; i++) {
        // console.log("curr id: " + otherImage.id);
        // console.log("image id: " + images[i].id);
        if (selectedImage.id == images[i].id) {
            console.log("TRIGGERED SPECIAL IMAGE");
            images[i].src = specialCandy.sprite;
        } else {
            console.log("blank tile");
            images[i].src = blankTile.sprite;
        }
    }
}

function clearTiles(tiles, images) {
    let clear = [];
    console.log("regular clear activated");
    for (let i = 0; i < tiles.length; i++) {
        console.log("tiles1: " + tiles[i].type + ", " + tiles[i].variant);
        if (tiles[i].variant != "normal" &&
            tiles[i].variant != "blank") {
            transferArray(clear, activateSpecialCandy(tiles[i], false));
        } else {
            tiles[i].type = blankTile.type;
            tiles[i].variant = blankTile.variant;
        }
    }

    clearImages(images);

    return clear;
}

function clearTilesSpecial(tiles, images, specialCandy) {
    let clear = [];
    let coords = otherImage.id.split("-"); // id="0-0" -> ["0", "0"]
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
    let selectedTile = internalBoard[r][c];
    let found = false;

    console.log("swap coords: " + r + ", " + c);
    console.log("special candy: " + specialCandy.type + ", " + specialCandy.variant);
    
    // is coords player made?
    for (let i = 0; i < tiles.length; i++) {
        if (selectedTile == tiles[i] && !matchedSpecial) {
            found = true;
        }
    }
    console.log("player made? " + found);

    // if it's not player made
    if (!found) {
        // selects a random tile in the match array to put the special candy there
        selectedTile = randomize(tiles);
        console.log("random coords: (" + selectedTile.row + ", " + selectedTile.column + ")");
    }
    console.log("selected tile coords: (" + selectedTile.row + ", " + selectedTile.column + ")");
    // places the special candy where you swapped it
    // or at the third tile of the match
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].variant != "normal" &&
            tiles[i].variant != "blank") {
            transferArray(clear, activateSpecialCandy(tiles[i], false));
        }
        
        if (selectedTile != tiles[i]) {
            // skip
            console.log("blank tile");
            tiles[i].type = blankTile.type;
            tiles[i].variant = blankTile.variant;
        }
    }

    console.log("TRIGGERED SPECIAL TILE");
    selectedTile.type = specialCandy.type;
    selectedTile.variant = specialCandy.variant;

    matchedSpecial = true;

    clearImagesSpecial(images, specialCandy, selectedTile);

    return clear;
}

function checkValid() {

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
            if (!selectedImage.src.includes(blankTile.sprite.substring(2))) {
                // if tile is not blank, move to bottom of the board
                if (i != r) {
                    board[i][c].src = selectedImage.src;
                    internalBoard[i][c].type = selectedTile.type;
                    internalBoard[i][c].variant = selectedTile.variant;
                    
                    // console.log("image: " + selectedImage.src);
                    // console.log("type: " + selectedTile.type);
                    // console.log("condition value: " + selectedImage.src.search(selectedTile.type));
                    if (selectedImage.src.search(selectedTile.type) == -1) {
                        console.log("DROP CANDY ERROR");
                        console.log("candy: " + board[r][c].src);
                        console.log("dropped from (" + r + ", " + c + ")");
                        console.log("to (" + i + ", " + c + ")");
                        console.log("swap type: " + internalBoard[r][c].type);
                        console.log("swap variant: " + internalBoard[r][c].variant);
                    }
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
        if (board[0][c].src.includes(blankTile.sprite.substring(2))) {
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
            if (candies[matchCandyIndex].type != newCandy.type ||
                candies[matchCandyIndex].variant != newCandy.variant ||
                candies[matchCandyIndex].sprite != newCandy.sprite) {
                console.log("GENERATE CANDY ERROR!!");
                console.log("column: " + c);
                console.log(newCandy.sprite);
                console.log(newCandy.type);
                console.log(newCandy.variant);
            }
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

    let sfx;
    let line;
    // let specialSfx = adjustVolume(???.cloneNode(true), ???);
    if (matches == 1) {
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
    }

    sfx.play();

    if (matches > 1) {
        line.play();
    }

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

bgmSlider.addEventListener("input", bgmVolume);
sfxSlider.addEventListener("input", sfxVolume);
voiceSlider.addEventListener("input", voiceVolume);

let bgmSavedVolume = 100;
let sfxSavedVolume = 100;
let voiceSavedVolume = 100;

function bgmVolume() {
    volumeControl(bgmSlider, bgmBar, bgmValue, bgmSpeaker);
    bgmSavedVolume = bgmSlider.value;
    setVolume(bgm, bgmSavedVolume);
}

function sfxVolume() {
    volumeControl(sfxSlider, sfxBar, sfxValue, sfxSpeaker);
    sfxSavedVolume = sfxSlider.value;
    setArrayVolume(combo_sfx, sfxSavedVolume);
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
voiceSpeaker.addEventListener("click", voiceMute);

function bgmMute() {
    setMute(bgmSlider, bgmBar, bgmValue, bgmSpeaker, bgmSavedVolume);
    setVolume(bgm, bgmSlider.value);
}

function sfxMute() {
    setMute(sfxSlider, sfxBar, sfxValue, sfxSpeaker, sfxSavedVolume);
    setArrayVolume(combo_sfx, sfxSlider.value);
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

// autoplays music
/*function playMusic() {
    if (isPlaying) {
        console.log("mute");
        audioButton.src = "./public/images/ui/SpeakerMute.png";
        music.muted = true;
    } else {
        console.log("sound on");
        audioButton.src = "./public/images/ui/SpeakerOn.png";
        music.muted = false;
    }

    isPlaying = !isPlaying;
}*/