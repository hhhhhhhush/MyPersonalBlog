// 使用解构方式，从vue-router中导入两个函数
import { createRouter,createWebHashHistory } from 'vue-router'

// 声明一个空数组，用于存储路由配置
let routes = [
    { path:"/test",component:()=> import('../views/Test.vue') },
    { path:"/",component:()=> import('../views/HomePage.vue') },
    { path:"/login",component:()=> import('../views/Login.vue') },
    { path:"/detail",component:()=> import('../views/Detail.vue') },
    // 这个有二级路由
    { 
        path:"/dashbord",component:()=> import('../views/dashbord/Dashboard.vue'),children:[
            { path:"/dashbord/category",component:()=>import('../views/dashbord/Category.vue')},
            { path:"/dashbord/article",component:()=>import('../views/dashbord/Article.vue')},
        ] 
    },
];

// 创建路由实例
// 实例进行路由导航、监听路由变化、获取路由参数
const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export { routes,router }