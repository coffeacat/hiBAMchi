// select all elements
// const score = document.getElementById("scoreContainer");
const music = document.getElementById("track");
const audio = document.getElementById("audioButton")
const audioButton = document.getElementById("audioImage")

window.onload = function() {
    startGame();

    window.setInterval(function() {
        crushCandy();
        dropCandy();
        generateCandy();
    }, 100 // every 100ms, will call/check for crushCandy();
    )
}

class Tile {
    constructor(name, year) {
        this.type = name;
        this.variant = year;
        this.sprite = sprite
    }
}

// create our candy types
let candies = [
    {
	    type: "1",
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "../public/images/candy_extras/Peachy_Peach_PMTTYDNS_icon.png"
	},{
		type: "2",
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "../public/images/candy_2/Jammin_Jelly_PMTTYDNS_icon.png"
	},{
		type: "3",
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "../public/images/candy_3/Turtley_Leaf_PMTTYDNS_icon.png"
	},{
		type: "4",
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "../public/images/candy_4/Fire_Flower_PMTTYDNS_icon.png"
	},{
	    type: "5",
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "../public/images/candy_5/Ice_Storm_PMTTYDNS_icon.png"
	},{
		type: "6",
		variant: "normal", // horizontal 4, vertical 4, bomb, full clear
		sprite: "../public/images/candy_6/Sleepy_Sheep_PMTTYDNS_icon.png"
	}
];

let blankTile = {
	type: "7",
	variant: "blank", // horizontal 4, vertical 4, bomb, full clear
	sprite: "../public/images/blank.png"
};

let sfx = new Audio("../public/audio/Explosion.wav");

// create some variables
var board = [];
var rows = 10;
var columns = 10;
var score = 0;

var currTile;
var otherTile;
var isPlaying = false;

// when window loads
function startGame() {
    for (let r = 0; r < rows; r++) {
		let row = [];
		for (let c = 0; c < columns; c++) {
			let tile = document.createElement("img");
			tile.id = r.toString() + "-" + c.toString();
			var currentCandy = randomCandy();
			tile.src = currentCandy.sprite;

			// DRAG FUNCTIONALITY
			// tile.addEventListener("drag")
            tile.addEventListener("dragstart", dragStart); // click on a candy, initialize drag process
			tile.addEventListener("dragover", dragOver); // clicking on a candy, moving mouse to drag the candy
			tile.addEventListener("dragenter", dragEnter); // dragging candy onto another candy
			tile.addEventListener("dragleave", dragLeave); // leave candy over another candy
		    tile.addEventListener("drop", dragDrop); // drops the candy over another candy
			tile.addEventListener("dragend", dragEnd); // after drag process is completed, swap candies if valid move

			document.getElementById('board').appendChild(tile);
			row.push(tile);
		}
		board.push(row);
	}
	console.log(board);
}

// selects a random candy
function randomCandy() {
	return candies[Math.floor(Math.random() * candies.length)];
}

function dragStart() {
    // this refers to the candy that was selected for the drag process
    currTile = this;
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
    otherTile = this;
}

function dragEnd() {

    // cannot swap anything with blank tiles
      if (currTile.src.includes(blankTile.sprite.substring(2))
        || otherTile.src.includes(blankTile.sprite.substring(2))) {
        return;
    }

    let currCoords = currTile.id.split("-"); // id="0-0" -> ["0", "0"]
        let r1 = parseInt(currCoords[0]);
        let c1 = parseInt(currCoords[1]);
    
    let otherCoords = otherTile.id.split("-"); // id="0-0" -> ["0", "0"]
        let r2 = parseInt(otherCoords[0]);
        let c2 = parseInt(otherCoords[1]);
    
    let moveLeft = r1 == r2 && c1-1 == c2;
    let moveRight = r1 == r2 && c1+1 == c2;
    let moveUp = r1-1 == r2 && c1 == c2;
    let moveDown = r1+1 == r2 && c1 == c2;

    let isAdjacent = moveLeft || moveRight || moveUp || moveDown;

    // only swap adjacent candies
    if (isAdjacent) {
        // swap images
        let temp = otherTile.src;
        otherTile.src = currTile.src;
        currTile.src = temp;

        // check if move is valid (aka creates a match)
        let isValid = checkValid();
        if (!isValid) {
            // if not, swaps the images back
            let temp = otherTile.src;
            otherTile.src = currTile.src;
            currTile.src = temp;
        }
    }
}

function crushCandy() {
    crushThree();
    // crushFour();
    // crushFive();
}

// how to account for special candies?
function crushThree() {
    // let potentialMatches = 0;

    // check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src &&
                !candy1.src.includes(blankTile.sprite.substring(2))) {
                // checkBomb();
                candy1.src = blankTile.sprite;
                candy2.src = blankTile.sprite;
                candy3.src = blankTile.sprite;
                sfx.play();
            }
        }
    }

    // check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src &&
                !candy1.src.includes(blankTile.sprite.substring(2))) {
                candy1.src = blankTile.sprite;
                candy2.src = blankTile.sprite;
                candy3.src = blankTile.sprite;
                sfx.play();
            }
        }
    }

}

function checkValid() {

    // check rows
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns-2; c++) {
            let candy1 = board[r][c];
            let candy2 = board[r][c+1];
            let candy3 = board[r][c+2];
            if (candy1.src == candy2.src && candy2.src == candy3.src &&
                !candy1.src.includes(blankTile.sprite.substring(2))) {
                return true;
            }
        }
    }

    // check columns
    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows-2; r++) {
            let candy1 = board[r][c];
            let candy2 = board[r+1][c];
            let candy3 = board[r+2][c];
            if (candy1.src == candy2.src && candy2.src == candy3.src &&
                !candy1.src.includes(blankTile.sprite.substring(2))) {
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
            if (!board[r][c].src.includes(blankTile.sprite.substring(2))) {
                // if tile is not blank, move to bottom of the board
                board[i][c].src = board[r][c].src;
                // change the bottom to be one candy above
                i -= 1;
            }
        }

        // fill the rest with blank spaces
        for (let r = i; r >= 0; r--) {
            board[r][c].src = blankTile.sprite;
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
            board[0][c].src = randomCandy().sprite;
        }
    }
}

audio.addEventListener("click",playMusic);

// autoplays music
function playMusic() {
    music.play();

    if (isPlaying) {
        console.log("mute");
        audioButton.src = "../public/images/SpeakerMute.png";
        music.muted = true;
    } else {
        console.log("sound on");
        audioButton.src = "../public/images/SpeakerOn.png";
        music.muted = false;
    }

    isPlaying = !isPlaying;
}