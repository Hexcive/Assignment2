var canvas = document.getElementById('gameCanvas'),
canvasContext = canvas.getContext('2d'),
ballPositionX = canvas.width/2,
ballPositionY = canvas.height/2,
ballSize = 20,
ballVelocityX = 8,
ballVelocityY = 0,
fps = 60,
paddleWidth = 45,
paddleHeight = 45,
paddleOneY = 250,
paddleOneDirectionY = null,
paddleOneVelocityY = 16,
paddleTwoY = 250,
paddleTwoDirectionY = null,
paddleTwoVelocityY = 8,
playerOneScore = 0,
playerTwoScore = 0,
startMenu = document.getElementById('startMenu'),
pauseMenu = document.getElementById('pauseMenu'),
gameOverMenu = document.getElementById('gameOverMenu'),
gameplay = document.getElementById('gameplay'),
startBtn = document.getElementById('startBtn'),
continueBtn = document.getElementById('continueBtn'),
restartBtn = document.getElementById('restartBtn'),
againBtn = document.getElementById('againBtn'),
gameMessage = document.getElementById('gameMessage'),
gamePaused = false,
gameInProgress = false,
scoreToWin = 20,
difficultyLevel = 1,
gameInterval = window.setInterval(function() {});

canvas.width = window.innerWidth*0.6;
canvas.height = window.innerHeight*0.6;

playerScoredMessageRestingPos = canvas.height*13;
playerScoredMessagePosY = playerScoredMessageRestingPos;
playerScoredMessage = "Player Scored!"
computerScoredMessageRestingPos = canvas.height*9;
computerScoredMessagePosY = computerScoredMessageRestingPos;
computerScoredMessage = "Computer Scored!"

ballPositionY = canvas.height/2 - ballSize/2 
paddleOneY = canvas.height/2 - paddleHeight/2;
paddleTwoY = canvas.height/2 - paddleHeight/2;
const mapleLeaf = new Image();
mapleLeaf.src = "./images/maple-leaf-vector.png";
ballVelocityY = getRandomNumber(-5,5) * (.3 * difficultyLevel),

window.addEventListener('resize', windowResize);
startBtn.addEventListener('click', startGame);
continueBtn.addEventListener('click', resumeGame);
restartBtn.addEventListener('click', resetGame);
againBtn.addEventListener('click', resetGame);
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

startMenu.className = 'active';
pauseMenu.className = '';
gameplay.className = '';
gameOverMenu.className = '';

window.onblur = function() {
  if(gameInProgress) pauseGame();  
}

function startGame() {
    gameInProgress = true;
    gameplay.className = '';
    startMenu.className = '';
    gameOverMenu.className = '';
    pauseMenu.className = '';
    gamePaused = false;
    gameInterval = window.setInterval(function() {
        moveEverything();
        drawEverything();
    }, 1000/fps);
}

function resetGame() {
    playerOneScore = 0;
    playerTwoScore = 0;
    difficultyLevel = 1,
    ballPositionX = canvas.width/2 - ballSize/2;
    ballPositionY = canvas.height/2 - ballSize/2;
    paddleOneY = canvas.height/2 - paddleHeight/2;
    paddleTwoY = canvas.height/2 - paddleHeight/2;
    ballVelocityY = getRandomNumber(-5,5) * (.3 * difficultyLevel),
    startGame();
}

function togglePause() {
  if(gamePaused) {
    resumeGame();
  } 
  else {
    pauseGame();
  }
} 

function pauseGame() {
  if(!gamePaused) {
    gamePaused = true;
    gameplay.className = '';
    pauseMenu.className = 'active';
    clearInterval(gameInterval);
  }
}

function resumeGame() {
  if(gamePaused) {
    gamePaused = false;
    resetBall();
    gameplay.className = '';
    pauseMenu.className = ''; 
    startGame();
  }
}

function windowResize() {
    resetBall();
    canvas.width = window.innerWidth*.6;
    canvas.height = window.innerHeight*.6;
    drawEverything();
}

function keyDown(e) {
  e.preventDefault();
  switch(e.keyCode) {
    case 13:
      if(gameInProgress) togglePause();
      break;
    case 38:
      if(!gamePaused) paddleOneDirectionY = 'up';
      break;
    case 40:
      if(!gamePaused) paddleOneDirectionY = 'down';
      break;
  }
}

function keyUp(e) {
  paddleOneDirectionY = null;
}

function resetBall() {
    ballVelocityX = -ballVelocityX;
    ballVelocityY = getRandomNumber(-5,5) * (.3 * difficultyLevel);
    ballPositionX = canvas.width/2;
    ballPositionY = canvas.height/2;
}

function showScoringMessageAlert(scoringPlayer){ //Set to -1 means human player scored, set to 1 means that the AI scored 
    if(scoringPlayer==-1){
        playerOneScore++;
        playerScoredMessagePosY=canvas.height*.75;
        window.setTimeout(function(){hideScoringMessageAlert()}, 5000);
        scoringPlayer=0;
    }
    else if(scoringPlayer==1){
        playerTwoScore++;
        computerScoredMessagePosY=canvas.height*.875;
        window.setTimeout(function(){hideScoringMessageAlert()}, 5000);
        scoringPlayer=0;
    }
}

function hideScoringMessageAlert(){
    playerScoredMessagePosY=playerScoredMessageRestingPos;
    computerScoredMessagePosY=computerScoredMessageRestingPos;
}

function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

function randomizeGame() {
  paddleTwoVelocityY = getRandomNumber(7,27) * (.20 * difficultyLevel);
}

function gameOver(playerWon) {
  gameInProgress = false;
  clearInterval(gameInterval);
  gameMessage.textContent = '';
  againBtn.textContent = '';
  if(playerWon) {
    gameMessage.textContent = 'You won! CONGRATULATIONS! ';
    againBtn.textContent = 'Play again';
  } else {
    gameMessage.textContent = 'AI Wins! Better luck next time! (ﾉ｀□´)ﾉ⌒┻━┻';
    againBtn.textContent = 'Try again';
  }
  gameplay.className = '';
  gameOverMenu.className = 'active'; 
}

function moveEverything() {
    ballPositionX = ballPositionX + ballVelocityX;
    if(ballPositionX > canvas.width - paddleWidth*2 - ballSize/2) 
    {
        if(ballPositionY >= paddleTwoY && ballPositionY <= paddleTwoY + paddleHeight && ballPositionX < canvas.width - paddleWidth) {
            ballVelocityX = -ballVelocityX;
            if(ballPositionY >= paddleTwoY && ballPositionY < paddleTwoY + paddleHeight*.2) {
                ballVelocityY = -15 * (.25 * difficultyLevel);
            } 
            else if(ballPositionY >= paddleTwoY + paddleHeight*.2 && ballPositionY < paddleTwoY + paddleHeight*.4) {
                ballVelocityY = -10 * (.25 * difficultyLevel);
            } 
            else if(ballPositionY >= paddleTwoY + paddleHeight*.4 && ballPositionY < paddleTwoY + paddleHeight*.6) {
                ballVelocityY = getRandomNumber(-5,5);
            } 
            else if(ballPositionY >= paddleTwoY  + paddleHeight*.6 && ballPositionY < paddleTwoY + paddleHeight*.8) {
                ballVelocityY = 10 * (.15 * difficultyLevel);
            } 
            else if(ballPositionY >= paddleTwoY + paddleHeight*.8 && ballPositionY < paddleTwoY + paddleHeight) {
                ballVelocityY = 15 * (.35 * difficultyLevel);
            }
        } 
        else if(ballPositionX > canvas.width) {
            showScoringMessageAlert(-1);
            resetBall();
            difficultyLevel = playerOneScore*.1;
            if(playerOneScore === scoreToWin) gameOver(true);
    }
    randomizeGame();
    } 

    else if(ballPositionX < paddleWidth*2 + ballSize/2) {
        if( ballPositionY >= paddleOneY && 
            ballPositionY <= paddleOneY + paddleHeight && 
            ballPositionX > paddleWidth + ballSize/2) {
                ballVelocityX = -ballVelocityX;
                if(ballPositionY >= paddleOneY && ballPositionY < paddleOneY + paddleHeight*.2) {
                    ballVelocityY = -20 * (.25 * difficultyLevel);
                } 
                else if(ballPositionY >= paddleOneY + paddleHeight*.2 && 
                    ballPositionY < paddleOneY + paddleHeight*.4) 
                    {
                        ballVelocityY = -10 * (.25 * difficultyLevel);
                    } 
                else if(ballPositionY >= paddleOneY + paddleHeight*.4 && ballPositionY < paddleOneY + paddleHeight*.6) {
                    ballVelocityY = 0 * (.25 * difficultyLevel);
                } 
                else if(ballPositionY >= paddleOneY  + paddleHeight*.6 && ballPositionY < paddleOneY + paddleHeight*.8) {
                    ballVelocityY = 10 * (.30 * difficultyLevel);
                } 
                else if(ballPositionY >= paddleOneY + paddleHeight*.8 && ballPositionY < paddleOneY + paddleHeight) {
                    ballVelocityY = 20 * (.45 * difficultyLevel);
                }
            } 
        else if(ballPositionX <= -ballSize) {
            showScoringMessageAlert(1);
            resetBall();
            if(playerTwoScore === scoreToWin) gameOver(false);
        }
        randomizeGame();
    }
    
    ballPositionY = ballPositionY + ballVelocityY; 
    if(ballPositionY > canvas.height - ballSize/2) {
        ballVelocityY = -ballVelocityY;
        ballPositionY = canvas.height - ballSize/2;
    } 
    else if(ballPositionY < ballSize/2) {
        ballVelocityY = -ballVelocityY;
        ballPositionY = ballSize/2;
    }
    
    if(paddleOneDirectionY === 'up' && paddleOneY >= 0) {
        paddleOneY = paddleOneY - paddleOneVelocityY;
    } 
    else if(paddleOneDirectionY === 'down' && paddleOneY < (canvas.height - paddleHeight) ) {
        paddleOneY += paddleOneVelocityY; 
    }
    
    if(ballPositionY < paddleTwoY) {
        paddleTwoY -= paddleTwoVelocityY;
    } 
    else if(ballPositionY > paddleTwoY + paddleHeight) {
        paddleTwoY += paddleTwoVelocityY;    
    }
  
}

function drawEverything() {
    canvasContext.fillStyle = 'black';
    canvasContext.fillRect(0,0,canvas.width,canvas.height); 
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    
    
    canvasContext.fillStyle = 'rgba(255,0,0,0.3)';
    canvasContext.font = "180px 'Roboto', Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillText(playerOneScore,canvas.width*.25,canvas.height/4 + 75);
    
    canvasContext.fillStyle = 'rgba(0,0,255,0.3)';
    canvasContext.font = "180px 'Roboto', Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillText(playerTwoScore,canvas.width*.75,canvas.height/4 + 75);
    
    canvasContext.strokeStyle = 'rgba(50,50,255,0.4)';
    canvasContext.beginPath();
    canvasContext.lineWidth = 10;
    canvasContext.moveTo(canvas.width/2,0);
    canvasContext.lineTo(canvas.width/2,canvas.height);
    canvasContext.stroke();

    canvasContext.strokeStyle = 'rgba(255,30,30,0.4)';
    canvasContext.beginPath();
    canvasContext.arc(canvas.width/2,canvas.height/2, canvas.height/8, 0, 2*Math.PI);
    canvasContext.stroke();

    canvasContext.drawImage(mapleLeaf, canvas.width/2-canvas.width/15, canvas.height/2-canvas.height/10, canvas.width/7.5, canvas.height/5);

    //puck fill
    canvasContext.fillStyle = 'black';
    canvasContext.beginPath();
    canvasContext.arc(ballPositionX, ballPositionY, ballSize/2, 0, Math.PI*2, true);
    canvasContext.fill();

    //player paddle fill
    canvasContext.fillStyle = 'rgba(255,30,30,.8)';
    canvasContext.fillRect(paddleWidth,paddleOneY,paddleWidth,paddleHeight); // x, y, w, h
    canvasContext.fillStyle='black';
  
    //computer paddle fill
    canvasContext.fillStyle = 'rgba(30,30,255,.8)';
    canvasContext.fillRect(canvas.width - paddleWidth*2,paddleTwoY,paddleWidth,paddleHeight); // x, y, w, h

    //player scored message
    canvasContext.fillStyle = 'rgba(255,0,0,0.8)';
    canvasContext.font = "50px 'Roboto', Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillText(playerScoredMessage,canvas.width*.5,playerScoredMessagePosY);

    //computer scored message
    canvasContext.fillStyle = 'rgba(0,0,255,0.8)';
    canvasContext.font = "50px 'Roboto', Arial";
    canvasContext.textAlign = "center";
    canvasContext.fillText(computerScoredMessage,canvas.width*.5,computerScoredMessagePosY);
}