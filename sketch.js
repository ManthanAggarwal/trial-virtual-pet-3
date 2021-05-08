//Create variables here
var dog, happyDog, database, foodS, foodStock;
var dogImg1;
var dogImg2;
var foodObj;
var fedTime, lastFed;
var feed;
var addFood;
var gameState, readgameState;
var gardenImg, washroomImg, bedroomImg;


function preload()
{
	dogImg1 = loadImage("images/dogImg.png");
  dogImg2 = loadImage("images/dogImg1.png");
  gardenImg = loadImage("images/Garden.png");
  washroomImg = loadImage("images/Wash Room.png");
  bedroomImg = loadImage("images/Bed Room.png");
}

function setup() {
	createCanvas(500,500);
  database = firebase.database();
  foodObj = new Food();
  dog = createSprite(250,300,150,150);
  dog.addImage(dogImg1);
  dog.scale= 0.15

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);

  fedTime = database.ref('feedTime')
fedTime.on("value", function(data){
  lastFed = data.val()
})

  feed = createButton("feed dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  //reading gamestaet from database
  readgameState = database.ref('gameState');
  readgameState.on("value", function(data){
    gameState = data.val()
  })
}


function draw() {  
currentTime = hour();


if (currentTime == (lastFed+1)){
update("playing")
foodObj.garden()
}

else if(currentTime == (lastFed+2)){
  update("sleeping")
  foodObj.bedroom()
}
else if(currentTime>(lastFed+2)&& currentTime<=(lastFed+4)){
  update("bathing")
  foodObj.washroom();
}
else{
  update("hungry")
  foodObj.display();
}


if(gameState != "hungry"){
  feed.hide();
  addFood.hide();
  dog.remove();
}
else{
  feed.show()
  addFood.show();
  dog.addImage(dogImg1);
  
}


  drawSprites();
}

function readStock(data){
foodS = data.val()
foodObj.updateFoodStock(foodS);
};
 
// function writeStock(x){
//   if(x <= 0){
//     x= 0 
//   }
//   else{
//     x= x-1
//   }
//   database.ref('/').update({
//     Food:x
//   })
// }

function addFoods(){

  foodS++;
  database.ref('/').update({
    Food:foodS
  })

}

function feedDog(){
  dog.addImage(dogImg2);
  
    foodObj.updateFoodStock(foodObj.getFoodStock()-1)  
  
  database.ref('/').update({
Food:foodObj.getFoodStock(),
feedTime:hour(),
gameState:"hungry"
  })
  function update(state){

    database.ref('/').update({
      gameState:state
    })
  }

}


