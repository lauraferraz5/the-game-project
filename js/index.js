const btnStart = document.getElementById("start-button");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const backgroundImg = new Image();
backgroundImg.src = "./images/background.png";

const playerImgRun1 = new Image();
playerImgRun1.src = "./images/run1.png";
const playerImgRun2 = new Image();
playerImgRun2.src = "./images/run2.png";
const playerImgRun3 = new Image();
playerImgRun3.src = "./images/run3.png";
const playerImgRun4 = new Image();
playerImgRun4.src = "./images/run4.png";
const playerImgRun5 = new Image();
playerImgRun5.src = "./images/run5.png";
const playerImgRun6 = new Image();
playerImgRun6.src = "./images/run6.png";
const playerImgRun7 = new Image();
playerImgRun7.src = "./images/run7.png";
const playerImgRun8 = new Image();
playerImgRun8.src = "./images/run8.png";

const playerJump1 = new Image();
playerJump1.src = "./images/jump1.png";
const playerJump2 = new Image();
playerJump2.src = "./images/jump2.png";
const playerJump3 = new Image();
playerJump3.src = "./images/jump3.png";

const pumpkinImg = new Image();
pumpkinImg.src = "./images/pumpkin.png";

const gameSound = new Audio();
gameSound.src = "./sounds/backgroundSound.wav";
gameSound.volume = 0.5;

const jumpSound = new Audio();
jumpSound.src = "./sounds/jumpSound.wav";
jumpSound.volume = 0.5;

let createdObstacles = [];

let frames = 0;

let spriteCount = 0;

let jumpCount = 0;

let score = 0;

let gaming = false;

function createObstacles() {
  frames += 1;
  let random = Math.floor(Math.random() * 4) + 1;
  if (frames % (random * 100) === 0) {
    createdObstacles.push(
      new Obstacle(canvas.width, canvas.height - 66, 40, 40)
    );
  }
}

function moveObstacles() {
  for (let i = 0; i < createdObstacles.length; i++) {
    createdObstacles[i].draw();
    createdObstacles[i].move();
  }
}

class Obstacle {
  constructor(x, y, width, height, obstacles) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.obstacles = pumpkinImg;
    this.speedX = 0;
    this.speedY = 0;
  }

  move() {
    this.speedX = -5;
    this.x += this.speedX;
  }

  draw() {
    ctx.drawImage(this.obstacles, this.x, this.y, this.width, this.height);
  }

  left() {
    return this.x;
  }

  right() {
    return this.x + this.width;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.height;
  }
}

class Game {
  constructor(backgroundImg, playerImgRun1, canvas, ctx) {
    this.playerImgRun1 = playerImgRun1;
    this.backgroundImg = backgroundImg;
    this.backPosition = 0;
    this.speedX = -1;
    this.speedY = 0;
    this.animationId = 0;
    this.leftLimit = 0;
    this.rightLimit = 0;
    this.canvas = canvas;
    this.ctx = ctx;
    this.backgroundX = 0;
  }

  background() {
    this.backgroundX += this.speedX;
    this.backgroundX %= this.canvas.width;
  }

  updateGame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.backgroundImg.move();
    this.backgroundImg.draw();

    this.playerImgRun1.gravity();

    this.playerImgRun1.move();
    this.playerImgRun1.draw();

    createObstacles();
    moveObstacles();

    this.updateScore(this.score);

    this.animationId = requestAnimationFrame(this.updateGame);

    this.checkGameOver();
  };

  updateScore() {
    if (this.animationId % 10 === 0) {
      score += 1;
    }
    this.ctx.fillStyle = "white";
    this.ctx.font = "20px Arial";
    this.ctx.fillText(`Score: ${score}`, canvas.width - 120, 50);
  }

  checkGameOver() {
    const crashed = createdObstacles.some((obstacle) => {
      return this.playerImgRun1.isCrashedWith(obstacle);
    });
    if (crashed) {
      cancelAnimationFrame(this.animationId);
      gameSound.pause();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "red";
      this.ctx.font = "100px Arial";
      this.ctx.fillText(`Game Over`, 120, 200);
      this.ctx.fillStyle = "white";
      this.ctx.font = "40px Arial";
      this.ctx.fillText(`Your score: ${score}`, 220, 280);
    }
  }
}

class Background {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = -2;
    this.backgroundImg = backgroundImg;
  }

  move() {
    this.x += this.speed;
    this.x %= this.width;
  }

  draw() {
    ctx.drawImage(this.backgroundImg, this.x, 0, this.width, this.height);
    if (this.speed < 0) {
      ctx.drawImage(
        this.backgroundImg,
        this.x + this.width,
        0,
        this.width,
        this.height
      );
    } else {
      ctx.drawImage(
        this.backgroundImg,
        this.x - this.width,
        0,
        this.width,
        this.height
      );
    }
  }
}

class Player {
  constructor(x, y, width, height, spriteCount) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.spriteCount = 0;
    this.jumping = false;
  }

  move() {
    this.x += this.speedX;
  }

  draw() {
    if (this.jumping === true) {
      if (this.spriteCount < 2) {
        ctx.drawImage(playerJump1, this.x, this.y, this.width, this.height);
        this.spriteCount += 1;
      } else if (this.spriteCount < 16) {
        ctx.drawImage(playerJump2, this.x, this.y, this.width, this.height);
        this.spriteCount += 1;
      } else if (this.spriteCount < 30) {
        ctx.drawImage(playerJump3, this.x, this.y, this.width, this.height);
        this.spriteCount += 1;
      } else {
        ctx.drawImage(playerJump1, this.x, this.y, this.width, this.height);
        this.spriteCount = 0;
      }
    } else {
      if (this.spriteCount < 2) {
        ctx.drawImage(playerImgRun1, this.x, this.y, this.width, this.height);
        this.spriteCount += 1;
      } else if (this.spriteCount < 4) {
        ctx.drawImage(playerImgRun2, this.x, this.y, this.width, this.height);
        this.spriteCount += 1;
      } else if (this.spriteCount < 6) {
        ctx.drawImage(playerImgRun3, this.x, this.y, this.width, this.height);
        this.spriteCount += 1;
      } else if (this.spriteCount < 8) {
        ctx.drawImage(playerImgRun4, this.x, this.y, this.width, this.height);
        this.spriteCount += 1;
      } else if (this.spriteCount < 10) {
        ctx.drawImage(playerImgRun5, this.x, this.y, this.width, this.height);
        this.spriteCount += 1;
      } else if (this.spriteCount < 12) {
        ctx.drawImage(playerImgRun6, this.x, this.y, this.width, this.height);
        this.spriteCount += 1;
      } else if (this.spriteCount < 14) {
        ctx.drawImage(playerImgRun7, this.x, this.y, this.width, this.height);
        this.spriteCount += 1;
      } else if (this.spriteCount < 16) {
        ctx.drawImage(playerImgRun8, this.x, this.y, this.width, this.height);
        this.spriteCount += 1;
      } else {
        ctx.drawImage(playerImgRun1, this.x, this.y, this.width, this.height);
        this.spriteCount = 0;
      }
    }
  }

  gravity() {
    this.speedY += 0.3;
    this.y += this.speedY;
    this.speedY *= 0.9;

    if (this.y > canvas.height - 120) {
      this.y = canvas.height - 120;
      this.speedY = 0;
      jumpCount = 2;
      this.jumping = false;
    }
  }

  jump(value) {
    this.speedY -= value;
    this.jumping = true;
  }

  left() {
    return this.x;
  }

  right() {
    return this.x + this.width;
  }

  top() {
    return this.y;
  }

  bottom() {
    return this.y + this.height;
  }

  isCrashedWith(obstacle) {
    const condition = !(
      this.bottom() < obstacle.top() ||
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );

    return condition;
  }
}

window.addEventListener("load", () => {
  function startGame() {
    gaming = true;
    createdObstacles = [];
    frames = 0;
    spriteCount = 0;
    jumpCount = 0;
    score = 0;
    const game = new Game(
      new Background(0, 0, canvas.width, canvas.height),
      new Player(canvas.width - 630, canvas.height - 120, 70, 100),
      canvas,
      ctx
    );

    gameSound.play();

    game.updateGame();

    document.addEventListener("keydown", (event) => {
      if (jumpCount <= 2 && jumpCount > 0) {
        console.log("oi");
        if (event.key === "w") {
          game.playerImgRun1.jump(18);
          jumpCount--;
          jumpSound.play();
        }
      }
    });
  }

  btnStart.addEventListener("click", () => {
    if (gaming === false) {
      startGame();
      btnStart.blur(); // blur tira o foco do botão start
    } else {
      window.location.reload();
      console.log("kkk");
    }
  });
});
