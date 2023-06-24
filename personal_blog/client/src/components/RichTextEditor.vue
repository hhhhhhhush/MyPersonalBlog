<template>
    <div>
        <Toolbar :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" style="border-bottom: 1px solid #ccc" />
        <Editor :defaultConfig="editorConfig" :mode="mode" v-model="valueHtml" style="height: 400px; overflow-y: hidden"
            @onCreated="handleCreated" @onChange="handleChange" />
    </div>
</template>

<script setup>
import '@wangeditor/editor/dist/css/style.css';
import { ref, inject, onMounted, onBeforeUnmount, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

// 把基准url拿过来
const server_url = inject("server_url");
// 编辑器实例，必须用 shallowRef，重要！
const editorRef = shallowRef();
// 在配置中屏蔽视频上传功能 excludeKeys:["uploadVideo"] 花括号内没有参数代表使用全部工具
const toolbarConfig = { excludeKeys: ["uploadVideo"] };
const editorConfig = { placeholder: '请输入内容...' };
const mode = ref("default")
// 指定上传图片服务器地址 完整地址
editorConfig.MENU_CONF = {};
editorConfig.MENU_CONF['uploadImage'] = {
    // 小于该值就插入 base64 格式（而不上传），默认为 0
    base64LimitSize: 10 * 1024, // 10kb
    //  server: 'http://localhost:3030/update/rich_editor_upload',
    server: server_url + '/upload/rich_editor_upload',
}
// 在插入图片之前会执行的配置 拼接完整地址,加上http://8080  图片大小不超过2mb
editorConfig.MENU_CONF['insertImage'] = {
    parseImageSrc: (src) => {
        if (src.indexOf("http") !== 0) {
            return `${server_url}${src}`
        }
        return src
    }
}

const valueHtml = ref("");

// defineProps 函数用于定义组件接收的属性(props)。
// 在这段代码中，props 对象中定义了一个属性 modelValue
// 使用该组件时，传递给 modelValue 的值将被强制为字符串类型
const props = defineProps({
    modelValue: {
        type: String,
        default: ""
    }
})

const emit = defineEmits(["update:model-value"])
let initFinished = false;

onMounted(() => {
    setTimeout(() => {
        valueHtml.value = props.modelValue;
        initFinished = true;
    }, 10);
}),

    // 组件销毁时，也及时销毁编辑器，重要！
    onBeforeUnmount(() => {
        const editor = editorRef.value;
        if (editor == null) return;
        editor.destroy();
    });
// 编辑器回调函数
const handleCreated = (editor) => {
    // console.log('created', editor);
    editorRef.value = editor; // 记录 editor 实例，重要！
};
const handleChange = (editor) => {
    // console.log('change:', editor.getHtml());
    // 初始化
    if (initFinished) {
        emit("update:model-value", valueHtml.value);
    }
};


</script>

<style scoped></style>