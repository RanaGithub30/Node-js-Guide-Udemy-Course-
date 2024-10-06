/**
 * Promises are fundamental in handling asynchronous operations in JavaScript, providing a way to execute code asynchronously 
 * and manage the outcome (success or failure) once the operation completes.
*/

let newPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
            let success = true;
            if(success){
                 resolve('Data Successfully Fetched');
            }else{
                 reject('Something wrong is there');
            }        
      }, 2000);
});

// using the promise

newPromise.then((message) => {
    console.log(message);
}).catch((error) => {
    console.log(error);
});