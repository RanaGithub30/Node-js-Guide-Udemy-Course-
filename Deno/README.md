## Introduction to Deno

    - Deno is a secure, modern runtime for JavaScript and TypeScript, built on V8 and Rust. 
    - It was created by Ryan Dahl, the creator of Node.js, with the goal of addressing some of Node.js's shortcomings. 
    - Deno aims to provide a more secure, efficient, and developer-friendly experience for JavaScript and TypeScript development. 

----

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