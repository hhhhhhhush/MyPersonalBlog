const express = require('express')
const multer = require('multer')
const path = require('path')
const app = express();
const { db } = require('./db/DbUtils')
const port = 3030;

// 开放跨域请求
app.use(function (req, res, next) {
    //设置允许跨域的域名，*代表允许任意域名跨域
    res.header("Access-Control-Allow-Origin", "*");
    //允许的header类型
    res.header("Access-Control-Allow-Headers", "*");
    // //跨域允许的请求方式
    res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
    if (req.method == "OPTIONS") res.sendStatus(200); //让options尝试请求快速结束
    else next();
});

// json中间件 express.json()中间件来解析请求体中的JSON数据
app.use(express.json())

// 使用multer中间件，将文件上传到临时目录中 允许任何文件上传
const update = multer({
    dest: './public/upload/temp'
})
app.use(update.any())

// 指定静态资源文件路径
app.use(express.static(path.join(__dirname, "public")))


// 注册路由 使用路由中间件
app.use('/test', require('./router/TestRouter'))
app.use('/admin', require('./router/AdminRouter'))
app.use("/category", require('./router/CategoryRouter'))
app.use('/blog', require('./router/BlogRouter'))
app.use('/upload', require('./router/UploadRouter'))

// 定义中间件token验证
const ADMIN_TOKEN_PATH = '/_token';

// await接口需要async 如果找到路径中有token的 就校验请求头的token 哪个接口需要验证token就在路径中加上/_token
app.all("*", async (req, res, next) => {
    if (req.path.indexOf(ADMIN_TOKEN_PATH) > -1) {
        let { token } = req.headers;
        console.log(token)
        let admin_token_sql = " select * from `admin` where `token` = ? ";
        let adminResult = await db.async.all(admin_token_sql, [token]);
        if (adminResult.err != null || adminResult.rows.length == 0) {
            res.send({
                code: 403,
                msg: "请先登录!"
            })
            return;
        }
        else {
            next();
        }
    }
    else {
        next();
    }
})


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


app.listen(port, () => {
    console.log(`server is start on http://localhost:${port}`)
})


// 这段代码的功能是创建一个具有跨域支持和文件上传功能的Express服务器，监听3030端口