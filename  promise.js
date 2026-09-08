function syncOrAsync() {
    // return sync or async value randomly
    return Math.random() > 0.5 ? Promise.resolve('resolved in async') : 'resolved in sync';  
}

// syncOrAsync().then(console.log).catch(console.error);

// Promise.resolve().then(syncOrAsync).then(console.log).catch(console.error);

Promise.resolve(syncOrAsync()).then(console.log).catch(console.error);
