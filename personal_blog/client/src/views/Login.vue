<template>
    <div class="bg">
        <div class="login-panel">
            <div class="backToInd" @click="backToInd">
                <n-button>返回首页</n-button>
            </div>
            <n-card title="后台管理登录" class="loginbox">
                <!-- rules和model动态属性与下面的rules、admin里的数据相关联 -->
                <n-form :rules="rules" :model="admin">
                    <!-- path 属性用于指定表单项对应的数据字段路径 -->
                    <!-- path="account"：指定了该表单项与 admin 对象的 account 字段关联 -->
                    <n-form-item path="account" label="账号">
                        <n-input v-model:value="admin.account" placeholder="请输入账号" class="n-input" />
                    </n-form-item>
                    <n-form-item path="password" label="密码">
                        <n-input v-model:value="admin.password" type="password" placeholder="请输入密码" @keyup.enter="login" class="n-input"/>
                    </n-form-item>
                </n-form>
                <!-- 组件中的底部插入自定义的内容。具体来说，在插槽中添加了一个复选框和一个登录按钮。 -->
                <!-- 当复选框的选中状态发生变化时，admin.rember 的值也会更新；而点击登录按钮时，会触发 login 方法。 -->
                <template #footer>
                    <n-checkbox v-model:checked="admin.rember" label="记住我" />
                    <n-button @click="login">登录</n-button>
                </template>
            </n-card>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive,inject } from 'vue'
// 引入我的管理员状态管理库
import { AdminStore } from '../stores/AdminStore'
// 引入路由中的两个函数
import { useRouter,useRoute } from 'vue-router'
const router = useRouter();
const route = useRoute();

// 注入组件提示信息
const message = inject('message')
//注入axios 这里的名字需要和前面provide里的名字一样
const axios = inject('axios');
// 实例化adminstore
const adminStore = AdminStore();



//验证表单规则
let rules = {
    account: [
        { required: true, message: "请输入账号", trigger: "blur" },
        { min: 3, max: 12, message: "账号长度在 3 到 12 个字符", trigger: "blur" },
    ],
    password: [
        { required: true, message: "请输入密码", trigger: "blur" },
        { min: 6, max: 18, message: "密码长度在 6 到 18 个字符", trigger: "blur" },
    ],
};

// 这里的账号密码就会和用户输入的账号密码双向绑定
const admin = reactive({
    account: localStorage.getItem("account") || "",
    password: localStorage.getItem("password") || "",
    rember: localStorage.getItem("rember") == 1 || false,
    // 记住我功能
    rember: false
})

// 用户登录 login方法
// axios本来就是封装了promise 所以可以直接async await来写
const login = async ()=> {
    let result = await axios.post("/admin/login", {
        // 将用户输入的数据发送到后台数据库进行对比
        account: admin.account,
        password: admin.password
    });
    // 输出后台返回的结果
    // console.log(result);
    if( result.data.code==200 ) {
        adminStore.id = result.data.data.id;
        adminStore.account = result.data.data.account;
        adminStore.token = result.data.data.token;

        if( admin.rember )
        {
            localStorage.setItem("account",admin.account);
            localStorage.setItem("password",admin.password);
            localStorage.setItem("rember",admin.rember?1:0)
        }
        router.push('/dashbord/article');
        // 使用信息组件
        message.info("登录成功");
    } else {
        message.error("登录失败");
    }
}


// 返回首页
const backToInd  = () => {
    router.push("/")
}
</script>

<style scoped>
.bg {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    background-image: url(../images/bg.jpg);
}
.login-panel {
    width: 500px;
    margin: 300px auto 0;
    position: relative;
    border-radius: 16px;
}
.backToInd {
    position: absolute;
    z-index: 1;
    top: -50px;
}
.loginbox {
    border-radius: 8px;
    background-color: transparent;
}
.n-input {
    background-color: rgb(240,255,255);
}
</style>