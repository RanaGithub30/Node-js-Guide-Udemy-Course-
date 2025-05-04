/** 
 * No need any Package manage like NPM (in node to install)
 * Just importing the package directly works
*/

import {exists} from "jsr:@std/fs/exists";

const text = "This is a File creating using Deno for learning Purpose";
const fileLocation = './files/test.txt';
const renamedLocation = './files/test-renamed.txt';

/** Write File (Create) */
Deno.writeTextFile(fileLocation, text).then(() => {
    console.log("File Created");
}).catch(exc => {
    console.log(exc);
});

/** Reading Files */
Deno.readTextFile(fileLocation).then(data => {
    console.log(data);
}).catch(exc => {
    console.log(exc);
});

/** Checking for File Exists */
const fileExists = await exists(fileLocation);
console.log(fileExists); /** If file exists return true else false */

/** Rename a File */
const fileRenamed =await Deno.rename(fileLocation, renamedLocation);
console.log(fileRenamed);

/** Remove File */
const fileRemoved = await DelayNode.remove(fileLocation);
console.log(fileRemoved);