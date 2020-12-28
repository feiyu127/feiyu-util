
/**
 * Promise 线程池工具类
 * 主要用于使用node进行一些批量操作时，限制同时进行的任务数
 * 
 * 接收参数
 * 1. max : 同时进行的最大任务数量
 * 2. callback : 所有任务完成后执行的方法
 * 使用方法：
 *  const { PromisePool }  = require('./PromisePool')
    let sleep = (millsSeconds) => new Promise(resolve => { setTimeout(resolve, millsSeconds); })
    let pool = new PromisePool(3, ()=>{
        console.log('finish');
    })
    let taskParamArray = [1,2,3,4,5,6];
    for(let i = 0; i < taskParamArray.length; i++){
        pool.addTask(null, async (param) => {
            console.log(`${param} start`);
            await sleep(param*1000);
            console.log(`${param} end`);
        }, taskParamArray[i]);
    }
    pool.addTaskEnd();
 * 
 */
class PromisePool {

    constructor(max = 10, callback = () => { }) {
        this._max = max;
        this._count = 0;
        this._taskQueue = [];
        this._addEnd = false;
        this._callback = callback;
    }
    /**
     * 添加任务到线程池，最终执行会是
     * target.caller(args) 这样的方式执行
     * 
     * @param  target 方法执行的对象
     * @param {function} caller 方法体
     * @param  {...any} args 方法参数
     */
    addTask(target, caller, ...args) {
        return new Promise((resolve, reject) => {
            const _task = this._addTask(target, caller, args, resolve, reject);
            if (this._count >= this._max) {
                this._taskQueue.push(_task);
            } else {
                _task();
            }
        });
    }
    addTaskEnd() {
        this._addEnd = true;
    }

    /**
     * 返回一个匿名方法，方法内异步执行函数
     * 
     * @param {*} caller 执行的方法
     * @param {*} args 执行的方法参数
     * @param {*} resolve 
     * @param {*} reject 
     */
    _addTask(target, caller, args, resolve, reject) {
        return () => {
            Promise.resolve(caller.call(target, ...args))
                .then(resolve)
                .catch(reject)
                .finally(() => {
                    this._count--;
                    if (this._taskQueue.length > 0) {
                        let _task = this._taskQueue.shift();
                        _task();
                    }
                    if (this._addEnd && this._count <= 0 && this._taskQueue.length === 0) {
                        this._callback();
                    }
                });
            this._count++;
        }
    }
}

/**
 * 将数据集合 添加到PromisePool 执行
 * 其中 dataHanle是处理集合中的数据，接收参数为单个数据
 * finalFunc 为全部完成后执行的方法
 * 
 * @param {数据集合} dataList 
 * @param {对每个数据进行的处理} dataHandle 
 * @param {最终的数据处理} finalFunc 
 */
function addTaskToPromisePool(dataList, dataHandle, finalFunc = () => { }) {
    let pool = new PromisePool(4, finalFunc)
    for (const data of dataList) {
        pool.addTask(null, dataHandle, data);
    }
    pool.addTaskEnd();
}

module.exports = {
    PromisePool,
    addTaskToPromisePool
}