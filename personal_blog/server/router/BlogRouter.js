const express = require('express');
const router = express.Router()
const { db, genid } = require('../db/DbUtils')

// 单条博客
router.get("/detail",async (req,res)=> {
    let { id } = req.query;
    let detail_sql = " select * from `blog` where `id` = ? ";
    let { err,rows } = await db.async.all(detail_sql,[id]);
    if (err == null) {
        res.send({
            code: 200,
            msg: "获取成功",
            rows
        })
    }
    else {
        res.send({
            code: 500,
            msg: "获取失败"
        })
    }
})

// 添加博客
// 传入标题、内容和分类id，然后会根据你的分类id在blog表内添加数据
router.post('/_token/add', async (req, res) => {
    // 对象解构 从req.body中提取title，category_id，content属性
    let { title, category_id, content } = req.body;
    let id = genid.NextId();
    let create_time = new Date().getTime();

    const insertSql = "insert into `blog`(`id`,`title`,`category_id`,`content`,`create_time`) values (?,?,?,?,?)"
    let params = [id, title, category_id, content, create_time];
    // 执行sql插入语句
    let { err, rows } = await db.async.run(insertSql, params)

    if (err == null) {
        res.send({
            code: 200,
            msg: "添加成功",
            rows
        })
    }
    else {
        res.send({
            code: 500,
            msg: "添加失败"
        })
    }

})
// 删除博客 
router.delete('/_token/delete', async (req, res) => {
    let id = req.query.id;
    const deleteSql = "delete from `blog` where `id` = ?";
    let { err, rows } = await db.async.run(deleteSql, [id])

    if (err == null) {
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
// 修改博客
// 传入blog表中要修改的数据的id，要修改的为的标题，要修改为的内容，分类id
// put用于更新（修改）服务器上资源的信息
router.put('/_token/update', async (req, res) => {
    // 对象解构 从req.body中提取id,title，category_id，content属性
    let { id, title, category_id, content } = req.body;
    let create_time = new Date().getTime();

    const updateSql = "update `blog` set `title` = ?,`content` = ?,`category_id` = ? where `id` = ?";
    let params = [title, content, category_id, id];
    // 执行sql插入语句
    let { err, rows } = await db.async.run(updateSql, params)

    if (err == null) {
        res.send({
            code: 200,
            msg: "修改成功",
            rows
        })
    }
    else {
        res.send({
            code: 500,
            msg: "修改失败"
        })
    }

})

//查询博客
// 当然也可以用query传参过去 在地址栏后面?pageSize=xxx&page=xxx&keyword=HTML&category_id=445951700299845
router.get("/search", async (req, res) => {
    /*
        keyword 关键字
        category_id 分类id
        分页：
        page：页码
        pageSize：分页大小,每页显示的数据
    */
    let { keyword, category_id, page, pageSize } = req.query
    // 设置参数默认值
    page = page == null ? 1 : page;
    pageSize = pageSize == null ? 10 : pageSize
    category_id = category_id == null ? 0 : category_id
    keyword = keyword == null ? "" : keyword

    let params = [];
    let whereSqls = [];
    if (category_id != 0) {
        whereSqls.push(" `category_id` = ? ")
        params.push(category_id)
    }

    if (keyword != "") {
        // 模糊查询
        whereSqls.push(" (`title` LIKE ? OR `content` LIKE ?) ")
        params.push("%" + keyword + "%")
        params.push("%" + keyword + "%")
    }

    let whereSqlStr = ""
    if (whereSqls.length > 0) {
        whereSqlStr = " WHERE " + whereSqls.join(" AND ")
    }
    // [" `category_id`=? "," `title` like ? or `content` like ? "] 假设有两个参数
    // 就会拼接成 where `category_id`=? and `title` like ? or `content` like ? 如果只有一个参数，就不会拼接

    // 将所有sql语句 拼装 查分页数据
    // 这样内容就不会全部数据都传过来了  substr(`content`,0,50) AS `content`
    let searchSql = " SELECT `id`,`category_id`,`create_time`,`title`,substr(`content`,0,50) AS `content` FROM `blog` " + whereSqlStr + " ORDER BY `create_time` DESC LIMIT ?,? "
    // 这个是limit限制参数  
    // 如果我传入1,10  那么limit的参数就是0,10  通过sql语法可知，从0条开始往后查十条刚好是第一页数据
    // 2,10  limit参数是10,10 从第10条开始往后查十条数据
    // 3,5 limit参数是10,5  从第十条开始往后查5条数据
    let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize])

    //查询符合条件的数据总数 205条 21页
    let searchCountSql = " SELECT count(*) AS `count` FROM `blog` " + whereSqlStr;
    let searchCountParams = params;

    //分页数据 
    let searchResult = await db.async.all(searchSql, searchSqlParams)
    let countResult = await db.async.all(searchCountSql, searchCountParams)

    console.log(searchSql, countResult);
    // 返回给前端数据
    if (searchResult.err == null && countResult.err == null) {
        res.send({
            code: 200,
            msg: "查询成功",
            data: {
                keyword,
                category_id,
                page,
                pageSize,
                rows: searchResult.rows,
                // 这里count是上面的searchCountSql起的别名
                count: countResult.rows[0].count
            }
        })

    } else {
        res.send({
            code: 500,
            msg: "查询失败",
        })
    }

})

module.exports = router;

