var bg, bgImg, nightImg
var bottomGround
var topGround
var balloon, balloonImg
var obstacleTop, obstacleBottom;
var obsTop1, obsTop2, obsBottom1, obsBottom2, obsBottom3;
var obsGroup, barGroup;
var gameOver, gameOverImg;
var restart, restartImg;
var jumpSound, dieSound;
var score = 0;
const PLAY = 1;
const END = 0;
var gameState = PLAY;

function preload(){
  nightImg = loadImage("assets/nightImg.png")
  bgImg = loadAnimation("assets/clouds1.png", "assets/clouds2.png", "assets/clouds3.png", "assets/clouds4.png", "assets/clouds5.png");
  balloonImg = loadAnimation("assets/balloon1.png","assets/balloon2.png","assets/balloon3.png");

  obsTop1 = loadImage("assets/obsTop1.png");
  obsTop2 = loadImage("assets/obsTop2.png");

  obsBottom1 = loadImage("assets/obsBottom1.png");
  obsBottom2 = loadImage("assets/obsBottom2.png");
  obsBottom3 = loadImage("assets/obsBottom3.png");

  gameOverImg = loadImage("assets/gameOver.png");
  restartImg = loadImage("assets/restart.png");

  jumpSound = loadSound("assets/jump.mp3");
  dieSound = loadSound("assets/die.mp3");

}

function setup(){

//background image
bg = createSprite(150, 200, 1, 1);         //(165,485,1,1);
getBackgroundImage();

//creating top and bottom grounds
bottomGround = createSprite(200,410,800,20);
bottomGround.visible = false;

topGround = createSprite(200,0,800,20);
topGround.visible = false;
      
//creating balloon     
balloon = createSprite(100,120,20,50);
balloon.addAnimation("balloon",balloonImg);
balloon.scale = 0.2;

obsGroup = new Group();
barGroup = new Group();

gameOver = createSprite(220, 200);
gameOver.addImage(gameOverImg);
gameOver.scale = 0.5;
gameOver.visible = false;
restart = createSprite(220, 240);
restart.addImage(restartImg);
restart.scale = 0.5;
restart.visible = false;

imageMode(CENTER);

}

function draw() {
//  createCanvas(600, 600);
  background("black");

  //making the hot air balloon jump
  if((keyDown("space") || keyDown("up") || keyDown("W") || mouseDown()) && !balloon.isTouching(topGround)) {
   balloon.velocityY = -6; 
    // jumpSound.play();
    // jumpSound.volume = 0.2;
  }

//  balloon.debug = true;
  balloon.setCollider("circle", 0, 0, 80)

  //adding gravity
  balloon.velocityY = balloon.velocityY + 2;

  if (balloon.collide(bottomGround)) {
    balloon.velocityY = 0;
  }

  if(obsGroup.isTouching(balloon)) {
    gameState = END;
    dieSound.play();
  }

  
  spawnObstaclesTop();
  spawnObstaclesBottom();
  bar();
  
    
  drawSprites();

  if (gameState === END) {
   gameOver.visible = true;
   gameOver.depth += 1;
   restart.visible = true;
   restart.depth == 1;

   balloon.velocityX = 0;
   balloon.velocityY = 0;
   obsGroup.setVelocityXEach(0);
   obsGroup.setLifetimeEach(-1);
   barGroup.setVelocityEach(0);
   barGroup.setLifetimeEach(0);

   balloon.y = 200;


   
   if (mousePressedOver(restart) || keyDown("space")) {
    reset();
   }
  }

  textSize(30);
  fill("red");
  textFont("algerian")
  text("Score: " + score, 250, 50);;

}

function bar() {
  if(World.frameCount % 60 === 0) {
    var bar = createSprite(400, 200, 10, 800);
    bar.velocityX = -6;
    bar.depth = balloon.depth;
    bar.lifetime = 70;
    bar.visible = false;
    barGroup.add(bar);
    score += 1;
  }
}

function spawnObstaclesTop() {
  if(World.frameCount % 45 === 0) {
    var randCheck = Math.round(random(1, 3))
    if (randCheck === 1) {
      obstacleTop = createSprite(400, 50, 40, 50);
      obstacleTop.scale = 0.1;
      obstacleTop.velocityX = -4;
      obstacleTop.y = Math.round(random(10, 100));
      var rand = Math.round(random(1, 2));
      switch (rand) {
        case 1: obstacleTop.addImage(obsTop1);
                break;
        case 2: obstacleTop.addImage(obsTop2);
                break;
        default: break;
      }
      obstacleTop.lifetime = 100;
      balloon.depth += 1;
      obsGroup.add(obstacleTop);
    }
  }
}

function spawnObstaclesBottom() {
  if(World.frameCount % 60 === 0) {
    var randCheck = Math.round(random(1, 2));
    if (randCheck === 1) {
      obstacleBottom = createSprite(400, 350, 40, 50);
      obstacleBottom.scale = 0.1;
      obstacleBottom.velocityX = -5;
      obstacleBottom.y = Math.round(random(300, 390));
      var rand = Math.round(random(1, 3));
      switch (rand) {
        case 1: obstacleBottom.addImage(obsBottom1);
                break;
        case 2: obstacleBottom.addImage(obsBottom2);
                break;
        case 3: obstacleBottom.addImage(obsBottom3);
                break;
        default: break;
      }
      obstacleBottom.lifetime = 100;
      balloon.depth += 1;
      obsGroup.add(obstacleBottom);
    }
  }
}

function animate (x) {
  x.speed = 0.2;
  // console.log("bg.speed " + bg.speed);
  // console.log("bgImg.speed " + bgImg.speed);
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obsGroup.destroyEach();
  score = 0;
}

async function getBackgroundImage() {
  var response = await fetch("http://worldtimeapi.org/api/timezone/Asia/Kolkata");
  var responseJSON = await response.json();
  var datetime = responseJSON.datetime;
  var hour = datetime.slice(11, 13);
  if (hour >= 06 && hour <= 19) {
    bg.addAnimation("clouds", bgImg);
    animate(bg);
    animate(bgImg);
    bg.scale = 0.9;
  }
  else {
    bg.addImage(nightImg);
    bg.scale = 1.5;
  }
}