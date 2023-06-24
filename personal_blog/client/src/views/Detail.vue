<template>
    <div class="bigBox">
        <div>
            <n-button @click="back" class="back">返回</n-button>
        </div>
        <div class="container">

            <!-- 标题 -->
            <n-h1>
                {{ blogInfo.title }}
            </n-h1>
            <!-- 文章内容 -->
            <div class="blog-content">
                <!-- 要让内容解析html标签 -->
                <div v-html="blogInfo.content"></div>
            </div>
        </div>
        <div class="asideBox">
            <div class="asideOne">
                <img src="https://static.oschina.net/uploads/cooperation/news_detail_right_sidebar_1_oXkVu.jpeg" alt="">
            </div>
            <div class="asideTwo">
                <nav style="font-size: 16px;">精彩专栏</nav>
                <div class="as1">
                    <div class="top">高手问答</div>
                    <p>如何快速编写出高质量的 Go 应用程序？</p>
                    <p>PCIE 7.0 规范发布首个审查草案</p>
                    <p>Dubbo负载均衡策略之 一致性哈希 | 京东云技术团队</p>
                </div>
                <div class="as2">
                    <div class="top">软件快讯</div>
                    <p>MyBatis 的多表关联查询原来可以这么优雅，MyBatis-Flex v1.4.0 发布</p>
                    <p>layui-vue v2.3.1 发布，一个 Vue 3 UI 框架</p>
                    <p>开源接口测试工具 atest 发布 v0.0.12</p>
                </div>
                <div class="as3">
                    <div class="top">一周热点</div>
                    <p>【一周】Go泛型要来了 | iPhone上刷Ubuntu | Linus把if改为while | 黑客把贞操锁锁了</p>
                    <p>【一周】CentOS重开</p>
                    <p>【一周】3月各大排行榜公布，Dart要火、Delphi没落 | 多个项目大版本更新 </p>
                </div>
            </div>
            <div class="asideThree">
                <div>联系方式</div>
                <div>
                    <img src="../images/contact.png" alt="">
                </div>
            </div>
        </div>
    </div>  
</template>

<script setup>
import { ref, reactive, inject, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter();
const route = useRoute();

// 注入axios
const axios = inject("axios");

// 定义一个空对象存放博客相关信息
const blogInfo = ref({})

onMounted(() => {
    loadBlog();
    window.scrollTo(0, 0);
})

const loadBlog = async () => {
    // 拿到url中的id 可以打印一下这个对象有哪些属性，可以拿到id
    // console.log(route)
    let res = await axios.get("/blog/detail?id=" + route.query.id);
    blogInfo.value = res.data.rows[0];
    console.log(res.data.rows);
}

const back = () => {
    router.push("/");
}
</script>

<style>
.blog-content img {
    max-width: 100% !important;
}
</style>


<style scoped>
.bigBox {
    width: 100%;
    display: flex;
    background-color: #f3f3f3;
}

.container {
    width: 1200px;
    margin: 50px 0 0 60px;
    border: 1px solid #f3f3f3;
    padding: 30px;
    box-shadow: 3px 3px 3px rgba(0, 0, 0, .3);
    background-color: #fff;
}

.back {
    margin-top: 50px;
    margin-left: 60px;
    background-color: #fff;
}

.asideBox {
    width: 320px;
}
.asideOne {
    width: 300px;
    height: 300px;
    margin-left: 60px;
    margin-top: 50px;
}

.asideOne img {
    width: 100%;
    height: 100%;
}

.asideTwo {
    width: 300px;
    margin-left: 60px;
    margin-top: 50px;
    padding: 30px;
    box-sizing: border-box;
    border-radius: 6px;
    border: 1px solid #f3f3f3;
    box-shadow: 1px 2px 2px #ccc;
    background-color: #fff;
}

.asideTwo nav {
    padding-bottom: 6px;
    border-bottom: 1px solid #ccc;
}

.asideTwo>div {
    margin-top: 14px;
}

.asideTwo p {
    height: 40px;
    padding: 16px;
    box-sizing: border-box;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.asideTwo .as1 {
    border: 1px solid #56B978;
    border-radius: 6px;
}

.asideTwo .as2 {
    border: 1px solid #6A53B8;
    border-radius: 6px;
}

.asideTwo .as3 {
    border: 1px solid #B85C54;
    border-radius: 6px;
}

.asideTwo .as1 .top {
    height: 40px;
    padding-left: 12px;
    background-image: url(../images/as1.webp);
    border-radius: 6px 6px 0 0;
    overflow: hidden;
    line-height: 40px;
    font-weight: bold;
    color: white;
    font-size: 17px;
}

.asideTwo .as2 .top {
    height: 40px;
    padding-left: 12px;
    background-image: url(../images/as2.webp);
    border-radius: 6px 6px 0 0;
    overflow: hidden;
    line-height: 40px;
    font-weight: bold;
    color: white;
    font-size: 17px;
}

.asideTwo .as3 .top {
    height: 40px;
    padding-left: 12px;
    background-image: url(../images/as3.webp);
    border-radius: 6px 6px 0 0;
    overflow: hidden;
    line-height: 40px;
    font-weight: bold;
    color: white;
    font-size: 17px;
}

.asideThree {
    width: 300px;
    height: 140px;
    margin-left: 60px;
    margin-top: 50px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border: 1px solid #ccc;
    border-radius: 6px;
    background-color: #fff;
}

.asideThree>div:first-child {
    font-size: 20px;
    font-weight: bold;
    background-image: linear-gradient(to right, #ff0000, #00ff00);
    -webkit-background-clip: text;
    color: transparent;
}

.asideThree img {
    width: 100px;
    height: 100px;
}
</style>