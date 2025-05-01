# Install TypeScript
--------------------------

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
