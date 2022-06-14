interface Callback {
    onFulfilled: Function | null,
    onRejected: Function | null,
    resolve: Function,
    reject: Function
}

class MyPromise {
    callbacks: Array<Callback> = [];
    state: string = 'pending';
    value: any = null;
    constructor(fn: Function) {
        fn(this._resolve.bind(this), this._reject.bind(this))
    }

    then(onFulfilled: Function | null, onRejected: Function | null) {
        return new MyPromise((resolve: Function, reject: Function) => {
            this._handle({
                onFulfilled: onFulfilled || null,
                onRejected: onRejected || null,
                resolve: resolve,
                reject: reject
            })
        })
    }

    _handle(callback: Callback) {
        if (this.state === 'pending') {
            this.callbacks.push(callback)
            return
        }

        let cb = this.state === 'fulfilled' ? callback.onFulfilled : callback.onRejected

        if (!cb) {
            cb = this.state === 'fulfilled' ? callback.resolve : callback.reject
            cb(this.value)
            return
        }

        let ret

        try {
            ret = cb(this.value)
            cb = this.state === 'fulfilled' ? callback.resolve : callback.reject
        } catch (error: any) {
            ret = error
            cb = callback.reject
        } finally {
            cb(ret)
        }
    }

    _resolve(value: any) {
        if (value && (typeof value === 'object' || typeof value === 'function')) {
            var then = value.then
            if (typeof then === 'function') {
                then.call(value, this._resolve.bind(this), this._reject.bind(this))
                return
            }
        }
        this.state = 'fulfilled'
        this.value = value
        this.callbacks.forEach((callback: Callback) => this._handle(callback))
    }

    _reject(error: any) {
        this.state = 'rejected'
        this.value = error
        this.callbacks.forEach((callback: Callback) => this._handle(callback))
    }

    catch(onError: any) {
        return this.then(null, onError)
    }

    finally(onDone: any) {
        return this.then(onDone, onDone)
    }

    static resolve(value: any) {
        if (value && value instanceof MyPromise) {
            return value
        } else if (value && typeof value === 'object' && typeof value.then === 'function') {
            let then = value.then
            return new MyPromise((resolve: Function) => {
                then(resolve)
            })
        } else if (value) {
            return new MyPromise((resolve: Function) => resolve(value))
        } else {
            return new MyPromise((resolve: Function) => resolve())
        }
    }

    static reject(value: any) {
        if (value && typeof value === 'object' && typeof value.then === 'function') {
            let then = value.then;
            return new MyPromise((resolve:Function, reject: Function) => {
                then(reject)
            })
        } else {
            return new MyPromise((resolve: Function, reject: Function) => reject(value))
        }
    }

    static all(promises:Array<MyPromise>){
        return new MyPromise((resolve:Function,reject:Function)=>{
            let fulfilledCount=0
            const itemNum=promises.length
            const rets=Array.from({length:itemNum})
            promises.forEach((promise:MyPromise,index:number)=>{
                MyPromise.resolve(promise).then((result:MyPromise)=>{
                    fulfilledCount++
                    rets[index]=result
                    if(fulfilledCount===itemNum){
                        resolve(rets)
                    }
                },(reason:any)=>reject(reason))
            })
        })
    }

    static race(promises:Array<MyPromise>){
        return new Promise(function(resolve:Function,reject:Function){
            for(let i=0;i<promises.length;i++){
                Promise.resolve(promises[i]).then(function(value:any){
                    return resolve(value)
                }),function(reason:any){
                    return reject(reason)
                }
            }
        })
    }
}

export default MyPromise