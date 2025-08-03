# Rubik's Cube Solver

A 3D Rubik's Cube solver and visualizer implemented in JavaScript.

## Features

- Interactive 3D Rubik's Cube visualization
- Cube solving algorithm implementation
- Manual cube rotation controls
- Scramble and solve functionality
- Import/export cube state
- Multiple perspective views

## Files Structure

### Main Files
- `index.html` - The main HTML page
- `main.js` - Main application logic
- `cube.js` - Cube class and solving algorithms
- `pathfind.js` - Pathfinding algorithms for solving
- `package.js` - Combined JavaScript bundle

### Library Files
- `libs/vector/` - Vector math utilities
- `libs/utils/` - General utility functions
- `libs/rect/` - Rectangle/collision utilities  
- `libs/event/` - Event system
- `libs/networking/` - Networking utilities (unused in main app)

## Getting Started

1. Open `index.html` in a web browser, or
2. Run `start.bat` to open the application automatically

## Building

To rebuild the combined package.js file from individual JavaScript files:

```bash
npm run build
```

Or manually:
```powershell
Get-Content libs\vector\*.js, libs\utils\*.js, libs\rect\*.js, libs\event\*.js, libs\networking\*.js, pathfind.js, cube.js, main.js | Out-File -Encoding UTF8 package.js
```

## Usage

1. Open `index.html` in a web browser
2. Use the rotation buttons to manually rotate cube faces
3. Click "Scramble" to randomize the cube
4. Click "Solve" to generate solving moves
5. Click "Apply" to execute the generated moves
6. Use keyboard shortcuts (F, R, U, L, D, B) when not focused on the textarea

## Development Notes

This project was originally developed in TypeScript and converted to pure JavaScript. The conversion involved:

1. Removing type annotations from all classes and functions
2. Converting TypeScript interfaces to regular JavaScript objects
3. Updating constructor parameter assignments
4. Removing TypeScript-specific syntax like `public`, `private`, generic types
5. All TypeScript files have been removed - only JavaScript remains

The functionality is identical to the original TypeScript version.

## Dependencies

- quaternion.js - For 3D rotations (loaded from CDN)

## Browser Compatibility

Modern browsers that support ES2019 features including:
- Classes
- Arrow functions  
- Template literals
- Destructuring assignment
- Array methods like `map`, `filter`, `find`
