<template>
    <div>
        <div class="indfirst">
            <header>博客 - Mzz's Personal Blog</header>
            <div class="indbox">
                <aside class="personalInfo">
                    <section class="headerImg">
                        <img src="../images/headerImg.png" alt="">
                    </section>
                    <p class="signature">脚下虽有万水千山，但行者必至。</p>
                    <p class="technology">
                        <span>技术栈：Express + Vue3</span><br>
                        <span>框架：Naive UI + Wangeditor</span><br>
                        <span>数据库：sqlite3</span><br>
                        <span>接口测试：Apifox</span>
                    </p>
                    <hr>
                    <section class="contact">
                        <span>
                            <a href="https://github.com/hhhhhhhush" target="_blank">
                                <img src="../images/github.png" alt="">
                            </a>
                            <p>Github</p>
                        </span>
                        <span>
                            <a href="https://space.bilibili.com/330154021" target="_blank">
                                <img src="../images/bilibili.png" alt="">
                            </a>
                            <p>Bilibili</p>
                        </span>
                        <span>
                            <a href="mailto:i@naccl.top" target="_blank">
                                <img src="../images/email.png" alt="">
                            </a>
                            <p>Email</p>
                        </span>
                    </section>
                    <hr>
                </aside>
                <main>
                    <img src="../images/cover.jpg" alt="">
                    <section id="clock">
                        <article class="dateOne">
                            <div class="hours">{{ dateInfo.hours }}</div>
                            <span>:</span>
                            <div class="minutes">{{ dateInfo.minutes }}</div>
                            <span>:</span>
                            <div class="seconds">{{ dateInfo.seconds }}</div>
                        </article>
                        <article class="dateTwo">
                            <div class="year">{{ dateInfo.year }}</div>
                            <span>年</span>
                            <div class="month">{{ dateInfo.month }}</div>
                            <span>月</span>
                            <div class="day">{{ dateInfo.day }}</div>
                            <span>日</span>
                        </article>
                    </section>
                </main>

                <aside class="tag">
                    <nav><img src="../images/24gf-tags.png" alt="">标签云</nav>
                    <section class="tags">
                        <span v-for="(tag, index) in tags" :style="{ backgroundColor: tag.backgroundColor }">
                            {{ tag.content }}
                        </span>
                    </section>
                </aside>
            </div>
        </div>
        <div class="container_box">
            <div class="container">
                <div class="nav">
                    <div @click="homePage">首页</div>
                    <div>
                        <!-- 值更新有一个回调函数来改变分类  @update:value="searchByCategory" -->
                        <!-- 封装了一个函数 分类切换时触发 -->
                        <n-popselect @update:value="searchByCategory" v-model:value="selectedCategory"
                            :options="categoryOptions" trigger="click">
                            <div>分类<span>{{ categoryName }}</span></div>
                        </n-popselect>
                    </div>
                    <div @click="dashboard">后台</div>
                </div>
                <n-divider />

                <!-- 查询框 -->
                <n-space class="search">
                    <!-- 这个方法会默认把keyword拿进去，然后调用搜索 -->
                    <n-input v-model:value="pageInfo.keyword" :style="{ width: '500px' }" placeholder="请输入关键字"
                        @keyup.enter="loadBlogs(0)" style="border-radius: 12px;" />
                    <!-- 传一个默认值，因为前面page有值传过去了，会造成影响 -->
                    <n-button type="primary" ghost @click="loadBlogs(0)" style="border-radius: 8px;"> 搜索 </n-button>
                </n-space>

                <div v-for="(blog, index) in blogListInfo" style="margin-bottom:15px; cursor:pointer; position:relative;">
                    <!-- 跳转到详情页 将单击的文章相关信息传进去-->
                    <n-card :title="blog.title" @click="toDetail(blog)" class="ncards">
                        {{ blog.content }}

                        <template #footer>
                            <n-space align="center">
                                <div>发布时间:{{ blog.create_time }}</div>
                            </n-space>
                        </template>

                        <div class="content_img">
                            <img src="../images/新闻.png" alt="" />
                        </div>
                    </n-card>
                </div>

                <n-pagination @update:page="loadBlogs" v-model:page="pageInfo.page" :page-count="pageInfo.pageCount" />

                <n-divider />
                <aside class="left_cardsOne">
                    <div class="sides">
                        <img src="../images/公告.png" alt="">
                        <p style="margin-left: 4px;">公告</p>
                    </div>
                    <p>功能增加: 样式优化、留言、音乐、侧边栏、富文本插件优化</p>
                </aside>
                <aside class="left_cardsTwo">
                    <div class="sides">
                        <img src="../images/资讯.png" alt="">
                        <p style="margin-left: 4px;">资讯</p>
                    </div>
                    <div>
                        <p>文章数目: <span>{{ pageInfo.count }}</span></p>
                        <p>运行时间: <span>{{ Today }}天</span></p>
                        <p>博客访问次数: <span>456</span></p>
                    </div>
                </aside>
                <div class="footer">
                    <div>Power by XXXX</div>
                    <div>XICP备XXXX号-1</div>
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

const axios = inject('axios');

const selectedCategory = ref(0);
// 分类选项
const categoryOptions = ref([]);
const blogListInfo = ref([]);

const tags = ref([
    { content: "HTML", backgroundColor: '#db9a9a' },
    { content: "CSS", backgroundColor: '#a768c4' },
    { content: "JavaScript", backgroundColor: '#4a1164' },
    { content: "Vue3", backgroundColor: '#5c71c7' },
    { content: "Java", backgroundColor: '#123ff3' },
    { content: "MySQL", backgroundColor: '#30e8b1' },
    { content: "sqlite3", backgroundColor: '#148563' },
    { content: "Python", backgroundColor: '#9334c5' },
    { content: "Node.js", backgroundColor: '#4eda99' },
    { content: "Express", backgroundColor: '#39d043' },
    { content: "Redis", backgroundColor: '#2f7b8e' },
    { content: "Element UI", backgroundColor: '#babc38' },
    { content: "算法", backgroundColor: '#e7ea1f' },
    { content: "Springboot", backgroundColor: '#d28d4b' },
    { content: "数据结构", backgroundColor: '#2c1c0c' },
    { content: "操作系统", backgroundColor: '#f07070' },
    { content: "Nginx", backgroundColor: '#f42525' },
    { content: "Linux", backgroundColor: '#662e2e' },
    { content: "PHP", backgroundColor: '#5a7db5' },
    { content: "MariaDB", backgroundColor: '#072b64' },
    { content: "Github", backgroundColor: '#2e8e35' },
    { content: "Gitee", backgroundColor: '#dd78b3' },
    { content: "二叉树", backgroundColor: '#381e94' },
    { content: "网络编程", backgroundColor: '#53b5d5' },
    { content: "Typora", backgroundColor: '#4eda99' },
    { content: "阿里云", backgroundColor: '#a768c4' },
    { content: "Shell", backgroundColor: '#d28d4b' },
    { content: "XXS", backgroundColor: '#123ff3' },
    { content: "jQuery", backgroundColor: '#53b5d5' },
])

// 分页信息
const pageInfo = reactive({
    page: 1, //起始页码默认第一页
    pageSize: 3,  //每页三条博客 自己定义
    pageCount: 0, //总页数
    count: 0, //后台博客总数
    keyword: "",
    category_id: 0
})


onMounted(() => {
    loadCategorys();
    loadBlogs();
    updateClock();
    updateCounter();
})

// 加载所有博客
const loadBlogs = async (page = 0) => {
    if (page != 0) {
        pageInfo.page = page;
    }
    let res = await axios.get(`/blog/search?keyword=${pageInfo.keyword}&page=${pageInfo.page}&pageSize=${pageInfo.pageSize}&category_id=${pageInfo.category_id}`);
    // 对数据进行省略号处理以及时间戳的处理 
    let temp_rows = res.data.data.rows;
    for (let row of temp_rows) {
        row.content += "...";
        // 将时间戳传进去   
        let d = new Date(row.create_time);
        row.create_time = `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
    }
    // 给vue3响应式数据赋值需要.value属性值
    blogListInfo.value = temp_rows;
    // 后台博客总条数
    pageInfo.count = res.data.data.count;
    // 总页码数
    pageInfo.pageCount = Math.ceil(pageInfo.count / pageInfo.pageSize)

    console.log(res)
}

const categoryName = computed(() => {
    //获取选中的分类
    let selectedOption = categoryOptions.value.find((option) => { return option.value == selectedCategory.value })
    //返回分类的名称
    return selectedOption ? selectedOption.label : ""
})

// 获取分类列表
const loadCategorys = async () => {
    let res = await axios.get('/category/list');
    // console.log(res)
    categoryOptions.value = res.data.rows.map((item) => {
        return {
            label: item.name,
            value: item.id
        }
    })
    console.log(categoryOptions.value)
}
// 选中分类时触发的函数 传入分类id
const searchByCategory = (category_id) => {
    // console.log(category_id)
    pageInfo.category_id = category_id;
    loadBlogs();
}


const toDetail = (blog) => {
    // 指定了跳转的目标路径和参数 页面跳转时，将id传到url中去
    router.push({ path: '/detail', query: { id: blog.id } })
}
const homePage = () => {
    alert("别点啦! 这里就是首页!")
}
const dashboard = () => {
    let account = sessionStorage.getItem("account")
    let password = sessionStorage.getItem("password")
    if (account == "admin" && password == 123456) {
        router.push('/dashbord')
    }
    router.push('/login')
}

let dateInfo = reactive({
    year: "2023",
    month: "6",
    day: "17",
    hours: "18",
    minutes: "00",
    seconds: "00",
})
// 实时显示时间
const updateClock = () => {
    const currentDate = new Date();

    dateInfo.year = currentDate.getFullYear();
    dateInfo.month = padZero(currentDate.getMonth() + 1); // 月份从0开始，需要加1
    dateInfo.day = padZero(currentDate.getDate());

    dateInfo.hours = padZero(currentDate.getHours());
    dateInfo.minutes = padZero(currentDate.getMinutes());
    dateInfo.seconds = padZero(currentDate.getSeconds());

}

// 补零函数
const padZero = (num) => {
    return num < 10 ? '0' + num : num;
}

// 每秒更新一次时间
setInterval(updateClock, 1000);



// 实时更新网站建立起过去的天数
var Today = 0;
var startDate = new Date("2023-06-17");
const updateCounter = ()=> {
    var today = new Date();
    var timeDiff = today.getTime() - startDate.getTime();
    var daysPassed = Math.floor(timeDiff / (1000 * 3600 * 24));
    Today = daysPassed
}
setInterval(updateCounter, 1000);


</script>

<style scoped>
.indfirst {
    width: 100%;
    height: 100vh;
    background-image: url(../images/5e4ce1babea32.jpg);
    background-size: cover;
}

.indbox {
    width: 1600px;
    margin: 0 auto;
    display: flex;
    justify-content: space-around;
}

header {
    height: 70px;
    background-color: #fff;
    font-size: 30px;
    font-weight: bold;
    text-align: center;
    line-height: 70px;
}

.personalInfo {
    width: 300px;
    height: 510px;
    background-color: rgba(0, 0, 0, .3);
    border-radius: 16px;
    margin-top: 30px;
    padding-top: 12px;
    box-sizing: border-box;
    transition: all 0.3s;
}

.personalInfo:hover {
    box-shadow: 5px 3px 3px rgba(255, 255, 255, .4);
}

.headerImg {
    width: 120px;
    height: 120px;
    overflow: hidden;
    border-radius: 50%;
    margin: 0 auto;
}

.headerImg img {
    width: 100%;
    height: 100%;
}

.signature {
    color: #fff;
    text-align: center;
    font-size: 18px;
}

.technology {
    text-align: center;
    color: aliceblue;
}

.contact {
    display: flex;
    width: 84%;
    margin: 0 auto;
    justify-content: space-around;
}

.contact>span {
    margin-top: 30px;
}

.contact>span>a {
    display: inline-block;
    text-decoration: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: rgb(176, 196, 222);
    overflow: hidden;
    text-align: center;
    transition: all 1s;
    cursor: pointer;
}

.contact>span>a img {
    width: 60%;
    height: 60%;
    margin-top: 20%;
}

.contact>span>a:hover {
    transform: rotate(360deg);
}

main {
    width: 700px;
    ;
}

main img {
    width: 100%;
    height: 300px;
    margin-top: 30px;
    border-radius: 18px;
}

#clock {
    width: 300px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    font-family: 'Roboto', sans-serif;
    font-size: 44px;
    color: #fff;
    padding: 20px;
    border-radius: 10px;
}

#clock>article {
    display: flex;
}


#clock span {
    padding: 0 5px;
}

.tag {
    width: 260px;
    height: 400px;
    background-color: rgba(0, 0, 0, .3);
    border-radius: 16px;
    margin-top: 30px;
    padding-top: 12px;
    box-sizing: border-box;
    transition: all 0.3s;
}

.tag .tags {
    display: flex;
    flex-wrap: wrap;
}

.tag .tags span {
    padding: 0px 8px;
    border-radius: 4px;
    margin: 10px 3px 3px 5px;
    color: white;
    cursor: pointer;
    transition: all 0.2s;
}

.tag .tags span:hover {
    box-shadow: 1px 1px 1px white;
}

nav {
    display: flex;
    border-bottom: 2px solid #fbbd08;
    padding: 0 10px 10px;
    color: white;
    align-items: center;
}

nav img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
}

.search {
    margin-bottom: 15px;
}

.container_box {
    width: 100%;
    background: linear-gradient(to right, #FDFDFC, #87CEFA, #B2DBE3, #FDFDFC);
}

.container {
    width: 1000px;
    margin-left: 12%;
    height: 100vh;
    position: relative;

}

.nav {
    display: flex;
    font-size: 20px;
    padding-top: 20px;
    color: #64676a;
}

.nav>div {
    cursor: pointer;
    margin-right: 15px;
}

.nav>div:hover {
    color: #f60;
}

.nav>div span {
    font-size: 12px;
}

.footer {
    text-align: center;
    line-height: 25px;
    color: #64676a;
}

.ncards {
    border-radius: 12px;
    background-color: transparent;
    border: 1px solid #999;
    box-shadow: 3px 3px 2px #ccc;
}

.left_cardsOne {
    width: 260px;
    height: 200px;
    background-color: transparent;
    position: absolute;
    right: -360px;
    top: 150px;
    border-radius: 12px;
    border: 1px solid #ccc;
    padding: 8px;
}

.left_cardsTwo {
    width: 260px;
    height: 200px;
    background-color: transparent;
    position: absolute;
    right: -360px;
    top: 390px;
    border-radius: 12px;
    border: 1px solid #ccc;
    padding: 8px;
}

.content_img {
    position: absolute;
    right: 12%;
    top: 30%;

}

.sides {
    display: flex;
    background-color: transparent;
    align-items: center;
    box-shadow: 1px 2px 3px #ccc;
}

.sides img {
    width: 20px;
    height: 20px;
}
</style>