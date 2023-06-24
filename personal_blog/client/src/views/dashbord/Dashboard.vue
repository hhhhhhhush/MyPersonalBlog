<template>
    <div class="main-panel">
        <div class="menus">
            <div v-for="(menu, index) in menus" @click="toPage(menu)">
                {{ menu.name }}
            </div>
        </div>
        <div style="padding: 20px; width:100%;">
            <router-view></router-view>
        </div>
    </div>
    <div class="title">后台管理系统</div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
const router = useRouter();

let menus = [
    {
        name: "文章管理",
        href: "/dashbord/article"
    },
    {
        name: "分类管理",
        href: "/dashbord/category"
    },
    {
        name: "回到首页",
        href: "/"
    },
    {
        name: "退出",
        href: "logout"
    },
];

const toPage = (menu) => {
    if (menu.href == 'logout') {
        const ensure = "您确定要退出吗?"
        if (confirm(ensure)) {
            router.push("/login");
        }
        else {
            return;
        }
    }
    else {
        router.push(menu.href)
    }
}


</script>



<style scoped>
.main-panel {
    display: flex;
    color: #64676a;
    max-width: 1500px;
}

.menus {
    padding: 20px 0px;
    box-sizing: border-box;
    line-height: 55px;
    text-align: center;
    width: 180px;
    height: 95vh;
    border-right: 1px solid #dadada;
}

.menus>div:hover {
    cursor: pointer;
    color: #fd760e;
}

.title {
    font-size: 65px;
    font-weight: bold;
    text-align: right;
    position: fixed;
    color: rgba(0, 0, 0, 20%);
    right: calc((100vw - 1500px) /2);
    bottom: 20px;
}
</style>