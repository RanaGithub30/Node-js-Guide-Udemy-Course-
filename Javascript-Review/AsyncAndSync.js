setTimeout(() => {
    console.log('This is Async. code, which take few seconds to execute');
}, 2000);

console.log('This is Sync. code, which does not wait for above code to be executed');