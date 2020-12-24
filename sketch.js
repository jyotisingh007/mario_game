var PLAY = 1;
var END = 0;
var gameState = PLAY;
var score;
var ground, groundImg, bgImg, bg, invisibleGround;
var mario_animation, mario;
var obstacle, obstacleImg;
var brick, brickImg;
var obstaclesGroup, bricksGroup;
var gameOver,restart,gameOverImg,restartImg;
var jumpSound , checkPointSound, dieSound;
var mario_collided;
var cloud, cloudsGroup;

function preload() {
  groundImg = loadImage("ground2.png");
  bgImg = loadImage("bg.png");
  mario_animation = loadAnimation("mario01.png", "mario02.png","mario03.png"); 

  obstacleImg = loadAnimation("obstacle1.png", "obstacle2.png", "obstacle3.png", "obstacle4.png")

  brickImg = loadImage("brick.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3");
  
  mario_collided= loadImage("collided.png");
  
  cloudImg= loadImage("cloud.png");
}

function setup() {
  createCanvas(600, 400);

  bg = createSprite(0, 0, 600, 600);
  bg.addImage("bg", bgImg);
  bg.scale = 2.5;

  ground = createSprite(300, 370, 600, 20);
  ground.addImage("ground", groundImg);
  ground.velocityX = -5;

  
  mario = createSprite(20, 270, 20, 20);
  mario.addAnimation("mario_anim", mario_animation);
  mario.addAnimation("collided", mario_collided);
  mario.debug= true;
  mario.scale=1.5;

  invisibleGround = createSprite(0, 340, 300, 20);
  invisibleGround.visible = false;

  obstaclesGroup = new Group();
  bricksGroup = new Group();
  cloudsGroup = new Group();
  score = 0;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
 
}

function draw() {
   background(180);
   
  
  if(gameState === PLAY)
  {
    gameOver.visible = false;
    restart.visible = false;
    mario.changeAnimation("mario_anim",mario_animation);
    
    ground.velocityX = -(4 + 3* score/100)
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0) {
    ground.x = ground.width / 2;
    }

    if (keyDown("space") && mario.y > 265) {
    mario.velocityY = -13;
      jumpSound.play();
      
    }

    mario.velocityY = mario.velocityY + 0.6;
  
    spawnObstacles();
    spawnBricks();
    
    for (var i=0; i<bricksGroup.length; i++){
     
      if (bricksGroup.get(i).isTouching(mario))         {
       bricksGroup.get(i).remove();
        score = score +1;
        
        }
      
    }  
    
    if(obstaclesGroup.isTouching(mario)){
      gameState = END;
      dieSound.play();
    }
  }
  
  else if(gameState === END)
  {
    gameOver.visible = true;
    restart.visible = true;
    restart.depth= brick.depth +1;
    
    ground.velocityX =0 ;
    mario.velocityX = 0;
    
    mario.changeAnimation("collided",mario_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    bricksGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    obstaclesGroup.setVelocityXEach(0);
    bricksGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
  }
  mario.collide(invisibleGround);
  drawSprites();
  
  textSize(18);
  textFont("Times New Roman");
  stroke("black")
  text("Score : "+ score, 500,50);
  if(mousePressedOver(restart)) {
      reset();
    }
  

}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    obstacle = createSprite(600, 315, 10, 10);
    obstacle.addAnimation("obstacleImage", obstacleImg);
    obstacle.velocityX = -4;
    
    obstacle.lifetime = 300;
    obstaclesGroup.add(obstacle);
    cloud = createSprite(600, Math.round(random(60,90)),10,10);
    cloud.addImage(cloudImg);
    cloud.velocityX=-5
    cloud.scale=0.5;
    cloud.lifetime =200;
    cloudsGroup.add(cloud);
    cloud.depth= gameOver.depth -1;
  }

}

function spawnBricks() {
  if (frameCount % 40 === 0) {
    brick = createSprite(600, Math.round(random(160, 200)), 10, 10);
    brick.velocityX = -4;
    brick.addImage(brickImg);
    
    brick.lifetime = 300;
    bricksGroup.add(brick);
  }

}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visivle = false;
  
  obstaclesGroup.destroyEach();
  bricksGroup.destroyEach();
  cloudsGroup.destroyEach();
  score = 0;
}