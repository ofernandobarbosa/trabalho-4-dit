//board
let board;
let boardWidth = window.innerWidth;
let boardHeight = window.innerHeight;
let context;

//dev

let devRightImg = new Image();
devRightImg.src = "./assets/images/dev-right.png";
let devLeftImg = new Image();
devLeftImg.src = "./assets/images/dev-left.png"
let devHeight = boardHeight * 0.1;
let devWidth = devHeight * (devRightImg.width / devRightImg.height);
let devX = boardWidth / 2 - devWidth / 2;
let devY = boardHeight * 7 / 8 - devHeight;

let dev = {
    img : null,
    x : devX,
    y : devY,
    width : devWidth,
    height : devHeight
}

//physics
let velocityX = 0; 
let velocityY = 0; //dev jump speed
let initialVelocityY = - 6; //starting velocity Y
let gravity = 0.15;

//platforms
let platformArray = [];
let platformWidth = boardHeight *0.09;
let platformHeight = platformWidth * 0.5;
let platformImg;
let platformQty = boardHeight / 200;

let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board

    //load images
    devRightImg.src = "./assets/images/dev-right.png";
    dev.img = devRightImg;
    devRightImg.onload = function() {
        context.drawImage(dev.img, dev.x, dev.y, dev.width, dev.height);
    }

    platformImg = new Image();
    platformImg.src = "./assets/images/platform.png";

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("touchstart", moveDev);
    document.addEventListener("touchend", stopDev);
    document.addEventListener("keydown", moveDev);
    document.addEventListener("keyup", stopDev);
    
    

}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //dev
    dev.x += velocityX;
    if (dev.x > boardWidth) {
        dev.x = 0;
    }
    else if (dev.x + dev.width < 0) {
        dev.x = boardWidth;
    }

    velocityY += gravity;
    dev.y += velocityY;
    if (dev.y > board.height) {
        gameOver = true;
    }
    context.drawImage(dev.img, dev.x, dev.y, dev.width, dev.height);

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && dev.y < boardHeight * 3/ 4) {
            platform.y -= initialVelocityY;
        }
        if (detectCollision(dev, platform) && velocityY >= 0) {
            velocityY = initialVelocityY; 
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }


    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift();
        newPlatform(); 
    }

    //score
    updateScore();
    context.fillStyle = "black";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);

    if (gameOver) {
        context.fillText("Click na tela para reiniciar o jogo.", boardWidth/5, boardHeight*7/8);
    }
}

function stopDev(e){
    if (e.target.id == "touchRight" || e.code == "ArrowRight" || e.code == "KeyD") { //move right
        velocityX = 0;
        dev.img = devRightImg;
    }
    else if (e.target.id == "touchLeft" || e.code == "ArrowLeft" || e.code == "KeyA") { //move left
        velocityX = 0;
        dev.img = devLeftImg;
    }

}

function moveDev(e) {
     if ((e.target.id == "touchRight" || e.target.id == "touchLeft") && gameOver) {
        //reset
        dev = {
            img: devRightImg,
            x: devX,
            y: devY,
            width: devWidth,
            height: devHeight
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
    }
    else if (e.target.id == "touchRight" || e.code == "ArrowRight" || e.code == "KeyD") { //move right
        velocityX = 2;
        dev.img = devRightImg;
    }
    else if (e.target.id == "touchLeft" || e.code == "ArrowLeft" || e.code == "KeyA") { //move left
        velocityX = -2;
        dev.img = devLeftImg;
    }

}

function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 300,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);

    for (let i = 0; i < platformQty; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 200*i - 300,
            width : platformWidth,
            height : platformHeight
        }
    
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth*5/8); //(0-1) * boardWidth*3/4
    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width/2 > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height/2 > b.y;    //a's bottom left corner passes b's top left corner
}

function updateScore() {
    let points = Math.floor(50*Math.random()); //(0-1) *50 --> (0-50)
    if (velocityY < 0) { //negative going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}