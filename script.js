let gameState = {
    score: 0,
    timeLeft: 30,
    isGameActive: false,
    gameTimer: null,
    characterTimer: null,
    activeCharacters: [], 
    gameSpeed: 800, 
    maxActiveCharacters: 2,
    combo: 0,
    lastHitTime: 0
};

const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const startButton = document.getElementById('startButton');
const restartButton = document.getElementById('restartButton');
const playAgainButton = document.getElementById('playAgainButton');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreElement = document.getElementById('finalScore');
const scoreMessageElement = document.getElementById('scoreMessage');
const holes = document.querySelectorAll('.hole');
const characters = document.querySelectorAll('.character');

document.addEventListener('DOMContentLoaded', function() {
    setupGame();
});

function setupGame() {
    startButton.addEventListener('click', startGame);

    restartButton.addEventListener('click', resetGame);

    playAgainButton.addEventListener('click', resetGame);

    characters.forEach((character, index) => {
        character.addEventListener('click', function() {
            hitCharacter(index);
        });
    });
    
    characters.forEach((character, index) => {
        character.addEventListener('touchstart', function(e) {
            e.preventDefault(); 
            hitCharacter(index);
        });
    });
}

function startGame() {
    gameState.score = 0;
    gameState.timeLeft = 30;
    gameState.isGameActive = true;
    gameState.gameSpeed = 800;
    gameState.activeCharacters = [];
    gameState.combo = 0;
    gameState.lastHitTime = 0;

    updateScore();
    updateTimer();
    startButton.classList.add('hidden');
    restartButton.classList.remove('hidden');

    startGameTimer();
    startCharacterTimer();
    console.log('Game started!');
}

function startGameTimer() {
    gameState.gameTimer = setInterval(function() {
        gameState.timeLeft--;
        updateTimer();

        if (gameState.timeLeft <= 10) {
            timerElement.classList.add('timer-warning');
        }
        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function startCharacterTimer() {
    gameState.characterTimer = setInterval(function() {
        if (gameState.isGameActive) {
            showRandomCharacters();
            
            if (gameState.score > 0 && gameState.score % 8 === 0) {
                gameState.gameSpeed = Math.max(400, gameState.gameSpeed - 80);
                gameState.maxActiveCharacters = Math.min(3, gameState.maxActiveCharacters + 1);
                clearInterval(gameState.characterTimer);
                startCharacterTimer();
            }
        }
    }, gameState.gameSpeed);
}

function showRandomCharacters() {
    const numToShow = Math.floor(Math.random() * gameState.maxActiveCharacters) + 1;
    const availableHoles = [];
    for (let i = 0; i < 9; i++) {
        if (!gameState.activeCharacters.includes(i)) {
            availableHoles.push(i);
        }
    }
    for (let i = 0; i < numToShow && availableHoles.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableHoles.length);
        const holeIndex = availableHoles[randomIndex];
        availableHoles.splice(randomIndex, 1);
        
        const character = characters[holeIndex];
        if (Math.random() < 0.3) {
            character.classList.add('special');
        }
        character.classList.add('show');
        gameState.activeCharacters.push(holeIndex);
        const hideTime = Math.random() * 1500 + 1000;
        setTimeout(function() {
            if (gameState.activeCharacters.includes(holeIndex)) {
                hideCharacter(holeIndex);
            }
        }, hideTime);
    }
}

function hideCharacter(holeIndex) {
    const character = characters[holeIndex];
    character.classList.remove('show', 'special');
    const index = gameState.activeCharacters.indexOf(holeIndex);
    if (index > -1) {
        gameState.activeCharacters.splice(index, 1);
    }
}

function hitCharacter(holeIndex) {
    if (!gameState.isGameActive) return;
    
    const character = characters[holeIndex];
    if (!character.classList.contains('show')) return;
    
    character.classList.add('hit');
    setTimeout(function() {
        character.classList.remove('hit');
    }, 300);
    
    const currentTime = Date.now();
    let points = 1;
    if (currentTime - gameState.lastHitTime < 1000) {
        gameState.combo++;
        points += gameState.combo;
        showComboEffect(holeIndex);
    } else {
        gameState.combo = 0;
    }
    if (character.classList.contains('special')) {
        points += 2;
        showSpecialEffect(holeIndex);
    }
    
    gameState.lastHitTime = currentTime;
    hideCharacter(holeIndex);
    gameState.score += points;
    updateScore();
    scoreElement.classList.add('score-animate');
    setTimeout(function() {
        scoreElement.classList.remove('score-animate');
    }, 300);
    
    console.log(`Hit! Score: ${gameState.score}, Points: ${points}, Combo: ${gameState.combo}`);
}

function updateScore() {
    scoreElement.textContent = gameState.score;
}
function updateTimer() {
    timerElement.textContent = gameState.timeLeft;
}
function endGame() {
    gameState.isGameActive = false;
    
    clearInterval(gameState.gameTimer);
    clearInterval(gameState.characterTimer);
    characters.forEach(character => {
        character.classList.remove('show', 'special');
    });
    timerElement.classList.remove('timer-warning');
    showGameOverScreen();
    
    console.log('Game ended! Final score:', gameState.score);
}

function showGameOverScreen() {
    finalScoreElement.textContent = gameState.score;
    let message = '';
    if (gameState.score >= 20) {
        message = '🌟 Amazing! You\'re a whack-a-girl champion! 🌟';
    } else if (gameState.score >= 15) {
        message = '💖 Great job! You\'ve got some serious skills! 💖';
    } else if (gameState.score >= 10) {
        message = '😊 Good work! Keep practicing! 😊';
    } else if (gameState.score >= 5) {
        message = '🌸 Not bad! You\'re getting the hang of it! 🌸';
    } else {
        message = '💕 Keep trying! Practice makes perfect! 💕';
    }
    
    scoreMessageElement.textContent = message;
    gameOverScreen.classList.remove('hidden');
}

function resetGame() {
    gameOverScreen.classList.add('hidden');
    startButton.classList.remove('hidden');
    restartButton.classList.add('hidden');
    
    gameState.score = 0;
    gameState.timeLeft = 30;
    gameState.isGameActive = false;
    gameState.activeCharacters = [];
    gameState.gameSpeed = 800;
    gameState.maxActiveCharacters = 2;
    gameState.combo = 0;
    gameState.lastHitTime = 0;
    
    updateScore();
    updateTimer();
    
    timerElement.classList.remove('timer-warning');
    
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
    
    if (gameState.characterTimer) {
        clearInterval(gameState.characterTimer);
        gameState.characterTimer = null;
    }
    
    characters.forEach(character => {
        character.classList.remove('show', 'hit', 'special');
    });
    
    console.log('Game reset!');
}

function showComboEffect(holeIndex) {
    const hole = holes[holeIndex];
    const comboText = document.createElement('div');
    comboText.className = 'combo-effect';
    comboText.textContent = `COMBO x${gameState.combo + 1}!`;
    hole.appendChild(comboText);
    
    setTimeout(() => {
        comboText.remove();
    }, 1000);
}

function showSpecialEffect(holeIndex) {
    const hole = holes[holeIndex];
    const specialText = document.createElement('div');
    specialText.className = 'special-effect';
    specialText.textContent = 'SPECIAL +3!';
    hole.appendChild(specialText);
    
    setTimeout(() => {
        specialText.remove();
    }, 1000);
}

document.addEventListener('visibilitychange', function() {
    if (document.hidden && gameState.isGameActive) {
        clearInterval(gameState.gameTimer);
        clearInterval(gameState.characterTimer);
    } else if (!document.hidden && gameState.isGameActive) {
        startGameTimer();
        startCharacterTimer();
    }
});

document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('.game-container')) {
        e.preventDefault();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        e.preventDefault();
        if (!gameState.isGameActive && !startButton.classList.contains('hidden')) {
            startGame();
        } else if (!gameState.isGameActive && !restartButton.classList.contains('hidden')) {
            resetGame();
        }
    }
});
