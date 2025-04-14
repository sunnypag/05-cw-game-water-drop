// Game state variables
let gameActive = false;  // Tracks if game is currently running
let gameInterval;        // Stores the interval that creates drops

// Event listener for the start button
document.getElementById('start-btn').addEventListener('click', startGame);

// Game initialization function
function startGame() {
    // Prevent multiple game instances
    if (gameActive) return;
    
    // Set up initial game state
    gameActive = true;
    document.getElementById('start-btn').disabled = true;
    
    // Start creating drops every 1000ms (1 second)
    gameInterval = setInterval(createDrop, 1000);
}

// Function to create and manage individual water drops
function createDrop() {
    const drop = document.createElement('div');
    
    // Randomly determine if this drop is good or bad (20% chance of bad)
    const isBadDrop = Math.random() < 0.2;
    drop.className = isBadDrop ? 'water-drop bad-drop' : 'water-drop';
    
    // Create random size variation for visual interest
    const scale = 0.8 + Math.random() * 0.7;  // Results in 80% to 150% of original size
    drop.style.transform = `scale(${scale})`;
    
    // Position drop randomly along the width of the game container
    const gameWidth = document.getElementById('game-container').offsetWidth;
    const randomX = Math.random() * (gameWidth - 40);
    drop.style.left = `${randomX}px`;
    
    // Set drop animation speed
    drop.style.animationDuration = '4s';
    
    // Simple click handler to remove drops
    drop.addEventListener('click', () => {
        drop.remove();
    });
    
    // Add drop to game container
    document.getElementById('game-container').appendChild(drop);
    
    // Remove drop if it reaches bottom without being clicked
    drop.addEventListener('animationend', () => {
        drop.remove();
    });
}

// Add event listeners for jug movement
const gameContainer = document.getElementById('game-container');
const jug = document.querySelector('.water-can-container');

let jugPosition = 50; // Initial position in percentage
const moveStep = 5; // Movement step in percentage

function moveJug(event) {
    if (event.key === 'ArrowLeft' || event.key === 'a') {
        jugPosition = Math.max(0, jugPosition - moveStep); // Prevent moving out of bounds
    } else if (event.key === 'ArrowRight' || event.key === 'd') {
        jugPosition = Math.min(100, jugPosition + moveStep); // Prevent moving out of bounds
    }
    jug.style.left = `${jugPosition}%`;
}

document.addEventListener('keydown', moveJug);

// Function to check collision between two elements
function isColliding(el1, el2) {
    const rect1 = el1.getBoundingClientRect();
    const rect2 = el2.getBoundingClientRect();

    return (
        rect1.left < rect2.right &&
        rect1.right > rect2.left &&
        rect1.top < rect2.bottom &&
        rect1.bottom > rect2.top
    );
}

// Function to display "YOU WIN" message and stop the game
function displayWinMessage() {
    if (document.querySelector('.win-message')) return; // Ensure the message shows only once

    // Stop the game loop
    clearInterval(gameInterval);
    gameActive = false;

    // Create "YOU WIN" message
    const winMessage = document.createElement('div');
    winMessage.className = 'win-message';
    winMessage.textContent = 'YOU WIN';
    document.getElementById('game-container').appendChild(winMessage);
}

// Update the game loop to check for collisions
function checkCollisions() {
    const drops = document.querySelectorAll('.water-drop'); // All drops
    const jug = document.querySelector('.water-can-container');

    drops.forEach(drop => {
        if (isColliding(jug, drop)) {
            drop.remove(); // Remove the drop on collision
            const scoreElement = document.getElementById('score');
            let currentScore = parseInt(scoreElement.textContent, 10);

            if (drop.classList.contains('bad-drop')) {
                scoreElement.textContent = currentScore - 100; // Decrease score by 100 for red drops
            } else {
                scoreElement.textContent = currentScore + 10; // Increase score by 10 for blue drops
            }

            if (parseInt(scoreElement.textContent, 10) >= 100) {
                displayWinMessage();
            }
        }
    });
}

// Add collision checking to the game loop
setInterval(checkCollisions, 50);

// Reset the game state and score
function resetGame() {
    // Stop the game loop
    clearInterval(gameInterval);
    gameActive = false;

    // Reset the score
    const scoreElement = document.getElementById('score');
    scoreElement.textContent = '0';

    // Remove all water drops
    const drops = document.querySelectorAll('.water-drop');
    drops.forEach(drop => drop.remove());

    // Re-enable the start button
    document.getElementById('start-btn').disabled = false;
}

// Add event listener to the reset button
document.getElementById('reset-btn').addEventListener('click', resetGame);
