const STATE = {
    FULFILLED: "fulfilled",
    REJECTED: "rejected",
    PENDING: "pending",
  }

class PromiseV2 {
    
    state = STATE.PENDING;
    value;
    bindedResolve = this.resolve.bind(this);
    bindedReject = this.reject.bind(this);
    thenCallbacks = [];
    catchCallbacks = [];


    constructor(cb) {
        try {
            cb(this.bindedResolve, this.bindedReject);
        } catch (err) {
            this.reject(err);
        }
    }
    
    //Called after resolving promise

    resolve(result) {
            if (result instanceof PromiseV2) {
                result.then(this.bindedResolve, this.bindedReject)
              return
            }
      
            this.value = result
            this.state = STATE.FULFILLED
            this.runCallbacks()
    }

    
    //called after reject in promise
    reject(result) {
       
        
        if (value instanceof MyPromise) {
          value.then(this.#onSuccessBind, this.#onFailBind)
          return
        } 
        
        this.value = result;
        this.state = STATE.REJECTED;
        this.runCallbacks()
    }
    //  Static method same as Promose.resolve()
    static resolvePromise(value) {
      return new Promise((resolve, reject) => {
        resolve(value)
      })
    }
  
    //  Static method same as Promose.reject()

    static rejectPromise(value) {
      return new Promise((resolve, reject) => {
        reject(value)
      })
    }

    // called after .then, handled .then .catch chains
    then(thenCb, catchCb) {
        return new PromiseV2((resolve, reject) => {
          this.thenCallbacks.push(result => {
            if (thenCb == null) {
              resolve(result)
              return
            }
    
            try {
              resolve(thenCb(result))
            } catch (error) {
              reject(error)
            }
          })
    
          this.catchCallbacks.push(result => {
            if (catchCb == null) {
              reject(result)
              return
            }
    
            try {
              resolve(catchCb(result))
            } catch (error) {
              reject(error)
            }
          })
    
          this.runCallbacks()
        })
      }

    catch(cb) {
        return this.then(undefined, cb)
    }
    
    
    //run all callbacks if multiple .then on single promise

    runCallbacks() {
        if (this.state === STATE.FULFILLED) {
          this.thenCallbacks.forEach(callback => {
            callback(this.value)
          })
    
          this.thenCallbacks = []
        }
    
        if (this.state === STATE.REJECTED) {
          this.catchCallbacks.forEach(callback => {
            callback(this.value)
          })
    
          this.catchCallbacks = []
        }
      }

      finally(cb) {
        return this.then(
          result => {
            cb()
            return result
          }
        )
      }

    //static all same as Promise.all()
      static all(promises) {
        return new PromiseV2((resolve, reject) => {
            let count = 0;
            let results = [];
            for(let i = 0; i <promises.length; i++) {
                promises[i].then(b => {
                    results[i] = b;
                    count++;

                    if(count == promises.length) {
                        resolve(results);
                    }
                })
                .catch(err => {
                    reject(err);
                })
            }
        })
      }
  
}




// function main () {
//     return new PromiseV2(function(resolve, reject) {
//     setTimeout(function() {
//       console.log('1st block');
//       return resolve();
//     }, Math.random() * 1000);
//     })
//     .then(function() {
//         return new PromiseV2(function(resolve, reject) {
//           setTimeout(function() {
//             console.log('2nd block');
//             return resolve();
//           }, Math.random() * 1000);
//         });
//       })
//       .then(function() {
//         return new PromiseV2(function(resolve, reject) {
//           setTimeout(function() {
//             console.log('3rd block');
//             return resolve();
//           }, Math.random() * 1000);
//         });
//       })
//       .then(function() {
//         return new PromiseV2(function(resolve, reject) {
//           setTimeout(function() {
//             console.log('4th block');
//             return resolve();
//           }, Math.random() * 1000);
//         });
//       })
//       .then(function() {
//         return new PromiseV2(function(resolve, reject) {
//           setTimeout(function() {
//             console.log('5th block');
//             return resolve();
//           }, Math.random() * 1000);
//         });
//       })
//       .catch(function(err) {
//         console.log(err);
//         console.error('Oh no! There is an error caught by the catch block');
//       });
// }
// main();




module.exports = PromiseV2;
