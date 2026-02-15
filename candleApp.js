// candleApp.js
let candle;
let flame;
let stopwatchHand;
let candleContainer;
let stopwatchContainer;

// Candle state variables
let timeLeft = 10;
let isRunning = true;
let interval;
let lightingComplete = false;

// Initialize candle and stopwatch
function initCandleApp() {
  // Create candle wrapper (holds candle at bottom)
  const candleWrapper = document.createElement('div');
  candleWrapper.className = 'candle-wrapper';
  document.body.appendChild(candleWrapper);

  // Create candle container
  candleContainer = document.createElement('div');
  candleContainer.className = 'candle-container';
  candleWrapper.appendChild(candleContainer);

  // Create candle element (larger - 200px max height)
  candle = document.createElement('div');
  candle.className = 'candle';
  candle.style.transform = 'scaleY(1)';
  candleContainer.appendChild(candle);

  // Create wick
  const wick = document.createElement('div');
  wick.className = 'wick';
  candle.appendChild(wick);

  // Create flame (initially hidden/out)
  flame = document.createElement('div');
  flame.className = 'flame out';
  candle.appendChild(flame);

  // Create melted wax pool at bottom
  const meltedWax = document.createElement('div');
  meltedWax.className = 'melted-wax';
  candleContainer.appendChild(meltedWax);

  // Create analog stopwatch container (to the right)
  stopwatchContainer = document.createElement('div');
  stopwatchContainer.className = 'stopwatch-container';
  document.body.appendChild(stopwatchContainer);

  // Create stopwatch face
  const stopwatchFace = document.createElement('div');
  stopwatchFace.className = 'stopwatch-face';
  stopwatchContainer.appendChild(stopwatchFace);

  // Create markings on stopwatch
  const markings = document.createElement('div');
  markings.className = 'stopwatch-markings';
  for (let i = 0; i < 60; i++) {
    const mark = document.createElement('div');
    mark.className = i % 5 === 0 ? 'mark major' : 'mark';
    mark.style.transform = `rotate(${i * 6}deg)`;
    mark.style.transformOrigin = '50% 67px';
    markings.appendChild(mark);
  }
  stopwatchFace.appendChild(markings);

  // Create stopwatch hand
  stopwatchHand = document.createElement('div');
  stopwatchHand.className = 'stopwatch-hand';
  stopwatchFace.appendChild(stopwatchHand);

  // Create label
  const label = document.createElement('div');
  label.className = 'stopwatch-label';
  label.textContent = 'TIMER';
  stopwatchFace.appendChild(label);

  // Add click event listener to stopwatch
  stopwatchContainer.addEventListener('click', () => {
    // Check if candle has burned out
    if (timeLeft <= 0) {
      // Reset and restart the burn down
      resetCandle();
    } else if (lightingComplete) {
      // Toggle pause/play
      isRunning = !isRunning;
      clearInterval(interval);
      if (isRunning) {
        interval = setInterval(updateCandleAndStopwatch, 100);
        candleContainer.classList.remove('paused');
      } else {
        candleContainer.classList.add('paused');
      }
    }
  });

  // Start the lighting animation
  performLightingAnimation();
}

// Reset candle to initial state and replay lighting animation
function resetCandle() {
  // Reset state
  timeLeft = 10;
  isRunning = false;
  lightingComplete = false;
  candle.style.transform = 'scaleY(1)';
  flame.classList.add('out');
  candleContainer.classList.remove('paused');
  stopwatchHand.style.transform = 'translateX(-50%) rotate(0deg)';
  clearInterval(interval);
  
  // Replay the lighting animation
  performLightingAnimation();
}

// Perform the lighting animation
function performLightingAnimation() {
  // Create lighter container (hand + taper)
  const lighterContainer = document.createElement('div');
  lighterContainer.className = 'lighter-container';
  document.body.appendChild(lighterContainer);

  // Create hand
  const hand = document.createElement('div');
  hand.className = 'hand';
  lighterContainer.appendChild(hand);

  // Create thumb
  const thumb = document.createElement('div');
  thumb.className = 'thumb';
  hand.appendChild(thumb);

  // Create fingers
  const fingers = document.createElement('div');
  fingers.className = 'fingers';
  for (let i = 0; i < 4; i++) {
    const finger = document.createElement('div');
    finger.className = 'finger';
    fingers.appendChild(finger);
  }
  hand.appendChild(fingers);

  // Create taper candle
  const taper = document.createElement('div');
  taper.className = 'taper';
  hand.appendChild(taper);

  // Create taper flame
  const taperFlame = document.createElement('div');
  taperFlame.className = 'taper-flame';
  taper.appendChild(taperFlame);

  // Listen for when the lighter reaches the wick (at 40% of animation - now 4s total)
  setTimeout(() => {
    // Create sparks
    createSparks();
    // Light the main candle
    flame.classList.remove('out');
  }, 1600);

  // Listen for when animation completes
  lighterContainer.addEventListener('animationend', () => {
    // Remove the lighter elements
    lighterContainer.remove();
    // Start the burn down
    lightingComplete = true;
    startCandle();
  });
}

// Create spark effects
function createSparks() {
  const wickRect = candle.querySelector('.wick').getBoundingClientRect();
  const centerX = wickRect.left + wickRect.width / 2;
  const centerY = wickRect.top;

  for (let i = 0; i < 8; i++) {
    const spark = document.createElement('div');
    spark.className = 'spark';
    spark.style.left = centerX + 'px';
    spark.style.top = centerY + 'px';
    
    // Random direction for each spark
    const angle = (i / 8) * Math.PI * 2;
    const distance = 30 + Math.random() * 20;
    const tx = Math.cos(angle) * distance;
    const ty = Math.sin(angle) * distance - 20;
    
    spark.style.setProperty('--tx', tx + 'px');
    spark.style.setProperty('--ty', ty + 'px');
    spark.style.animation = 'spark 0.5s ease-out forwards';
    
    document.body.appendChild(spark);
    
    // Remove spark after animation
    setTimeout(() => spark.remove(), 500);
  }
}

// Update candle and stopwatch
function updateCandleAndStopwatch() {
  if (timeLeft > 0) {
    // Update candle scale (decrease from top, keep bottom fixed)
    const scale = timeLeft / 10;
    candle.style.transform = `scaleY(${scale})`;

    // Scale flame only slightly (max 15% shrink) to keep it realistic
    // Counter-scale the flame so it shrinks less than the candle
    const flameScale = 1 - ((1 - scale) * 0.15);
    flame.style.transform = `translateX(-50%) scale(${flameScale})`;

    // Update stopwatch hand (rotate based on time left)
    // 10 seconds = 360 degrees, so each second = 36 degrees
    const degrees = (10 - timeLeft) * 36;
    stopwatchHand.style.transform = `translateX(-50%) rotate(${degrees}deg)`;

    timeLeft -= 0.1;
  } else {
    // Candle has burned out
    timeLeft = 0;
    candle.style.transform = 'scaleY(0)';
    flame.classList.add('out');
    clearInterval(interval);
    isRunning = false;
    candleContainer.classList.add('paused');

    // Stop the stopwatch hand at 360 degrees (full rotation)
    stopwatchHand.style.transform = 'translateX(-50%) rotate(360deg)';
  }
}

// Start the candle burning
function startCandle() {
  // Update every 100ms for smoother animation
  interval = setInterval(updateCandleAndStopwatch, 100);
}

// Initialize the application
initCandleApp();