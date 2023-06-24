// defineStore函数 用于定义和创建一个状态管理的Store 
// 该对象包含了一些状态和方法，用于在应用程序的不同组件之间共享和管理数据
import { defineStore } from 'pinia'

// 创建一个Store对象
export const AdminStore = defineStore("admin",{
    state() {
        return {
            id: 0,
            account: "",
            token: ""
        }
    },
    actions: {

    },
    getters: {
        
    }
})