var PLAY = 1;
var END = 0;
var gameState = PLAY;

var score = 0;

var gameOver, restart, gameOverImg, restartImg;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var score = 0;
var cloudsGroup, cloudImage;
var obstaclesGroup, obs1,obs2,obs3,obs4,obs5,obs6;

function preload(){
  trex_running   = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  obs1=loadImage("obstacle1.png");
  obs2=loadImage("obstacle2.png");
  obs3=loadImage("obstacle3.png");
  obs4=loadImage("obstacle4.png");
  obs5=loadImage("obstacle5.png");
  obs6=loadImage("obstacle6.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(600, 200);
  
  trex = createSprite(50,180,20,50);
  trex.addAnimation("running",trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width/2;
  ground.velocityX = -2;
  
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  restart.visible = false;
}

function draw() {
  background(180);
  
  //score board
  
  text("Score: "+ score, 450,50);
  
  if(gameState === PLAY){
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
    
    if(keyDown("space")){
      trex.velocityY = -10;
    }
  
    trex.velocityY = trex.velocityY + 0.8;
  
    if(ground.x < 0){
     ground.x = ground.width/2;
    }
    
    trex.collide(invisibleGround);
  
    spawnClouds();
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
       gameState = END;
    }
    
  }//PLAY end
  
  //for game state = END use else if below
  else if(gameState === END){
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    trex.changeAnimation("collided",trex_collided);
    
    obstaclesGroup.setLifetimeEach(0);
    cloudsGroup.setLifetimeEach(0);
    
    gameOver.visible = true;
    restart.visible = true;
  }
  
  //restart the game
  if(mousePressedOver(restart)){
     reset();
  }
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 60 === 0) {
    var obstacle = createSprite(600,165,10,40);
    obstacle.velocityX = -4;
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    
    switch(rand){
      case 1: obstacle.addImage(obs1);
        break;
      case 2: obstacle.addImage(obs2);
        break;
      case 3: obstacle.addImage(obs3);
        break;
      case 4: obstacle.addImage(obs4);
        break;
      case 5: obstacle.addImage(obs5);
        break;
      case 6: obstacle.addImage(obs6);
        break;
        default:break;
    }
        
    //assign scale and lifetime to the obstacle       
    obstacle.scale = 0.4;
    obstacle.lifetime = 300;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}


function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
}