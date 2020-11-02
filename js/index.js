const btnStart = document.getElementById("start-button");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const backgroundImg = new Image();
backgroundImg.src = "./images/background.png";

const playerImgRun = new Image();
playerImgRun.src = "./images/run1.png";

const imageBat = new Image();
imageBat.src = "./images/Bat2.png";

const imageGhost = new Image();
imageGhost.src = "./images/Ghost4.png";

const imagePumpkinhead = new Image();
imagePumpkinhead.src = "./images/pumpkinhead4.png";

const imageVampire = new Image();
imageVampire.src = "./images/vampire4.png";

const imageWerewolf = new Image();
imageWerewolf.src = "./images/werewolf4.png";

const imageWitch = new Image();
imageWitch.src = "./images/witch4.png";

const gameSound = new Audio();
gameSound.src = "./sounds/backgroundSound.wav";
gameSound.volume = 0.5;

class Obstacle {
  constructor(x, y, width, height, image) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
    this.speedX = 0;
    this.speedY = 0;
  }

  move() {
    this.x += this.speed;
    this.speedY += this.speedY;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
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
  constructor(backgroundImg, playerImgRun, canvas, ctx) {
    this.playerImgRun = playerImgRun;
    this.backgroundImg = backgroundImg;
    this.backPosition = 0;
    this.speedX = -1;
    this.speedY = 0;
    this.animationId = 0;
    this.leftLimit = 0;
    this.rightLimit = 0;
    this.obstacles = [];
    this.frames = 0;
    this.score = 0;
    this.canvas = canvas;
    this.ctx = ctx;
    this.backgroundX = 0;
  }

  background() {
    this.backgroundX += this.speedX;
    this.backgroundX %= this.canvas.width;
  }

  updateObstacles() {
    this.frames++;
    this.obstacles.map((obstacle) => {
      obstacle.x--;
      obstacle.update(this.ctx);
    });

    if (this.frames % 130 === 0) {
      let minHeight = 20;
      let maxHeight = 50;
      let height = Math.floor(
        Math.random() * (maxHeight - minHeight + 1) + minHeight
      );
    }
  }

  updateGame = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.backgroundImg.move();
    this.backgroundImg.draw();

    this.playerImgRun.move();
    this.playerImgRun.draw();

    this.animationId = requestAnimationFrame(this.updateGame);
  };

  updateScore() {
    if (this.frames % 30 === 0) {
      this.score++;
    }
    this.ctx.fillStyle = "white";
    this.ctx.font = "20px Arial";
    this.ctx.fillText(`Score: ${this.score}`, canvas.width - 30, 50);
  }

  checkGameOver() {
    const crashed = game.obstacles.some((obstacle) => {
      return game.playerImgRun.isCrashedWith(obstacle);
    });
    if (crashed) {
      cancelAnimationFrame(this.animationId);
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "black";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = "red";
      this.ctx.font = "80px Arial";
      this.ctx.fillText(`Game Over`, 50, 250);
      this.ctx.font = "25px Arial";
      this.ctx.fillText(`Your score: ${this.score}`, 100, 200);
    }
  }
}

class Background {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speed = -1;
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
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
  }

  move() {
    this.x += this.speedX;
    this.x %= this.width;
    this.y += this.speedY;
  }

  draw() {
    ctx.drawImage(playerImgRun, this.x, this.y, this.width, this.height);
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
      this.top() > obstacle.bottom() ||
      this.right() < obstacle.left() ||
      this.left() > obstacle.right()
    );

    return condition;
  }
}

window.addEventListener("load", () => {
  function startGame() {
    btnStart.parentElement.style.display = "none";
    canvas.style.display = "block";
    const game = new Game(
      new Background(0, 0, canvas.width, canvas.height),
      new Player(canvas.width - 630, canvas.height - 80, 100, 100)
    );

    game.updateGame();

    // document.addEventListener("keydown", (event) => {
    //   if (event.key === "Spacecharacter") {
    //     game.player. = 180;
    //   }
    // });

    // document.addEventListener("keyup", () => {
    //   game.player.height = 0;
    // });
  }
  btnStart.addEventListener("click", startGame);
});
