<template>
    <div>
        <!-- 默认载入名称  default-value="list" -->
        <!-- default-value="list" ====>  :v-model:value="tabValue" -->
        <n-tabs v-model:value="tabValue" justify-content="start" type="line">
            <!-- name就是个这个路由添加一个名称 -->
            <n-tab-pane name="list" tab="文章列表">
                <div v-for="(blog, index) in blogListInfo" style="margin-bottom:15px;">
                    <n-card :title="blog.title">
                        {{ blog.content }}
                        <template #footer>
                            <n-space align="center">
                                <div>发布时间:{{ blog.create_time }}</div>
                                <!-- 点击修改文章，跳到修改页面 -->
                                <n-button @click="toUpdate(blog)">修改</n-button>
                                <n-button @click="toDelete(blog)">删除</n-button>
                            </n-space>
                        </template>
                    </n-card>
                </div>
                <n-space>
                    <!-- pageNum在总页码数(pageCount)中循环渲染-->
                    <div v-for="pageNum in pageInfo.pageCount" @click="toPage(pageNum)">
                        <div :style="'color:' + (pageNum == pageInfo.page ? 'red' : '')" class="pageNum">
                            {{ pageNum }}
                        </div>
                    </div>
                </n-space>  
            </n-tab-pane>
            <n-tab-pane name="add" tab="添加文章">
                <n-form>
                    <n-form-item label="标题">
                        <n-input v-model:value="addArticle.title" placeholder="请输入标题" />
                    </n-form-item>
                    <n-form-item label="分类">
                        <!-- 将后台传入的id和name赋值给categoryOptions 与配置的选项绑定 -->
                        <n-select v-model:value="addArticle.category_id" :options="categoryOptions" />
                    </n-form-item>
                    <n-form-item label="内容">
                        <rich-text-editor v-model="addArticle.content"></rich-text-editor>
                    </n-form-item>
                    <n-form-item label="">
                        <n-button @click="add">提交</n-button>
                    </n-form-item>
                </n-form>
            </n-tab-pane>
            <n-tab-pane name="update" tab="修改">
                <n-form>
                    <n-form-item label="标题">
                        <n-input v-model:value="updateArticle.title" placeholder="请输入标题" />
                    </n-form-item>
                    <n-form-item label="分类">
                        <!-- 将后台传入的id和name赋值给categoryOptions 与配置的选项绑定 -->
                        <n-select v-model:value="updateArticle.category_id" :options="categoryOptions" />
                    </n-form-item>
                    <n-form-item label="内容">
                        <rich-text-editor v-model="updateArticle.content"></rich-text-editor>
                    </n-form-item>
                    <n-form-item label="">
                        <n-button @click="update">提交</n-button>
                    </n-form-item>
                </n-form>
            </n-tab-pane>
        </n-tabs>
        <!-- {{ addArticle.content }} -->
    </div>
</template>

<script setup>

import { ref, reactive, inject, onMounted } from 'vue'

// 引入富文本组件
import RichTextEditor from '../../components/RichTextEditor.vue'

const message = inject('message')
const axios = inject('axios');


// 添加文章数组
const addArticle = reactive({
    category_id: 0,
    title: "",
    content: "",
})
// 修改文章数组
const updateArticle = reactive({
    id: 0,
    category_id: 0,
    title: "",
    content: "",
})
// 存储选项信息
const categoryOptions = ref([]);
// 存储所有博客信息
const blogListInfo = ref([]);
// 双绑的变量
const tabValue = ref("list");

// 分页信息
const pageInfo = reactive({
    page: 1, //起始页码默认第一页
    pageSize: 4,  //每页三条博客 自己定义
    pageCount: 0, //总页数
    count: 0, //后台博客总数
})

onMounted(() => {
    loadCategorys();
    loadBlogs();
})

// 加载所有博客
const loadBlogs = async () => {
    // 在加载博客的时候就传入分页内容（ 页码和每页几条数据(博客) ）  默认起始页码传入第一页
    let res = await axios.get(`/blog/search?page=${pageInfo.page}&pageSize=${pageInfo.pageSize}`);
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
    // console.log(res)
}

// 加载选项列表
const loadCategorys = async () => {
    let res = await axios.get('/category/list');
    console.log(res.data.rows)
    categoryOptions.value = res.data.rows.map((item) => {
        return {
            label: item.name,
            value: item.id
        }
    })
    // console.log(categoryOptions.value)
}

// 修改数据
const toUpdate = async (blog) => {
    tabValue.value = "update";
    // 获取单条博客的数据
    let res = await axios.get("/blog/detail?id=" + blog.id);
    // console.log(res)
    updateArticle.id = blog.id;
    updateArticle.title = res.data.rows[0].title;
    updateArticle.content = res.data.rows[0].content;
    updateArticle.category_id = res.data.rows[0].category_id;
}

// 提交数据
const add = async () => {
    let res = await axios.post('/blog/_token/add', addArticle);
    // console.log(res)
    if (res.data.code == 200) {
        loadCategorys();
        loadBlogs();
        message.info(res.data.msg)
        // addArticle.title = "";
        // addArticle.categoryId = "";
        // addArticle.content = "666";

    } else {
        message.error(res.data.msg)
    }
    // tabValue.value = "list";
}


// 修改数据
const update = async () => {
    let res = await axios.put('/blog/_token/update', updateArticle);
    // console.log(res)
    if (res.data.code == 200) {
        message.info(res.data.msg);
        loadBlogs();
        // 复原默认加载页面
        tabValue.value = 'list';
    } else {
        message.error(res.data.msg);
    }
}

const toDelete = async (blog) => {
    if (confirm("您确定要删除此文章吗?")) {
        let res = await axios.delete("/blog/_token/delete?id=" + blog.id);
        if (res.data.code == 200) {
            message.info(res.data.msg);
            loadBlogs();
        } else {
            message.error(res.data.msg);
        }
    }
    else {
        return;
    }

}

const toPage = async (pageNum) => {
    // pageInfo.page是一开始在url中传入的 然后将传入的pageNum赋值给页码
    pageInfo.page = pageNum;
    loadBlogs();
}
</script>

<style scoped>
.pageNum {
    width: 30px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    border: 1px solid #eee;
    cursor: pointer;
    transition: all 0.3s;
}

.pageNum:hover {
    border: 1px solid red;
    color: red;
}
</style>