const express = require('express');
const router = express.Router();
// 引入node.js内置fs(文件系统)模块，用于处理文件和目录
const fs = require('fs')
const { db, genid } = require('../db/DbUtils')

// 为了处理富文本编辑器wangeditor创建的路由 处理文件上传
router.post('/rich_editor_upload', async (req, res) => {
    // 判断是否有文件
    if (!req.files) {
        res.send({
            "error": 1,  //只要不等于0就行
            "message": "失败信息"
        })
        return;
    }
    // req.files 处理文件上传时，用于访问上传文件信息的对象
    let files = req.files;
    // 保存处理后的文件路径。
    let ret_files = [];

    for (let file of files) {
        // 获取文件后缀名
        let file_ext = file.originalname.substring(file.originalname.lastIndexOf(".") + 1);
        //随机文件名
        let file_name = genid.NextId() + "." + file_ext;
        //fs.renameSync(oldPath, newPath, callback)`: 同步地将文件重命名或将文件从一个位置移动到另一个位置
        fs.renameSync(
            process.cwd() + "/public/upload/temp/" + file.filename,
            process.cwd() + "/public/upload/" + file_name
        )
        ret_files.push("/upload/" + file_name);
    }

    res.send({
        "errno": 0, // 注意：值是数字，不能是字符串
        "data": {
            // 每次都只有一张图片
            "url": ret_files[0], // 图片 src ，必须
        }
    })

})

module.exports = router;

