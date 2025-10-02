# Checkout Register

POS system implementing the Command pattern, with undo/redo functionality

## SETUP
```
bash
npm install
npm run dev
```

Open http://localhost:5173

## Features:

    - Add products to cart with quantity tracking
    - Apply percentage discounts to individual items
    - Apply group discounts with 2+ items in cart
    - Adjustable sales tax rate
    - Split payments across multiple payment types (cash, credit, debit, gift card)
    - Full undo/redo support for all operations

## Implementation
Built with React, TypeScript, and Vite. Tailwind CSS via CDN for quick styling.

### Command Pattern
All state mutations are wrapped in command objects which implemement execute and undo methods. Command history is an array with pointer tracking current position to allow for straightforward undo/redo functionality

Command executions are added to history. Undo calls previous command's undo method to move pointer back. Redo moves forward and re-executes functionality

## #Project structure
```
src/
    App.tsx
    useCheckoutCommands.ts
    calculations.ts
    types.ts
    main.tsx
    index.css
```


## Notes
Sales tax applies after all discounts. Group discounts stack with individual item discounts, with individual discounts applying first
