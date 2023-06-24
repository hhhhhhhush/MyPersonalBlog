const express = require('express');
const router = express.Router()
const { db, genid } = require('../db/DbUtils')

// 允许函数异步执行
router.get('/test',async (req, res) => {
    // db.all("select * from `admin`", [], (err, rows) => {
    //     console.log(rows);
    // });

    // db.async.all("select * from `admin`",[]).then((res)=> {
    //     console.log(res);
    // })

    // 异步接收，这样写法更简洁
    // let out = await db.async.all("select * from `admin`",[]);

    res.send({
        id: genid.NextId(),
        // 属性名和属性值一样可以只写一个属性名
        // out
    });

    // res.send("hello world")
});

module.exports = router;

