## Introduction to Deno

    - Deno is a secure, modern runtime for JavaScript and TypeScript, built on V8 and Rust. 
    - It was created by Ryan Dahl, the creator of Node.js, with the goal of addressing some of Node.js's shortcomings. 
    - Deno aims to provide a more secure, efficient, and developer-friendly experience for JavaScript and TypeScript development. 

----

## 🔍 Feature Comparison (Node vs Deno)

| Feature               | **Node.js**                                     | **Deno**                                                   |
|-----------------------|------------------------------------------------------------------------------|--------------------------------------------------------------------------|

| **Language Support**  | JavaScript (JS) & optional TypeScript via tools like `ts-node`              | Native support for TypeScript & JavaScript                               |
| **Security**          | No default security (full access to FS, network, env)                       | Secure by default (must allow access explicitly with flags)              |
| **Package Manager**   | Uses `npm` and `package.json`                                               | No package manager; uses URL-based imports                              |
| **Module System**     | CommonJS (`require`) and ES Modules (`import`)                              | Only ES Modules (`import/export`)                                        |
| **Standard Library**  | Minimal; relies heavily on third-party modules                              | Comes with a comprehensive standard library                              |
| **Installation**      | Requires `npm`, `nvm`, `npx`, etc.                                          | Single binary installation                                               |
| **Bundling & Tools**  | Needs external tools for bundling, linting, formatting                      | Built-in bundler, linter, formatter, test runner                         |
| **Created By**        | Ryan Dahl (2009)                                                            | Ryan Dahl (2018)                                                         |
| **Runtime Engine**    | V8 (Google) + C++                                                           | V8 + Rust                                                                |
| **File Extensions**   | Extension optional for JS/TS  

---

## Install Deno

 - For Windows: 
    - Open Windows Powershell & run the below command
        - irm https://deno.land/install.ps1 | iex

    - Check deno installed or not by using
        - deno --version

## Add Deno to System PATH on Windows

    - Step 1: Find Deno Installation Path
        - Deno is typically installed to:
            C:\Users\<YourUsername>\.deno\bin

    - Navigate to that folder and ensure it contains deno.exe

## Add Deno to PATH
    - Press Windows + S, search for Environment Variables, and open "Edit the system environment variables".
    - Click "Environment Variables..." at the bottom.
    - Under "User variables", select Path, then click Edit.
    - Click New, and paste this:
        - C:\Users\<YourUsername>\.deno\bin
    - Replace <YourUsername> with your actual Windows username.
    - Click OK on all dialogs to apply the changes.

## Step 3: Restart Terminal
    - Close any open terminal windows (PowerShell, CMD, etc.), then open a new one, and run:
        - deno --version
    - If it shows the version, you're good to go!

## First Deno Project (Print Hellow World)

    - Create a main.ts/main.js file
    - Code for main.ts file

        function greet(name: string): string {
            return `Hello, ${name}!`;
        }

        console.log(greet("world"));

    - Code for main.js file

        function greet(name) {
            return `Hello, ${name}!`;
        }

        console.log(greet("world"));

## Run the Deno File

    - Run the deno file using 
        - For main.ts file
            - deno main.ts

        - For main .js file
            - deno main.js

## Check Deno Docs & Examples From Here

    - Docs - https://docs.deno.com/runtime/
    - Examples - https://docs.deno.com/examples/

## When To Use (Node & Deno)

    ## ✅ Use Deno If You Want:
        - Built-in TypeScript support without extra config
        - Better security by default
        - Simpler module system (ES modules)
        - Tools like formatter, linter, and bundler included

    ## 🧰 Use Node.js If You Want:
        - Large ecosystem (npm)
        - Mature and widely supported runtime
        - Legacy project support and broader community tools