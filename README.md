# Burning Candle App

An interactive web application featuring a realistic animated candle with a countdown timer, lighting animation, and smooth visual effects.

## Overview

This application displays a candle that burns down over 10 seconds, accompanied by an analog stopwatch. A hand holding a lit taper candle animates in to light the wick at the start, and users can click the stopwatch to restart the process after the candle burns out.

## Technical Architecture

### File Structure
- `index.html` - HTML structure and embedded CSS styles
- `candleApp.js` - Core JavaScript logic and animations
- `style.css` - Additional stylesheet (minimal usage)
- `package.json` - Project metadata

### Core Technologies
- **HTML5** - Semantic markup and structure
- **CSS3** - Advanced animations, gradients, and transforms
- **Vanilla JavaScript (ES6+)** - DOM manipulation and animation logic
- **CSS Animations** - Hardware-accelerated transforms for smooth performance

## How It Works

### 1. Candle Rendering System

#### Visual Structure
The candle is composed of multiple layered elements:

```
.candle-wrapper (flex container, aligns candle to bottom)
  └── .candle-container
      ├── .candle (main wax body with gradient)
      │   ├── .wick (wick at top)
      │   └── .flame (animated flame)
      └── .melted-wax (pool at base)
```

#### Wax Body Styling
```css
.candle {
  width: 100px;
  height: 200px;
  background: linear-gradient(90deg, #e74c3c 0%, #c0392b 30%, ...);
  border-radius: 5px 5px 30px 30px;
  transform-origin: bottom center;
}
```

The candle uses:
- **Linear gradient** - Creates realistic red wax coloring with depth
- **Border radius** - Rounded top and heavily rounded bottom for melted appearance
- **Box shadows** - Inner shadows for depth, outer shadow for 3D effect
- **Transform origin** - Set to `bottom center` for scaling from the bottom

### 2. Burn-Down Animation System

#### The Scaling Approach
Instead of changing the `height` property (which would cause reflow and jittery animation), the candle uses **CSS transforms** with `scaleY()`:

```javascript
// Calculate scale based on remaining time (0.0 to 1.0)
const scale = timeLeft / 10;
candle.style.transform = `scaleY(${scale})`;
```

**Why transforms instead of height?**
- GPU-accelerated for 60fps smooth animation
- Bottom stays fixed due to `transform-origin: bottom center`
- No layout recalculation, better performance
- Smooth easing with CSS transition

#### Flame Behavior
The flame uses a counter-scaling technique to maintain realistic proportions:

```javascript
// Flame only shrinks 15% maximum to stay realistic
const flameScale = 1 - ((1 - scale) * 0.15);
flame.style.transform = `translateX(-50%) scale(${flameScale})`;
```

This ensures the flame doesn't shrink dramatically like the wax body, mimicking real candle behavior where the flame stays relatively constant.

### 3. Flame Animation System

#### Multi-Layered Flame
The flame consists of two elements:
1. **Outer flame** (`div.flame`) - Orange/red gradient with blur
2. **Inner core** (`::before` pseudo-element) - White/yellow hot center

#### Animation Keyframes
```css
@keyframes flicker {
  0% { transform: translateX(-50%) scale(1) rotate(-1deg); }
  100% { transform: translateX(-50%) scale(1.05) rotate(1deg); }
}

@keyframes glow {
  0% { box-shadow: 0 0 30px #ff9800, ...; }
  100% { box-shadow: 0 0 40px #ff9800, ...; }
}
```

- **Flicker** - Fast alternating scale/rotation for realistic flame movement
- **Glow** - Slower pulsing box-shadow for ambient light effect

Both animations run infinitely with alternate direction for smooth looping.

### 4. Lighting Animation Sequence

#### Phase 1: Entrance (0-40%)
The hand enters from the left using CSS animation:
```css
@keyframes moveLighter {
  0% { left: -300px; }
  40% { left: 50%; transform: translateY(-50%) translateX(-50%); }
  ...
}
```

Duration: 4 seconds total

#### Phase 2: Contact (40-60%)
At exactly 40% (1.6 seconds), JavaScript triggers:
1. Spark particle effects created at wick position
2. Main candle flame appears (opacity 0 → 1)
3. Hand holds position for lighting moment

#### Phase 3: Exit (60-100%)
Hand retreats back to the left and is removed from DOM.

#### Hand Structure
```
.lighter-container (animated wrapper)
  └── .hand (main hand shape)
      ├── .thumb (right side thumb)
      ├── .fingers (4 finger divs)
      └── .taper (small candle)
          └── .taper-flame (lit flame)
```

Styling includes:
- Gradient skin tones
- Shadow depth effects
- Inset highlights for 3D appearance

### 5. Analog Stopwatch System

#### Visual Components
- **Face** - Circular gradient background with metallic look
- **Markings** - 60 tick marks generated via JavaScript loop
  - Every 5th mark is longer (major tick)
  - Rotated using `transform: rotate(${i * 6}deg)`
- **Hand** - Rotating needle with gradient coloring
- **Center pivot** - Small circle where hand attaches

#### Timer Logic
```javascript
// 10 seconds = 360 degrees
// Each 0.1 second increment = 3.6 degrees
const degrees = (10 - timeLeft) * 36;
stopwatchHand.style.transform = `translateX(-50%) rotate(${degrees}deg)`;
```

Update frequency: Every 100ms (10fps for timer, smooth enough)

### 6. State Management

The application tracks several states:

```javascript
let timeLeft = 10;        // Seconds remaining (float)
let isRunning = true;     // Animation active?
let interval;             // setInterval reference
let lightingComplete = false;  // Initial lighting done?
```

#### State Transitions
1. **Initial** → Lighting animation → **Burning** (interval starts)
2. **Burning** → timeLeft reaches 0 → **Burned Out** (flame out, paused)
3. **Burned Out** → Click stopwatch → **Reset** → Lighting animation → **Burning**
4. **Burning** → Click stopwatch → **Paused** / **Resumed**

### 7. Particle Effects System

When the taper touches the wick, 8 spark particles are generated:

```javascript
for (let i = 0; i < 8; i++) {
  const spark = document.createElement('div');
  spark.className = 'spark';
  // Calculate position based on angle
  const angle = (i / 8) * Math.PI * 2;
  const distance = 30 + Math.random() * 20;
  const tx = Math.cos(angle) * distance;
  const ty = Math.sin(angle) * distance - 20;
  
  spark.style.setProperty('--tx', tx + 'px');
  spark.style.setProperty('--ty', ty + 'px');
  spark.style.animation = 'spark 0.5s ease-out forwards';
}
```

Uses CSS custom properties (`--tx`, `--ty`) for dynamic animation destinations.

### 8. Performance Optimizations

1. **CSS Transforms** - Used instead of position/height changes
2. **Transform Origin** - Strategic placement for desired animation direction
3. **Will-change** - Implicit through transform usage (GPU layer creation)
4. **Minimal DOM Updates** - Only update changed properties
5. **Event Delegation** - Single click handler for stopwatch
6. **Cleanup** - Remove lighting animation elements after completion

### 9. Responsive Design

- Uses `vh` units for full viewport coverage
- Flexbox centering adapts to any screen size
- Fixed element sizes maintain proportions
- `overflow: hidden` prevents scrollbars during animations

### 10. Browser Compatibility

- **Modern browsers** - Chrome, Firefox, Safari, Edge (ES6+ features)
- **CSS Features Used**:
  - CSS Grid (not used, flexbox instead)
  - CSS Custom Properties
  - CSS Animations & Keyframes
  - CSS Transforms 3D
  - Linear & Radial Gradients

## Key JavaScript Functions

### `initCandleApp()`
Sets up the DOM structure and initializes the application state.

### `performLightingAnimation()`
Creates and animates the hand/taper lighting sequence.

### `updateCandleAndStopwatch()`
Core animation loop - updates candle scale, flame scale, and stopwatch hand rotation.

### `resetCandle()`
Resets state and triggers the lighting animation for restart.

### `createSparks()`
Generates particle effects at the wick position.

## CSS Architecture

### Naming Convention
- BEM-like naming: `.block-element--modifier`
- Semantic class names describing purpose

### Animation Classes
- `.out` - Hides flame (opacity: 0)
- `.paused` - Dims stopwatch during pause
- Dynamic inline styles for position/transform updates

### Color Palette
- **Background** - Dark gradient (#1a1a2e to #0f0f23)
- **Candle Wax** - Red gradient (#e74c3c to #c0392b)
- **Flame** - Yellow/Orange/Red gradient (#ffeb3b to #ff5722)
- **Stopwatch** - Dark metallic (#2c3e50 to #34495e)
- **Hand** - Skin tone gradient (#f5cba7 to #d68910)

## Future Enhancements

Potential improvements:
- Sound effects for lighting and burning
- Wind effect on flame (mouse movement)
- Multiple candles with staggered lighting
- Wax dripping animation
- Customizable burn time
- Mobile touch interactions

## License

This project is for educational purposes.
