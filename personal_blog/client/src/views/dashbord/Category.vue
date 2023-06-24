<template>
    <div>
        <n-button @click="showAddModal = true" style="margin-bottom: 20px;">添加分类</n-button>
        <n-table :bordered="false" :single-line="false">
            <thead>
                <tr>
                    <th>编号</th>
                    <th>名称</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(category, index) in categoryList" :key="index">
                    <td>{{ category.id }}</td>
                    <td>{{ category.name }}</td>
                    <td>
                        <n-space>
                            <n-button @click="toUpdate(category)">修改</n-button>
                            <n-button @click="deleteCategory(category)">删除</n-button>
                        </n-space>
                    </td>
                </tr>
            </tbody>
        </n-table>
        <!-- 第一个模态框 -->
        <n-modal v-model:show="showAddModal" preset="dialog" title="Dialog">
            <template #header>
                <div>添加分类</div>
            </template>
            <div>
                <n-input v-model:value="addCategory.name" type="text" placeholder="请输入名称" />
            </div>
            <template #action>
                <div>
                    <n-button @click="add">提交</n-button>
                </div>
            </template>
        </n-modal>
        <!-- 第二个模态框 -->
        <n-modal v-model:show="showUpdateModal" preset="dialog" title="Dialog">
            <template #header>
                <div>修改分类</div>
            </template>
            <div>
                <n-input v-model:value="updateCategory.name" type="text" placeholder="请输入名称" />
            </div>
            <template #action>
                <div>
                    <n-button @click="modify">提交</n-button>
                </div>
            </template>
        </n-modal>  
    </div>
</template>

<script setup>
import { ref, reactive, inject, onMounted } from 'vue'

const message = inject('message')
const dialog = inject('dialog')
const axios = inject('axios');


const showAddModal = ref(false);
const showUpdateModal = ref(false);

const categoryList = ref([]);
const addCategory = reactive({
    name: ""
})
const updateCategory = reactive({
    id: 0,
    name: ""
})

onMounted(() => {
    loadDatas();
})

// 加载数据
const loadDatas = async function () {
    let res = await axios.get('/category/list');
    // 把请求过来的数据赋值给categoryList
    categoryList.value = res.data.rows;
    // console.log(res)
    // console.log(categoryList.value)
}

// 添加功能
const add = async function () {
    // 这个添加需要验证token
    let res = await axios.post('/category/_token/add', { name: addCategory.name });
    console.log(res)
    if (res.data.code == 200) {
        loadDatas();
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    // 隐藏模态框
    showAddModal.value = false;
}

// 弹出模态框的函数
// 点击修改弹出模态框 将输入的id和分类名传给模态框
const toUpdate = async function(category) {
    showUpdateModal.value = true;
    updateCategory.id = category.id;
    updateCategory.name = category.name;
}


// 修改数据功能
const modify = async function() {
    let res = await axios.put("/category/_token/update",{ id:updateCategory.id,name: updateCategory.name })
    if (res.data.code == 200) {
        loadDatas();
        message.info(res.data.msg)
    } else {
        message.error(res.data.msg)
    }
    showUpdateModal.value = false;
}

// 删除功能
const deleteCategory = async function (category) {
    // 使用注入的dialog
    dialog.warning({
        title: "警告",
        content: "是否删除?",
        positiveText: "确定",
        negativeText: "取消",
        onPositiveClick: async () => {
            let res = await axios.delete(`/category/_token/delete?id=${category.id}`);
            if (res.data.code == 200) {
                loadDatas();
                message.info(res.data.msg);
            } else {
                message.error(res.data.msg);
            }
            // message.success("确定");
        },
        // onNegativeClick: () => {
        //     // message.error("不确定");
        // }
    })


}
</script>

<style scoped></style>