```markdown
# penny-wise-saliha-yeab Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns and conventions used in the `penny-wise-saliha-yeab` JavaScript repository. You'll learn how to structure files, write imports and exports, follow commit message patterns, and create and run tests in alignment with the project's standards. This guide is ideal for contributors aiming for consistency and maintainability in their code.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - **Example:** `userProfile.js`, `transactionList.js`

### Import Style
- Use **relative imports** for modules within the project.
  - **Example:**
    ```javascript
    import { calculateTotal } from './utils/calculateTotal';
    ```

### Export Style
- Use **named exports** for functions, objects, or constants.
  - **Example:**
    ```javascript
    // utils/calculateTotal.js
    export function calculateTotal(items) {
      // ...
    }
    ```

### Commit Messages
- Commit messages are **freeform** (no enforced prefixes), but typically concise (average 42 characters).
  - **Example:**  
    ```
    Add basic validation to input fields
    ```

## Workflows

### Adding a New Module
**Trigger:** When you need to add new functionality as a separate module  
**Command:** `/add-module`

1. Create a new file using camelCase naming (e.g., `newFeature.js`).
2. Implement your logic using named exports.
    ```javascript
    // newFeature.js
    export function newFeature() {
      // implementation
    }
    ```
3. Import your module where needed using a relative path.
    ```javascript
    import { newFeature } from './newFeature';
    ```
4. Write a corresponding test file named `newFeature.test.js`.
5. Commit your changes with a clear, concise message.

### Writing and Running Tests
**Trigger:** When you add or update code that requires testing  
**Command:** `/run-tests`

1. Create a test file with the pattern `*.test.js` (e.g., `calculateTotal.test.js`).
2. Write your tests (testing framework is not specified; use your team's standard).
3. Run the test suite using your preferred method (e.g., `npm test` or similar).
4. Ensure all tests pass before committing.

### Refactoring Code
**Trigger:** When improving or restructuring existing code  
**Command:** `/refactor`

1. Update the relevant files, maintaining camelCase naming and relative imports.
2. Use named exports for any new or updated functions.
3. Update or add tests as needed.
4. Commit with a descriptive message about the refactor.

## Testing Patterns

- Test files follow the `*.test.js` naming convention.
- The testing framework is not specified; use the team's preferred tool.
- Place test files alongside or near the modules they test.
- Example test file:
    ```javascript
    // calculateTotal.test.js
    import { calculateTotal } from './calculateTotal';

    test('sums up item prices correctly', () => {
      expect(calculateTotal([{ price: 5 }, { price: 10 }])).toBe(15);
    });
    ```

## Commands
| Command        | Purpose                                      |
|----------------|----------------------------------------------|
| /add-module    | Scaffold and add a new module                |
| /run-tests     | Run all test files matching `*.test.js`      |
| /refactor      | Start a code refactor workflow               |
```
