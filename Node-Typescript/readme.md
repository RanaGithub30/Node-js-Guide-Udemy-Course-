# Install TypeScript
--------------------------

## Install Typescript using 
    npm install --save-dev typescript

1. **Set up the TypeScript config file**  
   ```bash
   tsc --init

2. Initialize a Node.js project
    npm init

3. Install Node.js type definitions for TypeScript
    npm install --save-dev @types/node

# Install Express Type Definitions
--------------------------

To use TypeScript with Express, install the type definitions:

```bash
npm install --save-dev @types/express

# Modify `tsconfig.json`
--------------------------

After running `tsc --init`, open the generated `tsconfig.json` file and make the following recommended changes for a Node.js + Express project:

```json
{
  "compilerOptions": {
    "target": "ES6",                          
    "module": "commonjs",   
    "moduleResolution": "node",                     
  }
}

# Compile TypeScript
--------------------------

To compile your TypeScript code into JavaScript, run:

```bash
tsc

# Run TypeScript with Nodemon
--------------------------

To run your `.ts` files directly using `nodemon`, follow these steps:

### 1. Install Required Dev Dependencies

Install `ts-node`, `nodemon`, and type definitions:

```bash
npm install --save-dev ts-node typescript nodemon @types/node @types/nodemon

# Update package.json Scripts
--------------------------------

Modify your package.json to include a start script like this:

"scripts": {
  "start": "nodemon --exec ts-node app.ts"
}

# Run the Project
-------------------------

npm start

# TypeScript Output Directory (`outDir`)
--------------------------

In the `tsconfig.json` file, the `outDir` option specifies where the compiled JavaScript files should be placed.

### Example:
```json
"compilerOptions": {
  "outDir": "./dist"
}
