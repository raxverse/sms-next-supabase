# Experiments Directory (`src/experiments/`)

## Purpose
Isolated experimental, practice, and test pages that are NOT part of the production application. These pages are excluded from the Next.js App Router and won't be compiled as routes.

## Why This Exists
- Practice UI components without affecting production
- Test new features in isolation
- Demo pages for prototyping
- Learning exercises

## Contents

### `tictactoe/`
A Tic-Tac-Toe game implementation
- Used for React state management practice
- Demonstrates game logic patterns
- Shows move history traversal

### `playground/`
A practice workspace
- Test state updates
- Verify input handling
- Try Tailwind layouts
- Quick experiments

### `practice/`
UI/Flexbox practice page
- Flexbox demos
- Grid layout examples
- Component styling tests

### `test/`
Component testing page
- UI component demos
- Style verification
- Quick component tests

## How Experiments Work
These pages are **outside** the `src/app/` directory, so Next.js won't create routes for them.

To use an experiment:
1. Move it temporarily to `src/app/[experiment-name]/`
2. Access via `http://localhost:3000/[experiment-name]`
3. Move back to `src/experiments/` when done

## Guidelines
1. **Don't bloat production**: Keep experiments here
2. **Delete when obsolete**: Clean up old experiments
3. **Document purpose**: Add comments explaining what you're testing
4. **No production imports**: Experiments shouldn't be imported by app code
