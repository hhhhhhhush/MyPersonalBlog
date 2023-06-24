const sqlite3 = require('sqlite3').verbose();
const path = require('path');
// 引入雪花id
const GenId = require('../utils/SnowFlake');

var db = new sqlite3.Database(path.join(__dirname,"blog.sqlite3"))
// WorkerId表示工作节点的唯一标识符，用于区分不同的节点
// 1. `const genid`创建了一个名为`genid`的常量，用于存储生成的雪花ID。
// 2. `new GenId({WorkerId:1})`通过使用`new`关键字来实例化一个`GenId`对象。
// 花括号中的`WorkerId:1`表示一个包含单个属性`WorkerId`的对象，属性值为1。
// 这里将`WorkerId`设置为1，指定了当前实例的工作节点ID。
// 3. 执行`new GenId({WorkerId:1})`将创建一个具有指定工作节点ID的雪花ID生成器实例。
// 总之，这句代码的目的是使用指定的工作节点ID创建一个雪花ID生成器实例，并将该实例赋值给`genid`变量。你可以使用`genid`对象调用相关方法来生成唯一的雪花ID。
const genid = new GenId({WorkerId:1})

// 给db对象添加了async属性来存储异步操作方法
db.async = {}
// promise封装all和run方法
db.async.all = (sql,params) =>{
    // resolve 是一个函数，用于实现 Promise，并将其状态从 pending（进行中）变为 fulfilled（已成功）。
    // 它接受一个参数，表示 Promise 的成功结果或值。当你调用 resolve(value) 时，Promise 将以提供的值成功解决。
    // reject 是一个函数，用于拒绝 Promise，并将其状态从 pending（进行中）变为 rejected（已失败）。
    // 它接受一个参数，表示 Promise 被拒绝的原因或错误。当你调用 reject(reason) 时，Promise 将以提供的原因被拒绝
    return new Promise((resolve,reject)=>{
        db.all(sql,params,(err,rows)=>{
            resolve({err,rows})
        })
    })
}
db.async.run = (sql,params) =>{
    return new Promise((resolve,reject)=>{
        db.run(sql,params,(err,rows)=>{
            resolve({err,rows})
        })
    })
}

module.exports = {db,genid}




