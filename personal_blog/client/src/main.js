/*
axios
pinia
sass
vue-router @4
naive-ui  安装npm i -D naive-ui   字体npm i -D vfonts
wangeditor  npm install @wangeditor/editor-for-vue@next --save
*/
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 引入naive ui框架
import naive from 'naive-ui';
// 引入和独立api
import { createDiscreteApi } from 'naive-ui'
// 引入路由
import { router } from './router/router'
// 通过解构语法只导入了createPinia对象，而不是抛出的全部模块，减少内存使用
import { createPinia } from 'pinia'
// 引入axios
import axios from 'axios'
// 引入管理员状态管理库
import { AdminStore } from './stores/AdminStore'

// 设置了默认的请求基础 URL 后，在发送具体的请求时，你只需要提供相对路径即可，Axios 会自动将其拼接到基础 URL 上
// demo ===> axios.get('/api/users')  上述代码将发送一个 GET 请求到 "http://localhost:8080/api/users"。
axios.defaults.baseURL = "http://localhost:3030";
// 从独立api中引入这些对象
const { message, notification, dialog } = createDiscreteApi(['message', 'dialog', 'notification']);


const app = createApp(App)
// 将axios注册为全局属性
app.provide('axios',axios);
// 注册这些独立api为全局属性
app.provide('message',message);
app.provide('notification',notification);
app.provide('dialog',dialog);
// 把基准url注册为全局属性
app.provide('server_url',axios.defaults.baseURL);

// 使用naive插件
app.use(naive)
app.use(createPinia());
app.use(router);

const adminStore = AdminStore();
// 拦截器 每一个请求都会被拦截，给header添加token
axios.interceptors.request.use((config)=>{
    // 这里要在pinia绑定之后才能使用，所以注意书写位置
    config.headers.token = adminStore.token;
    return config;
})

app.mount("#app");   


// createApp(App).mount('#app')
