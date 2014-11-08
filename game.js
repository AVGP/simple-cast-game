var canvas = document.querySelector("canvas"),
    width  = window.innerWidth,
    height = window.innerHeight;

canvas.width  = 500; //width;
canvas.height = 500; //height;
var ctx = canvas.getContext("2d");

var playerX = 0, lives = 3, score = 0,
    invaderX = Math.round(Math.random()) * width - 120, invaderY = 0;

// Load the sprite...
var invaderImg = new Image();
invaderImg.onload = function() {
  console.log("Loaded")
};
invaderImg.src = "invader.png";

// Render loop
function drawFrame() {
  ctx.fillStyle = "#000000";
  ctx.fillRect(0,0, width, height);
  ctx.fillStyle = "#00aa00";
  ctx.fillRect(playerX, height-60, 120, 60);
  ctx.drawImage(invaderImg, invaderX, invaderY, 120, 120);
  requestAnimationFrame(drawFrame);
  invaderY++;
  if(invaderY >= height - 120) {
    if(playerX + 120 >= invaderX && playerX <= invaderX + 120) {
      score++;
    } else {
      lifes--;
    }
    var lifeText = "";
    for(var i=0;i<lifes;i++) lifeText += "❤";
    document.getElementById("status").textContent = "Score: " + score + " Lifes: " + lifeText;
  }
}

function initReceiver() {
  window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  var messageBus = window.castReceiverManager.getCastMessageBus('urn:x-cast:de.geekonaut.gameexperiment');

  messageBus.onMessage = function(message) {
    console.log(message);
    switch(message.data.code) {
      case 37:
        playerX -= 10;
        break;
      case 39:
        playerX += 10;
        break;
    }
  };

  var appConfig = new cast.receiver.CastReceiverManager.Config();

  appConfig.statusText = 'Ready to play';
  appConfig.maxInactivity = 6000;

  window.castReceiverManager.start(appConfig);

  window.castReceiverManager.onReady = function(event) {
    console.log('Received Ready event: ' + JSON.stringify(event.data));
    window.castReceiverManager.setApplicationState("Application status is ready...");

//    drawFrame();

  };

  window.castReceiverManager.onSenderConnected = function(event) {
    console.log('Received Sender Connected event: ' + event.data);
    console.log(window.castReceiverManager.getSender(event.data).userAgent);

    canvas.className = "game";
    canvas.width  = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");

    drawFrame();
  };

}

window.onload = function() {
  initReceiver();
  initPeerSession();
};
