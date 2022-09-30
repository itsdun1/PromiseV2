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

    resolve(result) {
            if (result instanceof PromiseV2) {
                result.then(this.bindedResolve, this.bindedReject)
              return
            }
      
            this.value = result
            this.state = STATE.FULFILLED
            this.runCallbacks()
    }

    reject(result) {
        this.value = result;
        this.state = STATE.REJECTED;
        this.runCallbacks()
    }

    static resolvePromise(value) {
      return new Promise((resolve, reject) => {
        resolve(value)
      })
    }
  
    static rejectPromise(value) {
      return new Promise((resolve, reject) => {
        reject(value)
      })
    }


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




module.exports = PromiseV2;
