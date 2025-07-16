// Game State Variables
let gameState = {
    score: 0,
    timeLeft: 30,
    isGameActive: false,
    gameTimer: null,
    characterTimer: null,
    activeCharacters: [], // Array to track multiple active characters
    gameSpeed: 800, // Time between character appearances (milliseconds)
    maxActiveCharacters: 2, // Maximum characters that can appear at once
    combo: 0, // Track consecutive hits for combo bonus
    lastHitTime: 0 // Track timing for combo system
};

// DOM Elements
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

// Initialize Game
document.addEventListener('DOMContentLoaded', function() {
    setupGame();
});

// Setup Game Event Listeners
function setupGame() {
    // Add click event to start button
    startButton.addEventListener('click', startGame);
    
    // Add click event to restart button
    restartButton.addEventListener('click', resetGame);
    
    // Add click event to play again button
    playAgainButton.addEventListener('click', resetGame);
    
    // Add click events to all characters
    characters.forEach((character, index) => {
        character.addEventListener('click', function() {
            hitCharacter(index);
        });
    });
    
    // Add touch events for mobile
    characters.forEach((character, index) => {
        character.addEventListener('touchstart', function(e) {
            e.preventDefault(); // Prevent default touch behavior
            hitCharacter(index);
        });
    });
}

// Start Game Function
function startGame() {
    // Reset game state
    gameState.score = 0;
    gameState.timeLeft = 30;
    gameState.isGameActive = true;
    gameState.gameSpeed = 800;
    gameState.activeCharacters = [];
    gameState.combo = 0;
    gameState.lastHitTime = 0;
    
    // Update UI
    updateScore();
    updateTimer();
    startButton.classList.add('hidden');
    restartButton.classList.remove('hidden');
    
    // Start game timers
    startGameTimer();
    startCharacterTimer();
    
    console.log('Game started!');
}

// Game Timer (Countdown)
function startGameTimer() {
    gameState.gameTimer = setInterval(function() {
        gameState.timeLeft--;
        updateTimer();
        
        // Add warning effect when time is low
        if (gameState.timeLeft <= 10) {
            timerElement.classList.add('timer-warning');
        }
        
        // End game when time runs out
        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Character Timer (Character appearances)
function startCharacterTimer() {
    gameState.characterTimer = setInterval(function() {
        if (gameState.isGameActive) {
            showRandomCharacters();
            
            // Increase game speed and difficulty as score increases
            if (gameState.score > 0 && gameState.score % 8 === 0) {
                gameState.gameSpeed = Math.max(400, gameState.gameSpeed - 80);
                gameState.maxActiveCharacters = Math.min(3, gameState.maxActiveCharacters + 1);
                clearInterval(gameState.characterTimer);
                startCharacterTimer();
            }
        }
    }, gameState.gameSpeed);
}

// Show Random Characters (Multiple at once)
function showRandomCharacters() {
    // Determine how many characters to show (1 to maxActiveCharacters)
    const numToShow = Math.floor(Math.random() * gameState.maxActiveCharacters) + 1;
    
    // Get available holes (not currently active)
    const availableHoles = [];
    for (let i = 0; i < 9; i++) {
        if (!gameState.activeCharacters.includes(i)) {
            availableHoles.push(i);
        }
    }
    
    // Show characters in random available holes
    for (let i = 0; i < numToShow && availableHoles.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableHoles.length);
        const holeIndex = availableHoles[randomIndex];
        availableHoles.splice(randomIndex, 1);
        
        const character = characters[holeIndex];
        
        // Add different character types for variety
        if (Math.random() < 0.3) {
            character.classList.add('special');
        }
        
        // Show character
        character.classList.add('show');
        gameState.activeCharacters.push(holeIndex);
        
        // Hide character after random time (1-2.5 seconds, shorter for harder difficulty)
        const hideTime = Math.random() * 1500 + 1000;
        setTimeout(function() {
            if (gameState.activeCharacters.includes(holeIndex)) {
                hideCharacter(holeIndex);
            }
        }, hideTime);
    }
}

// Hide Character
function hideCharacter(holeIndex) {
    const character = characters[holeIndex];
    character.classList.remove('show', 'special');
    
    // Remove from active characters array
    const index = gameState.activeCharacters.indexOf(holeIndex);
    if (index > -1) {
        gameState.activeCharacters.splice(index, 1);
    }
}

// Hit Character Function
function hitCharacter(holeIndex) {
    // Only allow hits if game is active and character is showing
    if (!gameState.isGameActive) return;
    
    const character = characters[holeIndex];
    if (!character.classList.contains('show')) return;
    
    // Add hit animation
    character.classList.add('hit');
    
    // Remove hit animation after it completes
    setTimeout(function() {
        character.classList.remove('hit');
    }, 300);
    
    // Calculate score with combo system
    const currentTime = Date.now();
    let points = 1;
    
    // Combo system: extra points for quick consecutive hits
    if (currentTime - gameState.lastHitTime < 1000) {
        gameState.combo++;
        points += gameState.combo;
        showComboEffect(holeIndex);
    } else {
        gameState.combo = 0;
    }
    
    // Special character bonus
    if (character.classList.contains('special')) {
        points += 2;
        showSpecialEffect(holeIndex);
    }
    
    gameState.lastHitTime = currentTime;
    
    // Hide character
    hideCharacter(holeIndex);
    
    // Increase score
    gameState.score += points;
    updateScore();
    
    // Add score animation
    scoreElement.classList.add('score-animate');
    setTimeout(function() {
        scoreElement.classList.remove('score-animate');
    }, 300);
    
    console.log(`Hit! Score: ${gameState.score}, Points: ${points}, Combo: ${gameState.combo}`);
}

// Update Score Display
function updateScore() {
    scoreElement.textContent = gameState.score;
}

// Update Timer Display
function updateTimer() {
    timerElement.textContent = gameState.timeLeft;
}

// End Game Function
function endGame() {
    gameState.isGameActive = false;
    
    // Clear timers
    clearInterval(gameState.gameTimer);
    clearInterval(gameState.characterTimer);
    
    // Hide any active characters
    characters.forEach(character => {
        character.classList.remove('show', 'special');
    });
    
    // Remove timer warning
    timerElement.classList.remove('timer-warning');
    
    // Show game over screen
    showGameOverScreen();
    
    console.log('Game ended! Final score:', gameState.score);
}

// Show Game Over Screen
function showGameOverScreen() {
    finalScoreElement.textContent = gameState.score;
    
    // Set score message based on performance
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

// Reset Game Function
function resetGame() {
    // Hide game over screen
    gameOverScreen.classList.add('hidden');
    
    // Reset UI
    startButton.classList.remove('hidden');
    restartButton.classList.add('hidden');
    
    // Reset game state
    gameState.score = 0;
    gameState.timeLeft = 30;
    gameState.isGameActive = false;
    gameState.activeCharacters = [];
    gameState.gameSpeed = 800;
    gameState.maxActiveCharacters = 2;
    gameState.combo = 0;
    gameState.lastHitTime = 0;
    
    // Update displays
    updateScore();
    updateTimer();
    
    // Remove timer warning
    timerElement.classList.remove('timer-warning');
    
    // Clear any active timers
    if (gameState.gameTimer) {
        clearInterval(gameState.gameTimer);
        gameState.gameTimer = null;
    }
    
    if (gameState.characterTimer) {
        clearInterval(gameState.characterTimer);
        gameState.characterTimer = null;
    }
    
    // Hide all characters
    characters.forEach(character => {
        character.classList.remove('show', 'hit', 'special');
    });
    
    console.log('Game reset!');
}

// Show Combo Effect
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

// Show Special Effect
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

// Handle Page Visibility (Pause game when tab is not active)
document.addEventListener('visibilitychange', function() {
    if (document.hidden && gameState.isGameActive) {
        // Pause game
        clearInterval(gameState.gameTimer);
        clearInterval(gameState.characterTimer);
    } else if (!document.hidden && gameState.isGameActive) {
        // Resume game
        startGameTimer();
        startCharacterTimer();
    }
});

// Prevent right-click context menu on game elements
document.addEventListener('contextmenu', function(e) {
    if (e.target.closest('.game-container')) {
        e.preventDefault();
    }
});

// Add keyboard support (spacebar to start/restart)
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
