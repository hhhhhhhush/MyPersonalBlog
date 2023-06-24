const express = require('express');
const router = express.Router()
const { db, genid } = require('../db/DbUtils')

// 添加接口
router.post('/_token/add', async (req, res) => {
    // 从req.body对象中提取name属性 name是前端发送的，id是雪花id自动生成的
    let { name } = req.body;
    const insertSql = "insert into `category` (`id`,`name`) values (?,?)";
    // 从 await db.async.run(insertSql, [genid.NextId(), name]) 返回的对象中提取了 err 和 rows 属性，并将它们分别赋值给同名的变量 err 和 rows
    let { err, rows } = await db.async.run(insertSql, [genid.NextId(), name])

    if (err == null) {
        res.send({
            code: 200,
            msg: "添加成功"
        })
    }
    else {
        res.send({
            code: 500,
            msg: "添加失败"
        })
    }   
})
// 删除接口  /category/delete?id=xxx
//demo http://localhost:3030/category/delete?id=445950488932421

router.delete('/_token/delete', async (req, res) => {
    let id = req.query.id;
    const deleteSql = "delete from `category` where `id` = ?";
    let { err, rows } = await db.async.run(deleteSql, [id])

    if (err == null ) {
        res.send({
            code: 200,
            msg: "删除成功"
        })
    }
    else {
        res.send({
            code: 500,
            msg: "删除失败"
        })
    }
})
// 修改接口
router.put('/_token/update', async (req, res) => {
    // 加入token验证 一旦重新登录，token就会失效，需要去数据库重新获取token
    // let token = req.headers.token;
    // 用解构的方法，少写一个token 
    // let { token } = req.headers;
    // console.log(token)

    // let admin_token_sql = " select * from `admin` where `token` = ? ";
    // let adminResult = await db.async.all(admin_token_sql, [token]);
    // if (adminResult.err != null || adminResult.rows.length == 0) {
    //     res.send({
    //         code: 403,
    //         msg: "请先登录!"
    //     })
    //     return;
    // }

    // 从req.body对象中提取name属性
    let { id, name } = req.body;
    const updateSql = "update `category` set `name` = ? where `id` =  ?";
    // 从 await db.async.run(insertSql, [genid.NextId(), name]) 返回的对象中提取了 err 和 rows 属性，并将它们分别赋值给同名的变量 err 和 rows
    let { err, rows } = await db.async.run(updateSql, [name, id])

    if (err == null) {
        res.send({
            code: 200,
            msg: "修改成功"
        })
    }
    else {
        res.send({
            code: 500,
            msg: "修改失败"
        })
    }
})
// 查询列表接口
router.get('/list', async (req, res) => {
    const searchSql = "select * from `category`";
    let { err, rows } = await db.async.all(searchSql, [])
    if (err == null) {
        res.send({
            code: 200,
            msg: "查询成功",
            rows
        })
    }
    else {
        res.send({
            code: 500,
            msg: "查询失败"
        })
    }
})



module.exports = router;

