let firstMessage; 
let itemMessage; 
let currentMessage; 
let messageBoxImage; 
let glauciaSpriteNeutral; 
let glauciaSpriteSad; 
let bgImage; 
let coffeeImage; 
let music; 
let img;
let img2; 

var cnv;
let toggleFullscreenButton; 

function centerCanvas() {
  var x = (windowWidth - width) / 2;
  var y = (windowHeight - height) / 2;
  cnv.position(x, y);
   if (toggleFullscreenButton) {
    toggleFullscreenButton.position(cnv.x + width - 150, cnv.y + 20);
  }
}

let gameState = {
  gameEnd: false, 
  coffee: false, 
 
};

function preload()
{
  messageBoxImage = loadImage('messageBox.png');
  glauciaSpriteNeutral = loadImage("GlauciaNeutral.png");
  glauciaSpriteSad =  loadImage("GlauciaSad.png");
  glauciaSpriteHappy = loadImage("GlauciaHappy.png");
  bgImage = loadImage("Background.png");
  coffeeImage = loadImage("coffee.png");
  music = loadSound('glauciaChill.mp4');	
    img = createImg('ButtonImg.png', 'Fullscreen Button');  
  img2 = createImg('ButtonImg2.png', 'Fullscreen Button'); 
  img.hide(); 
  img2.hide(); 
} 
function windowResized() {
  centerCanvas();
  
}
function setup() {
  
 
  
    cnv = createCanvas(1280 ,800);     

  centerCanvas();
  toggleFullscreenButton = createButton('');
   img.show(); 
  toggleFullscreenButton.child(img); 
  toggleFullscreenButton.position(cnv.x + width - 150, cnv.y + 20); // Upper-right corner with a margin
  toggleFullscreenButton.mousePressed(toggleFullscreen);
  background(255, 0, 200);
  
  gameEnd = false; 
 // music.loop();
  
  let badMessage = new message("Oh I'm sorry..I don't think there's anything I can do to help with that.", [], null ,glauciaSpriteSad );
  
  let firstChoiceArray = [];

  let goodMessage = new message("I'm happy to hear that.", [], null, glauciaSpriteHappy,0);
  let firstChoice = new choice("Good", goodMessage);
  let secondChoice = new choice("Bad", badMessage);
  let secondChoiceArray = [firstChoice, secondChoice]; 
  let secondMessage = new message("How are you feeling?",secondChoiceArray, null, glauciaSpriteNeutral);
  firstMessage = new message("Hello", firstChoiceArray, secondMessage, glauciaSpriteNeutral); 
  currentMessage = firstMessage; 

  // Set text properties
  textSize(24);
  textAlign(LEFT, TOP);
}


function draw() {
  background(220);
 
  currentMessage.display(); 
   if(gameState[0] == true){
     restart(); 
     currentMessage.display(); 
   }
  
  if(gameState[1] == true){
     image(coffeeImage, 0, 0);
  }
  
}
function restart(){
  currentMessage = firstMessage; 
  gameState[0] = false;
  gameState[1] = false; 
}
function startMusic() {

  // Play music if it's not already playing
  if (!music.isPlaying()) {
    music.loop();
    console.log('Music started playing.');
  }
}
function mouseClicked() {

    let audioCtx = getAudioContext();
  if (audioCtx.state !== 'running') {
    audioCtx.resume().then(() => {
      console.log('Audio context resumed successfully.');
      startMusic();
    }).catch(err => {
      console.error('Error resuming audio context:', err);
    });
  } else {
    startMusic();
  }
  
  
  
  if(currentMessage.nextMessage != null){
      currentMessage = currentMessage.nextMessage; 

  }
  if(currentMessage.choiceArray != null){
    if(currentMessage.choiceArray.length > 0 ){

      for (let i = 0; i < currentMessage.choiceArray.length; i++) {
      let rectValues = currentMessage.choiceArray[i].getRect(); 
      if ( mouseX >  rectValues[0]  && mouseX <  rectValues[0] + rectValues[2] &&
          mouseY >  rectValues[1] && mouseY < rectValues[1]  + rectValues[3] ) {
   
          currentMessage.choiceArray[i].onClick();
        } 
      }
    }
  }


}
function toggleFullscreen() {
  let fs = fullscreen(); // Check current fullscreen state
  fullscreen(!fs); // Toggle fullscreen state
 
   if (fs) {
     img.show(); 
     img2.hide(); 
    toggleFullscreenButton.child(img);  // Set the image for exiting fullscreen
  } else {
    img2.show(); 
    img.hide(); 
    toggleFullscreenButton.child(img2); // Set the image for entering fullscreen
  }
}
class message{
  
  constructor(messageText, choiceArray, nextMessage, imageVar, varIndex ){
    this.messageText = messageText; 
    this.choiceArray = choiceArray; 
    this.nextMessage = nextMessage; 
    this.imageVar = imageVar; 
    this.varIndex = varIndex; 
    
  }
  display(){
    //set Var 
    if(gameState != null){
    
      gameState[this.varIndex] = true; 

      //print(this.variableChange);
    }
    
    //drawbg 
    image(bgImage, 0, 0);
    //draw image sprite 
    if(this.imageVar != null){
          image(this.imageVar, 0, 0);

    }
    //draw message box 
    image(messageBoxImage, 0, 0);
    //display the choices
    if(this.choiceArray != null){
      if (this.choiceArray.length > 0) {
          for (let i = 0; i < this.choiceArray.length; i++) {
             this.choiceArray[i].setYPosition(330 + i * 30); 
            this.choiceArray[i].display(); 
          }
        }
    }
    
    //display the message 
    fill(255);
    stroke(0);
    strokeWeight(4);
    text(this.messageText,40,300, 340, 100);
    
    
  }
 
}
class choice{
  constructor(choiceText, nextMessage){
    this.choiceText = choiceText; 
    this.nextMessage = nextMessage; 
    this.yPosition = 0; 
    this.xPosition = 40; 
  }
  setYPosition(inputYPosition){
    this.yPosition = inputYPosition; 
  }
  display(){
    //cant define the height and width in the construction as it changes 
    let foundTextWidth = textWidth(this.choiceText);
    let textHeight = textAscent() + textDescent();
    
    fill(184,159,121);
    stroke(89,60,16);
    rect(this.xPosition, this.yPosition, foundTextWidth, textHeight);
    stroke(0);
    fill(255);
    text(this.choiceText,this.xPosition , this.yPosition); 
    
  }
  onClick(){
    //check if the user clicks on the rect 
    currentMessage = this.nextMessage; 
    
  }
  getRect(){
    //this should return the rectangle of the text 
    let foundTextWidth = textWidth(this.choiceText);
    let textHeight = textAscent() + textDescent();
    let rectInfo = [this.xPosition, this.yPosition, foundTextWidth, textHeight]; 
    return rectInfo; 
    
  }

}
