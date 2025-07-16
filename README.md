# Whack-a-Girl Game

## Overview

This is a simple web-based whack-a-mole style game with a cute, pink-themed aesthetic. The game is built using vanilla HTML, CSS, and JavaScript, creating an interactive clicking game where players try to hit characters that appear in holes within a time limit.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Single Page Application (SPA)**: Built with vanilla web technologies
- **No Framework Dependencies**: Uses pure HTML5, CSS3, and ES6 JavaScript
- **Responsive Design**: Mobile-friendly with touch event support
- **Component-Based Structure**: Modular CSS classes and JavaScript functions

### Technology Stack
- **HTML5**: Semantic markup with SVG graphics for characters
- **CSS3**: Modern styling with gradients, flexbox, and animations
- **Vanilla JavaScript**: ES6+ features for game logic and DOM manipulation
- **SVG Graphics**: Scalable vector graphics for character illustrations

## Key Components

### 1. Game Engine (`script.js`)
- **Game State Management**: Centralized state object tracking score, time, and game status
- **Event Loop**: Timer-based game loop for character spawning and game progression
- **Input Handling**: Click and touch event listeners for cross-platform compatibility

### 2. User Interface (`index.html`)
- **Game Header**: Score and timer display
- **Game Board**: Grid of holes where characters appear
- **Character Graphics**: SVG-based cute character illustrations

### 3. Styling System (`style.css`)
- **Theme**: Pink/purple gradient color scheme
- **Layout**: Flexbox-based responsive design
- **Visual Effects**: Shadows, gradients, and hover states

## Data Flow

### Game Loop
1. **Initialization**: Setup DOM references and event listeners
2. **Game Start**: Begin countdown timer and character spawning
3. **Character Spawning**: Random character appears in random hole
4. **User Interaction**: Click/touch detection and score calculation
5. **Game End**: Timer expiration triggers game over state

### State Management
- **Centralized State**: Single `gameState` object holds all game data
- **DOM Updates**: Real-time updates to score and timer displays
- **Event-Driven**: User interactions trigger immediate state changes

## External Dependencies

### None
- **Zero Dependencies**: No external libraries or frameworks
- **Self-Contained**: All assets and code included in repository
- **Browser APIs Only**: Uses standard web APIs (DOM, SVG, timers)

## Deployment Strategy

### Static Web Hosting
- **File Structure**: Simple flat file structure suitable for any web server
- **No Build Process**: Ready to deploy as-is
- **CDN Compatible**: Static assets can be served from content delivery networks

### Hosting Options
- **GitHub Pages**: Direct deployment from repository
- **Netlify/Vercel**: Drag-and-drop deployment
- **Traditional Web Hosting**: Upload files to any web server

### Browser Compatibility
- **Modern Browsers**: Supports all current browsers with ES6+ support
- **Mobile Devices**: Touch events for mobile gameplay
- **Progressive Enhancement**: Graceful degradation for older browsers

### Performance Considerations
- **Lightweight**: Minimal file sizes and no external dependencies
- **Optimized Graphics**: SVG graphics scale without quality loss
- **Efficient Event Handling**: Minimal DOM manipulation for smooth gameplay